export class HTTPClient {
    constructor(private baseURL: string, private defaultHeaders: Record<string, string> = {}) {
        this.defaultHeaders = {
            "Content-Type": "application/json",
            ...defaultHeaders
        }
    }

    setHeaders(headers: Record<string, string>): void {
        this.defaultHeaders = headers;
    }

    private async parseResponse(response: Response) {
        const contentType = response.headers.get("Content-Type");
        if (contentType?.includes("application/json")) return response.json();
        return {};
    }

    async get(path: string, options?: RequestInit) {
        const response = await fetch(`${this.baseURL}${path}`, {
            method: "GET",
            headers: this.defaultHeaders,
            ...options,
        });
        return this.parseResponse(response);
    }

    async post(path: string, body: any, options?: RequestInit) {
        const response = await fetch(`${this.baseURL}${path}`, {
            method: "POST",
            headers: this.defaultHeaders,
            body: JSON.stringify(body),
            ...options,
        });
        return this.parseResponse(response);
    }
}