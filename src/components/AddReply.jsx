import CommentForm from "./CommentForm";

export default function AddReply({ onReply, replyingTo, isReplying }) {
    return (
        isReplying && (
            <div className="mt-2">
                <CommentForm onSubmit={onReply} replyingTo={replyingTo} />
            </div>
        )
    );
}
