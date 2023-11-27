import useSWR from "swr";
import fetchJson from "../fetchJson";
import { Comment } from "../../types";

export default function useComments() {
    return useSWR<Comment[]>("comments", () => fetchJson("/api/comments"));
}