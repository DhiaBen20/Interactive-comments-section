import useSWR from "swr";
import { User } from "../../types";
import fetchJson from "../fetchJson";

export default function useUser() {
    return useSWR<User>("currentUser", () => fetchJson("/api/currentUser"), {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    });
}