import axios from 'axios';

export const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
    withCredentials: true,
    timeout: 10_000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

