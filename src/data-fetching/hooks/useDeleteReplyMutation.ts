import { produce } from "immer";
import { Comment } from "../../types";
import fetchJson from "../fetchJson";
import { find } from "../helpers";
import useTrigger from "./useTrigger";

type TriggerArgument = {
    commentId: string;
    replyId: string;
};

export default function useDeleteReplyMutation() {
    return useTrigger<Comment[], TriggerArgument>(
        "comments",
        (arg) => {
            fetchJson(
                `/api/comments/${arg.commentId}/replies/${arg.replyId}`,
                "DELETE"
            );
        },
        (comments, arg) => {
            if (!comments) return [];

            return produce(comments, (draft) => {
                const parentComment = find(draft, arg.commentId);

                if (!parentComment) return;

                parentComment.replies.splice(
                    parentComment.replies.findIndex(
                        (reply) => reply.id == arg.replyId
                    ),
                    1
                );
            });
        }
    );
}
