type FetchJsonMethod = "GET" | "POST" | "PATCH" | "DELETE";

export default async function fetchJson(
    url: string,
    method: FetchJsonMethod = "GET",
    body?: object
) {
    const res = await fetch(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            "content-type": "application/json",
        },
    });

    let data;

    try {
        // the api sometimes returns an empty body,
        // parsing the body using `.json()` method will cause an error,
        // for me i don't see this an error that should be handled
        data = await res.json();
    } catch (error) {
        return;
    }

    return data;
}
