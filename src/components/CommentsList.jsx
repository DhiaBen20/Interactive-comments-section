import { Fragment } from "react";
import { useComments } from "../hooks";
import Comment from "./Comment";
import RepliesList from "./RepliesList";

function CommentsList() {
    let commentsResponse = useComments();
    let sortedComments = [...commentsResponse.data].sort(
        (a, b) => b.score - a.score
    );

    return (
        <>
            {sortedComments.map((comment) => (
                <Fragment key={comment.id}>
                    <Comment comment={comment} />
                    <RepliesList
                        replies={comment.replies}
                        commentId={comment.id}
                    />
                </Fragment>
            ))}
        </>
    );
}

export default CommentsList;
