import { useState } from "react";
import {
    useAddReplyMutation,
    useDeleteReplyMutation,
    useEditReplyMutation,
    useReplyVotesMutation,
    useUser,
} from "../hooks";
import Card from "./Card";
import CommentForm from "./CommentForm";
import CommentHeader from "./CommentHeader";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";
import Modal from "./Modal";
import ReplyButton from "./ReplyButton";
import VoteControlls from "./VoteControlls";
import AddReply from "./AddReply";

export default function Reply({ reply, commentId }) {
    let [isReplying, setIsReplying] = useState(false);
    let [isEditing, setIsEditing] = useState(false);
    let [isOpen, setIsOpen] = useState(false);

    let { editReply } = useEditReplyMutation(commentId, reply.id);
    let { deleteReply } = useDeleteReplyMutation(commentId, reply.id);
    let { upvote, downvote } = useReplyVotesMutation(commentId, reply.id);
    let { addReply } = useAddReplyMutation(commentId);

    let { data: currentUser } = useUser();

    let isOwnedByCurrentUser = currentUser.username == reply.user.username;

    function handleAddReply(content) {
        addReply({ content, replyingTo: reply.user.username }, setIsReplying);
    }

    function handleEditReply(content) {
        editReply(content, setIsEditing);
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
                            upvote={upvote}
                            downvote={downvote}
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
                confirm={() => deleteReply(setIsOpen)}
                header={"Delete Reply"}
                message={
                    "Are you sure you want to delete this Reply? this will remove Reply and can't be undone"
                }
            />
        </div>
    );
}
