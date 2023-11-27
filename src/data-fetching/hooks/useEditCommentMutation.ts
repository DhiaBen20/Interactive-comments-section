import { produce } from "immer";
import fetchJson from "../fetchJson";
import useTrigger from "./useTrigger";
import { Comment } from "../../types";
import { find } from "../helpers";

type TriggerArgument = {
    commentId: string;
    body: {
        content: string;
    };
};

export default function useEditCommentMutation(hideForm: () => void) {
    return useTrigger<Comment[], TriggerArgument>(
        "comments",
        (arg) => {
            fetchJson(`/api/comments/${arg.commentId}`, "PATCH", arg.body);
        },
        (comments, arg) => {
            if (!comments) return [];

            return produce(comments, (draft) => {
                const editedComment = find(draft, arg.commentId);

                if (!editedComment) return;

                editedComment.content = arg.body.content;

                hideForm();
            });
        }
    );
}
