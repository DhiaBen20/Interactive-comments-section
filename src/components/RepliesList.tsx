import Reply from "./Reply";
import type { Reply as ReplyType } from "../types";

function RepliesList({
    replies = [],
    commentId,
}: {
    replies: ReplyType[];
    commentId: ReplyType["id"];
}) {
    if (!replies.length) {
        return null;
    }

    const sortedReplies = [...replies].sort((a, b) => a.createdAt - b.createdAt);

    return (
        <div className="pl-4 md:pl-8 md:ml-8 border-l-2 border-[#eaecf1] space-y-6">
            {sortedReplies.map((reply) => (
                <Reply key={reply.id} reply={reply} commentId={commentId} />
            ))}
        </div>
    );
}

export default RepliesList;
