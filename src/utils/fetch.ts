let baseUrl: string = "https://v1.appbackend.io/v1/rows/JsSB7BquWwxV";

export default async function fetchData<T>(
    method: RequestInit["method"],
    body?: RequestInit["body"],
    query?: Record<string, string>
) {
    try {
        // Construct metadata
        const meta: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json"
            },
        }

        // If request has body
        if (body) {
            meta.body = body;
        }

        // If request has query params
        if (query) {
            const queryParams = new URLSearchParams(query).toString();
            baseUrl += `?${queryParams}`
        }

        // Fetch data from url
        const response = await fetch(
            baseUrl,
            meta
        );

        if (response.status !== 200) {
            throw new Error("Fetch data error");
        }

        // Parse to given type
        const result = (await response.json()).data as T;

        return result;
    } catch (error) {
        console.log(error);
    }
}