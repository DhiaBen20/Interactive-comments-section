import { Comment } from "../../types";
import fetchJson from "../fetchJson";
import useTrigger from "./useTrigger";

type TriggerArgument = {
    commentId: string;
};

export default function useDeleteCommentMutation() {
    return useTrigger<Comment[], TriggerArgument>(
        "comments",
        (arg) => {
            fetchJson(`/api/comments/${arg.commentId}`, "DELETE");
        },
        (comments, arg) => {
            if (!comments) return [];

            return comments.filter((c) => c.id !== arg.commentId);
        }
    );
}
