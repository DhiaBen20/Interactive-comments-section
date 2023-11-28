import { useAddCommentMutation } from "../data-fetching";
import CommentForm from "./CommentForm";

export default function AddComment() {
    const { trigger } = useAddCommentMutation();

    return (
        <CommentForm
            onSubmit={(content, onSuccess) =>
                trigger({ body: { content } }, { onSuccess })
            }
        />
    );
}
