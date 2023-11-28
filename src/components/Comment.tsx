import { useState } from "react";
import {
    useAddReplyMutation,
    useCommentDownVoteMutation,
    useCommentUpVoteMutation,
    useDeleteCommentMutation,
    useEditCommentMutation,
} from "../data-fetching";
import useUser from "../data-fetching/hooks/useUser";
import type { Comment as CommentType } from "../types";
import AddReply from "./AddReply";
import Card from "./Card";
import CommentForm from "./CommentForm";
import CommentHeader from "./CommentHeader";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import Modal from "./Modal";
import RepliesList from "./RepliesList";
import ReplyButton from "./ReplyButton";
import VoteControlls from "./VoteControlls";

function Comment({ comment }: { comment: CommentType }) {
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isReplySubmitting, setIsReplySubmitting] = useState(false);

    const editComment = useEditCommentMutation(() => setIsEditing(false));

    const deleteComment = useDeleteCommentMutation();
    const upvote = useCommentUpVoteMutation();
    const downvote = useCommentDownVoteMutation();
    const { trigger: addReply } = useAddReplyMutation(() => {
        setIsReplying(false);
        setIsReplySubmitting(false);
    });

    const { username } = useUser().data!;

    const isOwnedByCurrentUser = username == comment.user.username;

    function handleAddReply(content: string) {
        setIsReplySubmitting(true);
        addReply({ commentId: comment.id, body: { content } });
    }

    function handleEditReply(content: string) {
        editComment({ commentId: comment.id, body: { content } });
    }

    return (
        <>
            <article>
                <Card>
                    <div className="md:flex md:gap-6 md:flex-row-reverse">
                        <div className="flex-1">
                            <CommentHeader
                                avatarURL={comment.user.image.png}
                                username={comment.user.username}
                                isOwnedByCurrentUser={isOwnedByCurrentUser}
                                createdAt={comment.createdAt}
                                onReplyClick={() => setIsReplying((ir) => !ir)}
                                onEditClick={() => setIsEditing((ie) => !ie)}
                                onDeleteClick={() => setIsOpen(true)}
                            />
                            {isEditing ? (
                                <CommentForm
                                    onSubmit={handleEditReply}
                                    prevContent={comment.content}
                                    isSubmitting={isReplySubmitting}
                                />
                            ) : (
                                <p className="text-[#67727e] mt-3">
                                    {comment.content}
                                </p>
                            )}
                        </div>
                        <div className="flex md:block justify-between items-center mt-4 md:mt-0">
                            <VoteControlls
                                score={comment.score}
                                votes={comment.votes}
                                upvote={() =>
                                    upvote({
                                        commentId: comment.id,
                                        username: username,
                                    })
                                }
                                downvote={() =>
                                    downvote({
                                        commentId: comment.id,
                                        username: username,
                                    })
                                }
                            />
                            <div className="md:hidden space-x-6">
                                {isOwnedByCurrentUser ? (
                                    <>
                                        <DeleteButton
                                            onClick={() => setIsOpen(true)}
                                        />
                                        <EditButton
                                            onClick={() =>
                                                setIsEditing((ie) => !ie)
                                            }
                                        />
                                    </>
                                ) : (
                                    <ReplyButton
                                        onClick={() =>
                                            setIsReplying((ir) => !ir)
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
                <AddReply
                    onReply={handleAddReply}
                    replyingTo={comment.user.username}
                    isReplying={isReplying}
                />
                <Modal
                    isOpen={isOpen}
                    close={() => setIsOpen(false)}
                    confirm={() => deleteComment({ commentId: comment.id })}
                    header={"Delete Comment"}
                    message={
                        "Are you sure you want to delete this comment? this will remove comment and can't be undone"
                    }
                />
            </article>
            <RepliesList replies={comment.replies} commentId={comment.id} />
        </>
    );
}

export default Comment;
