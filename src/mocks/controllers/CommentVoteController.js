import { notFound, res } from "../helpers";
import data from "./../data.js";

let commentVoteController = {
    store: (req, _, ctx) => {
        let comment = data.comments.find(
            (comment) => comment.id == req.params.comment
        );

        if (!comment) {
            return res(notFound("comment does not exist"));
        }

        if (!Array.isArray(comment.votes)) {
            comment.votes = [];
        }

        let vote = comment.votes.find(
            (vote) => vote.username == data.currentUser.username
        );

        if (vote && vote.type == "upvote") {
            return res(ctx.json(comment));
        }

        if (vote && vote.type == "downvote") {
            vote.type = "upvote";
            comment.score += 2;

            return res(ctx.json(comment));
        }

        comment.score++;

        comment.votes.push({
            username: data.currentUser.username,
            type: "upvote",
        });

        return res(ctx.json(comment));
    },

    destroy: (req, _, ctx) => {
        let comment = data.comments.find(
            (comment) => comment.id == req.params.comment
        );

        if (!comment) {
            return res(notFound("comment does not exist"));
        }

        if (!Array.isArray(comment.votes)) {
            comment.votes = [];
        }

        let vote = comment.votes.find(
            (vote) => vote.username == data.currentUser.username
        );

        if (vote && vote.type == "downvote") {
            return res(ctx.json(comment));
        }

        if (vote && vote.type == "upvote") {
            vote.type = "downvote";
            comment.score -= 2;

            return res(ctx.json(comment));
        }

        comment.score--;

        comment.votes.push({
            username: data.currentUser.username,
            type: "downvote",
        });

        return res(ctx.json(comment));
    },
};

export default commentVoteController;
