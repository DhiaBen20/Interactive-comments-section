export function relativeDate(ms: number) {
    ms = Date.now() - ms;

    const seconds = ms / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const weeks = days / 7;
    const months = days / 30;
    const years = months / 12;

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

function plural(str: string, qty: number) {
    return `${Math.round(qty)} ${str}${Math.round(qty) == 1 ? "" : "s"}`;
}
