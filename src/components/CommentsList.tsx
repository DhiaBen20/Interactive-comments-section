import type { Comment as CommentType } from "../types";
import Comment from "./Comment";

function CommentsList({ comments }: { comments: CommentType[] }) {
    const sortedComments = [...comments].sort((a, b) => b.score - a.score);

    return (
        <>
            {sortedComments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
            ))}
        </>
    );
}

export default CommentsList;
