import { produce } from "immer";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { downvote, fetchJson, find, getVotedItem, upvote } from "./helpers";

export function useUser() {
    return useSWR(
        "currentUser",
        () => fetch("/api/currentUser").then((res) => res.json()),
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );
}

export function useComments() {
    return useSWR("comments", () =>
        fetch("/api/comments").then((res) => res.json())
    );
}

export function useAddReplyMutation(commentId) {
    let mutation = useSWRMutation("comments", (_, { arg: body }) =>
        fetchJson(`/api/comments/${commentId}/replies`, "POST", body)
    );

    return {
        mutation,
        addReply: (body, setIsReplying) => {
            mutation.trigger(body, { onSuccess: () => setIsReplying(false) });
        },
    };
}

export function useEditCommentMutation(commentId) {
    let mutation = useSWRMutation("comments", (_, { arg: { content } }) =>
        fetchJson(`/api/comments/${commentId}`, "PATCH", { content })
    );

    return {
        mutation,
        editComment: (content, setIsEditing) => {
            mutation.trigger(
                { content },
                {
                    optimisticData: (comments) => {
                        return produce(comments, (draft) => {
                            find(draft, commentId).content = content;
                        });
                    },
                    rollbackOnError: true,
                }
            );
            setIsEditing(false);
        },
    };
}

export function useDeleteCommentMutation(commentId) {
    let mutation = useSWRMutation("comments", (_, { arg: {} }) =>
        fetchJson(`/api/comments/${commentId}`, "DELETE")
    );

    return {
        mutation,
        deleteComment: (setIsOpen) => {
            mutation.trigger(
                {},
                {
                    optimisticData: (comments) => {
                        return comments.filter((c) => c.id !== commentId);
                    },
                    rollbackOnError: true,
                }
            );
            setIsOpen(false);
        },
    };
}

export function useCommentVotesMutation(commentId) {
    let { data: currentUser } = useUser();

    let mutation = useSWRMutation("comments", (_, { arg: { method } }) =>
        fetchJson(`api/comments/${commentId}/votes`, method)
    );

    return {
        mutation,
        upvote: () => {
            !mutation.isMutating &&
                mutation.trigger(
                    { method: "POST" },
                    {
                        rollbackOnError: true,
                        optimisticData: (comments) => {
                            if (!currentUser) return comments;
                            let { username } = currentUser;

                            return produce(comments, (draft) => {
                                let votedComment = getVotedItem(
                                    draft,
                                    commentId
                                );

                                upvote(votedComment, username);
                            });
                        },
                    }
                );
        },
        downvote: () => {
            !mutation.isMutating &&
                mutation.trigger(
                    { method: "DELETE" },
                    {
                        rollbackOnError: true,
                        optimisticData: (comments) => {
                            if (!currentUser) return comments;
                            let { username } = currentUser;

                            return produce(comments, (draft) => {
                                let votedComment = getVotedItem(
                                    draft,
                                    commentId
                                );

                                downvote(votedComment, username);
                            });
                        },
                    }
                );
        },
    };
}

export function useEditReplyMutation(commentId, replyId) {
    let mutation = useSWRMutation("comments", (_, { arg: { content } }) =>
        fetchJson(`/api/comments/${commentId}/replies/${replyId}`, "PATCH", {
            content,
        })
    );

    return {
        mutation,
        editReply: (content, setIsEditing) => {
            mutation.trigger(
                {
                    content,
                },
                {
                    optimisticData: (comments) => {
                        return produce(comments, (draft) => {
                            let parentComment = find(draft, commentId);

                            let editedReply = find(
                                parentComment.replies,
                                replyId
                            );

                            editedReply.content = content;
                        });
                    },
                    rollbackOnError: true,
                }
            );
            setIsEditing(false);
        },
    };
}

export function useDeleteReplyMutation(commentId, replyId) {
    let mutation = useSWRMutation("comments", (_, { arg: {} }) =>
        fetchJson(`/api/comments/${commentId}/replies/${replyId}`, "DELETE")
    );

    return {
        mutation,
        deleteReply: (setIsOpen) => {
            mutation.trigger(
                {},
                {
                    optimisticData: (comments) => {
                        return produce(comments, (draft) => {
                            let parentComment = find(draft, commentId);

                            parentComment.replies.splice(
                                parentComment.replies.findIndex(
                                    (reply) => reply.id == replyId
                                ),
                                1
                            );
                        });
                    },
                    rollbackOnError: true,
                }
            );
            setIsOpen(false);
        },
    };
}

export function useReplyVotesMutation(commentId, replyId) {
    let { data: currentUser } = useUser();

    let mutation = useSWRMutation("comments", (_, { arg: { method } }) =>
        fetchJson(`api/comments/${commentId}/replies/${replyId}/votes`, method)
    );

    function upvoteReplyOptimistically(comments) {
        if (!currentUser) return comments;

        let { username } = currentUser;

        return produce(comments, (draft) => {
            let commentParent = find(draft, commentId);
            let votedReply = getVotedItem(commentParent.replies, replyId);

            upvote(votedReply, username);
        });
    }

    function downvoteReplyOptimistically(comments) {
        if (!currentUser) return comments;

        let { username } = currentUser;

        return produce(comments, (draft) => {
            let commentParent = find(draft, commentId);
            let votedReply = getVotedItem(commentParent.replies, replyId);

            downvote(votedReply, username);
        });
    }

    return {
        mutation,
        upvote: () => {
            !mutation.isMutating &&
                mutation.trigger(
                    { method: "POST" },
                    {
                        rollbackOnError: true,
                        optimisticData: upvoteReplyOptimistically,
                    }
                );
        },
        downvote: () => {
            !mutation.isMutating &&
                mutation.trigger(
                    { method: "DELETE" },
                    {
                        rollbackOnError: true,
                        optimisticData: downvoteReplyOptimistically,
                    }
                );
        },
    };
}
