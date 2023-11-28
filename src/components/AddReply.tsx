import CommentForm from "./CommentForm";

type AddReplyProps = {
    onReply: (...args: any) => void;
    replyingTo: string;
    isReplying: boolean;
};

export default function AddReply({
    onReply,
    replyingTo,
    isReplying,
}: AddReplyProps) {
    return isReplying ? (
        <div className="mt-2">
            <CommentForm onSubmit={onReply} replyingTo={replyingTo} />
        </div>
    ) : null;
}
