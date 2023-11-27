import { produce } from "immer";
import { Comment } from "../../types";
import fetchJson from "../fetchJson";
import { find, upvote } from "../helpers";
import useTrigger from "./useTrigger";

type TriggerArgument = {
    commentId: string;
    replyId: string;
    username: string;
};

export default function useReplyUpVoteMutation() {
    return useTrigger<Comment[], TriggerArgument>(
        "comments",
        (arg) => {
            fetchJson(
                `api/comments/${arg.commentId}/replies/${arg.replyId}/votes`,
                "POST"
            );
        },
        (comments, arg) => {
            if (!comments) return [];

            return produce(comments, (draft) => {
                const replyParentComment = find(draft, arg.commentId);

                if (!replyParentComment) return;

                const votedReply = find(
                    replyParentComment.replies,
                    arg.replyId
                );

                if (!votedReply) return;

                upvote(votedReply, arg.username);
            });
        }
    );
}
