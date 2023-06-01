import { useState } from "react";
import {
    useAddReplyMutation,
    useCommentVotesMutation,
    useDeleteCommentMutation,
    useEditCommentMutation,
    useUser,
} from "../hooks";
import CommentForm from "./CommentForm";
import CommentHeader from "./CommentHeader";
import VoteControlls from "./VoteControlls";
import ReplyButton from "./ReplyButton";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import Modal from "./Modal";
import Card from "./Card";
import AddReply from "./AddReply";

function Comment({ comment }) {
    let [isReplying, setIsReplying] = useState(false);
    let [isEditing, setIsEditing] = useState(false);
    let [isOpen, setIsOpen] = useState(false);

    let { editComment } = useEditCommentMutation(comment.id);
    let { deleteComment } = useDeleteCommentMutation(comment.id);
    let { upvote, downvote } = useCommentVotesMutation(comment.id);
    let { addReply } = useAddReplyMutation(comment.id);

    let currentUser = useUser()?.data;
    let isOwnedByCurrentUser = currentUser?.username == comment.user.username;

    function handleAddReply(content) {
        addReply({ content }, setIsReplying);
    }

    function handleEditReply(content) {
        editComment(content, setIsEditing);
    }

    return (
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
                                replyingTo={comment.replyingTo}
                                prevContent={comment.content}
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
                replyingTo={comment.user.username}
                isReplying={isReplying}
            />

            <Modal
                isOpen={isOpen}
                close={() => setIsOpen(false)}
                confirm={() => deleteComment(setIsOpen)}
                header={"Delete Comment"}
                message={
                    "Are you sure you want to delete this comment? this will remove comment and can't be undone"
                }
            />
        </article>
    );
}

export default Comment;
