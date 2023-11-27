import useSWRMutation from "swr/mutation";
import fetchJson from "../fetchJson";

type TriggerArgument = {
    commentId: string;
    body: {
        content: string;
        replyingTo?: string;
    };
};

function addReply(_key: string, { arg }: { arg: TriggerArgument }) {
    return fetchJson(
        `/api/comments/${arg.commentId}/replies`,
        "POST",
        arg.body
    );
}

export default function useAddReplyMutation(hideForm: () => void) {
    return useSWRMutation("comments", addReply, {
        onSuccess: () => {
            hideForm();
        },
    });
}
