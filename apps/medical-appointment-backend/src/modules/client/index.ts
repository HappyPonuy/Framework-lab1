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

    async get(path: string, options?: RequestInit) {
        const response = await fetch(`${this.baseURL}${path}`, {
            method: "GET",
            headers: this.defaultHeaders,
            ...options,
        });
        return response.json();
    }

    async post(path: string, body: any, options?: RequestInit) {
        const response = await fetch(`${this.baseURL}${path}`, {
            method: "POST",
            headers: this.defaultHeaders,
            body: JSON.stringify(body),
            ...options,
        });
        return response.json();
    }
}