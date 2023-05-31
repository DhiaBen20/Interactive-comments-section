import data from "./data.js";
import { compose, context, response } from "msw";

export function res(...transformers) {
    return response(context.delay(), ...transformers);
}

export function notFound(error) {
    return compose(context.status(404), context.json({ error }));
}

export function notAuthorized(error) {
    return compose(context.status(403), context.json({ error }));
}

export function failedValidation(error) {
    return compose(context.status(422), context.json({ error }));
}

export function commentFactory(additional = {}) {
    return {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        score: 0,
        user: data.currentUser,
        ...additional,
    };
}
