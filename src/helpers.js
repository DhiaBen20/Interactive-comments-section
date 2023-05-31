export async function fetchJson(url, method, body) {
    if (!["POST", "PATCH", "DELETE"].includes(method)) {
        throw new Error(`method ${method} is supported`);
    }

    let options = {
        method,
    };

    if (body) {
        options.body = JSON.stringify(body);
        options.headers = {
            "content-type": "application/json",
        };
    }
    let res = await fetch(url, options);

    let data;

    try {
        // the api sometimes returns an empty body, parsing the body using `.json()` method will cause an error, for me i don't consider this an eror that should be handled
        data = await res.json();
    } catch (error) {
        return;
    }

    return data;
}

export function getVotedItem(items, votedItemId) {
    return items.find((item) => item.id == votedItemId);
}

export function getCurrentUserVote(comment, username) {
    if (!comment.votes) {
        comment.votes = [];
    }

    return comment.votes.find((vote) => vote.username == username);
}

export function upvote(votedItem, username) {
    let currentUserVote = getCurrentUserVote(votedItem, username);

    if (!currentUserVote) {
        votedItem.votes.push({ type: "upvote", username });
        votedItem.score++;
    } else if (currentUserVote.type == "downvote") {
        currentUserVote.type = "upvote";
        votedItem.score += 2;
    }
}

export function downvote(votedItem, username) {
    let currentUserVote = getCurrentUserVote(votedItem, username);

    if (!currentUserVote) {
        votedItem.votes.push({ type: "downvote", username });
        votedItem.score--;
    } else if (currentUserVote.type == "upvote") {
        currentUserVote.type = "downvote";
        votedItem.score -= 2;
    }
}

export function find(array, id) {
    return array.find((item) => item.id == id);
}

export function relativeDate(ms) {
    ms = Date.now() - ms;

    let seconds = ms / 1000;
    let minutes = seconds / 60;
    let hours = minutes / 60;
    let days = hours / 24;
    let weeks = days / 7;
    let months = days / 30;
    let years = months / 12;

    if (seconds < 60) {
        return `few seconds ago`;
    }

    if (seconds >= 60 && minutes < 60) {
        return `${plural("minute", minutes)} ago`;
    }

    if (minutes >= 60 && hours < 24) {
        return `${plural("hour", hours)} ago`;
    }

    if (days < 7) {
        return `${plural("day", days)} ago`;
    }

    if (days < 30) {
        if (weeks < 5) {
            return `${plural("week", weeks)} ago`;
        }
    }

    if (months < 12) {
        return `${plural("month", months)} ago`;
    }

    return `${plural("year", years)} ago`;
}

function plural(str, qty) {
    return `${Math.round(qty)} ${str}${Math.round(qty) == 1 ? "" : "s"}`;
}
