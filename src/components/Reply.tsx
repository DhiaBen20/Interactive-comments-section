import { useState } from "react";

import {
    useAddReplyMutation,
    useDeleteReplyMutation,
    useEditReplyMutation,
    useReplyDownVoteMutation,
    useReplyUpVoteMutation,
} from "../data-fetching";
import useUser from "../data-fetching/hooks/useUser";
import type { Reply as ReplyType } from "../types";
import AddReply from "./AddReply";
import Card from "./Card";
import CommentForm from "./CommentForm";
import CommentHeader from "./CommentHeader";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import Modal from "./Modal";
import ReplyButton from "./ReplyButton";
import VoteControlls from "./VoteControlls";

export default function Reply({
    reply,
    commentId,
}: {
    reply: ReplyType;
    commentId: ReplyType["id"];
}) {
    const [isReplying, setIsReplying] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const editReply = useEditReplyMutation(() => setIsEditing(false));
    const deleteReply = useDeleteReplyMutation();
    const upvote = useReplyUpVoteMutation();
    const downvote = useReplyDownVoteMutation();
    const { trigger: addReply } = useAddReplyMutation(() =>
        setIsReplying(false)
    );

    const { username } = useUser().data!;

    const isOwnedByCurrentUser = username == reply.user.username;

    function handleAddReply(content: string) {
        addReply({
            commentId,
            body: { content, replyingTo: reply.user.username },
        });
    }

    function handleEditReply(content: string) {
        editReply({
            commentId,
            replyId: reply.id,
            body: {
                content,
            },
        });
    }

    return (
        <div>
            <Card>
                <div className="md:flex md:gap-6 md:flex-row-reverse">
                    <div className="flex-1">
                        <CommentHeader
                            avatarURL={reply.user.image.png}
                            username={reply.user.username}
                            createdAt={reply.createdAt}
                            isOwnedByCurrentUser={isOwnedByCurrentUser}
                            onReplyClick={() => setIsReplying((ir) => !ir)}
                            onEditClick={() => setIsEditing((ie) => !ie)}
                            onDeleteClick={() => setIsOpen(true)}
                        />
                        {isEditing ? (
                            <CommentForm
                                onSubmit={handleEditReply}
                                replyingTo={reply.replyingTo}
                                prevContent={reply.content}
                            />
                        ) : (
                            <p className="text-[#67727e] mt-3">
                                <span className="font-bold text-[#5457b6]">
                                    {`@${reply.replyingTo} `}
                                </span>
                                {reply.content}
                            </p>
                        )}
                    </div>

                    <div className="flex md:block justify-between items-center mt-4 md:mt-0">
                        <VoteControlls
                            score={reply.score}
                            votes={reply.votes}
                            upvote={() =>
                                upvote({
                                    commentId,
                                    replyId: reply.id,
                                    username,
                                })
                            }
                            downvote={() =>
                                downvote({
                                    commentId,
                                    replyId: reply.id,
                                    username,
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
                                    onClick={() => setIsReplying((ir) => !ir)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            <AddReply
                onReply={handleAddReply}
                replyingTo={reply.user.username}
                isReplying={isReplying}
            />

            <Modal
                isOpen={isOpen}
                close={() => setIsOpen(false)}
                confirm={() => deleteReply({ commentId, replyId: reply.id })}
                header={"Delete Reply"}
                message={
                    "Are you sure you want to delete this Reply? this will remove Reply and can't be undone"
                }
            />
        </div>
    );
}
