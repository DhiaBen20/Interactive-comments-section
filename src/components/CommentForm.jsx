import { useState } from "react";
import { useUser } from "../hooks";
import Button from "./Button";
import Textarea from "./Textarea";
import Card from "./Card";

function Avatar() {
    let userResponse = useUser();

    return (
        <img
            src={userResponse.data?.image?.png}
            alt="Avatar of the comment owner"
            className="w-full leading-[0]"
        />
    );
}

function CommentForm({ onSubmit, replyingTo = "", prevContent = "" }) {
    let [loading, setLoading] = useState(false);

    replyingTo = replyingTo && `@${replyingTo} `;
    let defaultValue = `${replyingTo}${prevContent}`;

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        let textarea = e.target.comment;

        onSubmit(textarea.value.replace(replyingTo, "").trim(), () => {
            textarea.value = "";
            setLoading(false);
        });
    }

    let formStyles = `md:flex md:gap-4 ${
        prevContent ? "mt-4 flex-col" : "md:items-start md:justify-between "
    }`;

    return (
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
                        defaultValue={defaultValue}
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

                    <Button loading={loading}>
                        {prevContent ? "Update" : replyingTo ? "Reply" : "Send"}
                    </Button>
                </div>
            </form>
        </Card>
    );
}

export default CommentForm;
