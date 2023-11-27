import { produce } from "immer";
import { Comment } from "../../types";
import fetchJson from "../fetchJson";
import { find } from "../helpers";
import useTrigger from "./useTrigger";

type TriggerArgument = {
    commentId: string;
    replyId: string;
    body: {
        content: string;
    };
};

export default function useEditReplyMutation(hideForm: () => void) {
    return useTrigger<Comment[], TriggerArgument>(
        "comments",
        (arg) => {
            fetchJson(
                `/api/comments/${arg.commentId}/replies/${arg.replyId}`,
                "PATCH",
                arg.body
            );
        },
        (comments, arg) => {
            if (!comments) return [];

            return produce(comments, (draft) => {
                const parentComment = find(draft, arg.commentId);

                if (!parentComment) return;

                const editedReply = find(parentComment.replies, arg.replyId);

                if (!editedReply) return;

                editedReply.content = arg.body.content;

                hideForm();
            });
        }
    );
}
