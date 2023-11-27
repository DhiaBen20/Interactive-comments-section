import { Comment } from "../types";

export function find(array: Comment[], id: Comment["id"]) {
    return array.find((item) => item.id == id);
}

export function upvote(comment: Comment, username: string) {
    const currentUserVote = getCurrentUserVote(comment, username);

    if (!comment.votes) {
        comment.votes = [];
    }

    if (!currentUserVote) {
        comment.votes.push({ type: "upvote", username });
        comment.score++;
    } else if (currentUserVote.type == "downvote") {
        currentUserVote.type = "upvote";
        comment.score += 2;
    }
}

export function downvote(comment: Comment, username: string) {
    const currentUserVote = getCurrentUserVote(comment, username);

    if (!comment.votes) {
        comment.votes = [];
    }

    if (!currentUserVote) {
        comment.votes.push({ type: "downvote", username });
        comment.score--;
    } else if (currentUserVote.type == "upvote") {
        currentUserVote.type = "downvote";
        comment.score -= 2;
    }
}

export function getCurrentUserVote(comment: Comment, username: string) {
    return comment.votes
        ? comment.votes.find((vote) => vote.username == username)
        : undefined;
}
