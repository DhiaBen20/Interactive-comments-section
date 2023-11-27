import { produce } from "immer";
import { Comment } from "../../types";
import fetchJson from "../fetchJson";
import { downvote, find } from "../helpers";
import useTrigger from "./useTrigger";

type TriggerArgument = {
    commentId: string;
    username: string;
};

export default function useCommentDownVoteMutation() {
    return useTrigger<Comment[], TriggerArgument>(
        "comments",
        (arg) => {
            console.log("downvote");
            fetchJson(`api/comments/${arg.commentId}/votes`, "DELETE");
        },
        (comments, arg) => {
            if (!comments) return [];

            return produce(comments, (draft) => {
                const votedComment = find(draft, arg.commentId);

                if (!votedComment) return;

                downvote(votedComment, arg.username);
            });
        }
    );
}
