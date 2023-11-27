import { produce } from "immer";
import { Comment } from "../../types";
import fetchJson from "../fetchJson";
import { find, upvote } from "../helpers";
import useTrigger from "./useTrigger";

type TriggerArgument = {
    commentId: string;
    username: string;
};

export default function useCommentUpVoteMutation() {
    return useTrigger<Comment[], TriggerArgument>(
        "comments",
        (arg) => {
            fetchJson(`api/comments/${arg.commentId}/votes`, "POST");
        },
        (comments, arg) => {
            if (!comments) return [];

            return produce(comments, (draft) => {
                const votedComment = find(draft, arg.commentId);

                if (!votedComment) return;

                upvote(votedComment, arg.username);
            });
        }
    );
}
