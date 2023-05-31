import data from "./../data.js";

import {
    commentFactory,
    failedValidation,
    notAuthorized,
    notFound,
    res,
} from "../helpers";

let replyController = {
    store: async (req, _, ctx) => {
        let comment = data.comments.find(
            (comment) => comment.id == req.params.comment
        );

        if (!comment) {
            return res(notFound("comment does not exist"));
        }

        let body = await req.json();

        if (!body.content) {
            return res(failedValidation("reply cannot be empty"));
        }

        let reply = commentFactory({
            content: body.content,
            replyingTo: body.replyingTo ?? comment.user.username,
        });

        comment.replies.push(reply);

        return res(ctx.json(reply));
    },
    update: async (req, _, ctx) => {
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

        if (reply.user.username != data.currentUser.username) {
            return res(
                notAuthorized("You are not authorized to update this reply")
            );
        }

        let body = await req.json();

        if (!body.content) {
            return res(failedValidation("can't update reply to be empty"));
        }

        reply.content = body.content;

        return res(ctx.json(reply));
    },
    destroy: async (req, _, ctx) => {
        let comment = data.comments.find(
            (comment) => comment.id == req.params.comment
        );

        if (!comment) {
            return res(notFound("comment does not exist"));
        }

        let replyIndex = comment.replies.findIndex(
            (reply) => reply.id == req.params.reply
        );

        if (replyIndex == -1) {
            return res(notFound("reply does not exist"));
        }

        if (
            comment.replies[replyIndex].user.username !=
            data.currentUser.username
        ) {
            return res(
                notAuthorized("You are not authorized to delete this reply")
            );
        }

        comment.replies.splice(replyIndex, 1);

        return res(ctx.status(204));
    },
};

export default replyController;
