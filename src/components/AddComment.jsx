import useSWRMutation from "swr/mutation";
import CommentForm from "./CommentForm";

export default function AddComment() {
    let { trigger } = useSWRMutation("comments", (_, { arg: { content } }) =>
        fetch("/api/comments", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ content }),
        })
    );

    return (
        <CommentForm
            onSubmit={(content, onSuccess) =>
                trigger({ content }, { onSuccess })
            }
        />
    );
}
