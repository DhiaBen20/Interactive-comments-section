import { FormEvent } from "react";
import useUser from "../data-fetching/hooks/useUser";
import Button from "./Button";
import Card from "./Card";
import Textarea from "./Textarea";

function Avatar() {
    const user = useUser().data!;

    return (
        <img
            src={user.image.png}
            alt="Avatar of the comment owner"
            className="w-full leading-[0]"
        />
    );
}

type CommentFormSubmit = {
    (content: string, reset: () => void): void;
};

type CommentFormProps = {
    isSubmitting?: boolean;
    replyingTo?: string;
    prevContent?: string;

    onSubmit: CommentFormSubmit;
};

// This component serves multiple purposes: creating a new comment,
// replying to an existing comment, editing a comment, or editing a reply.
// The UI of the component varies based on the combination of
// the `prevContent` and `replyingTo` props, rather than a direct prop.
// If `prevContent` is passed, it indicates that the component is being used to edit a comment or a reply.
// If `replyingTo` is passed, it indicates that the component is being used to create a reply.

function CommentForm({
    isSubmitting,
    replyingTo = "",
    prevContent = "",
    onSubmit,
}: CommentFormProps) {
    replyingTo = replyingTo && `@${replyingTo} `;

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (e.target instanceof HTMLFormElement) {
            const textarea = e.target.comment;

            if (!textarea || !(textarea instanceof HTMLTextAreaElement)) return;

            onSubmit(textarea.value.replace(replyingTo, "").trim(), () => {
                textarea.value = "";
            });
        }
    }

    const formStyles = `md:flex md:gap-4 ${
        prevContent ? "mt-4 flex-col" : "md:items-start md:justify-between "
    }`;

    return (
        <article>
            <Card noPadding={!!prevContent}>
                <form onSubmit={handleSubmit} className={formStyles}>
                    {!prevContent && (
                        <div className={`w-9 hidden md:block`}>
                            <Avatar />
                        </div>
                    )}

                    <div className="flex-1">
                        <Textarea
                            name="comment"
                            placeholder="Add a comment..."
                            defaultValue={`${replyingTo}${prevContent}`}
                        />
                    </div>

                    <div
                        className={`flex items-center ${
                            !prevContent ? "justify-between" : "justify-end"
                        } mt-2 md:mt-0`}
                    >
                        {!prevContent && (
                            <div className={`w-9 md:hidden`}>
                                <Avatar />
                            </div>
                        )}

                        <Button loading={isSubmitting}>
                            {prevContent
                                ? "Update"
                                : replyingTo
                                ? "Reply"
                                : "Send"}
                        </Button>
                    </div>
                </form>
            </Card>
        </article>
    );
}

export default CommentForm;
