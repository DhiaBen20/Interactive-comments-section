import data from "./../data.js";
import {
    commentFactory,
    failedValidation,
    notAuthorized,
    notFound,
    res,
} from "../helpers";

let commentController = {
    index: (req, _, ctx) => {
        return res(ctx.json(data.comments));
    },

    store: async (req, _, ctx) => {
        let body = await req.json();

        if (!body.content) {
            return res(failedValidation("comment cannot be empty"));
        }

        let comment = commentFactory({ content: body.content, replies: [] });

        data.comments.push(comment);

        return res(ctx.json(comment));
    },

    update: async (req, _, ctx) => {
        let comment = data.comments.find(
            (comment) => comment.id == req.params.comment
        );

        if (!comment) {
            return res(notFound("comment does not exist"));
        }

        if (comment.user.username != data.currentUser.username) {
            return res(
                notAuthorized("You are not authorized to update this comment")
            );
        }

        let body = await req.json();

        if (!body.content) {
            return res(failedValidation("can't update comment to be empty"));
        }

        comment.content = body.content;

        return res(ctx.json(comment));
    },

    destroy: (req, _, ctx) => {
        let commentIndex = data.comments.findIndex(
            (comment) => comment.id == req.params.comment
        );

        if (commentIndex == -1) {
            return res(notFound("comment does not exist"));
        }

        if (
            data.comments[commentIndex].user.username !=
            data.currentUser.username
        ) {
            return res(
                notAuthorized("You are not authorized to delete this comment")
            );
        }

        data.comments.splice(commentIndex, 1);

        return res(ctx.status(204));
    },
};

export default commentController;
