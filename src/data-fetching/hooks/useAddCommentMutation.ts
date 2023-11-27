import useSWRMutation from "swr/mutation";
import fetchJson from "../fetchJson";

type TriggerArgument = {
    body: {
        content: string;
    };
};

function addComment(_key: string, { arg }: { arg: TriggerArgument }) {
    return fetchJson(`/api/comments`, "POST", arg.body);
}

export default function useAddCommentMutation() {
    return useSWRMutation("comments", addComment);
}
