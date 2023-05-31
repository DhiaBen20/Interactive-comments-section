import { rest } from "msw";
import commentController from "./controllers/CommentController";
import commentVoteController from "./controllers/CommentVoteController";
import replyController from "./controllers/ReplyController";
import replyVoteController from "./controllers/ReplyVoteController";
import data from "./data.js";

export let handlers = [
    rest.get("api/currentUser", (_, res, ctx) => {
        return res(ctx.json(data.currentUser));
    }),

    rest.get("api/comments", commentController.index),
    rest.post("api/comments", commentController.store),
    rest.patch("api/comments/:comment", commentController.update),
    rest.delete("api/comments/:comment", commentController.destroy),

    rest.post("api/comments/:comment/replies", replyController.store),
    rest.patch("api/comments/:comment/replies/:reply", replyController.update),
    rest.delete(
        "api/comments/:comment/replies/:reply",
        replyController.destroy
    ),

    rest.post("api/comments/:comment/votes", commentVoteController.store),
    rest.delete("api/comments/:comment/votes", commentVoteController.destroy),

    rest.post(
        "api/comments/:comment/replies/:reply/votes",
        replyVoteController.store
    ),

    rest.delete(
        "api/comments/:comment/replies/:reply/votes",
        replyVoteController.destroy
    ),
];
