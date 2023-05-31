import { notFound, res } from "../helpers";
import data from "./../data.js";

let replyVoteController = {
    store: (req, _, ctx) => {
        let comment = data.comments.find(
            (comment) => comment.id == req.params.comment
        );

        if (!comment) {
            return res(notFound("comment does not exist"));
        }

        let reply = comment.replies.find(
            (reply) => reply.id == req.params.reply
        );

        if (!reply) {
            return res(notFound("reply does not exist"));
        }

        if (!Array.isArray(reply.votes)) {
            reply.votes = [];
        }

        let vote = reply.votes.find(
            (vote) => vote.username == data.currentUser.username
        );

        if (vote && vote.type == "upvote") {
            return res(ctx.json(reply));
        }

        if (vote && vote.type == "downvote") {
            vote.type = "upvote";
            reply.score += 2;

            return res(ctx.json(reply));
        }

        reply.score++;

        reply.votes.push({
            username: data.currentUser.username,
            type: "upvote",
        });

        return res(ctx.json(reply));
    },

    destroy: (req, _, ctx) => {
        let comment = data.comments.find(
            (comment) => comment.id == req.params.comment
        );

        if (!comment) {
            return res(notFound("comment does not exist"));
        }

        let reply = comment.replies.find(
            (reply) => reply.id == req.params.reply
        );

        if (!reply) {
            return res(notFound("reply does not exist"));
        }

        if (!Array.isArray(reply.votes)) {
            reply.votes = [];
        }

        let vote = reply.votes.find(
            (vote) => vote.username == data.currentUser.username
        );

        if (vote && vote.type == "downvote") {
            return res(ctx.json(reply));
        }

        if (vote && vote.type == "upvote") {
            vote.type = "downvote";
            reply.score -= 2;

            return res(ctx.json(reply));
        }

        reply.score--;

        reply.votes.push({
            username: data.currentUser.username,
            type: "downvote",
        });

        return res(ctx.json(reply));
    },
};

export default replyVoteController;
