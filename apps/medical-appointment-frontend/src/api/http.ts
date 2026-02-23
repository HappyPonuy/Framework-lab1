import axios from 'axios';

export const http = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true,
    timeout: 10_000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

http.interceptors.request.use((config) => {
    return config;
})