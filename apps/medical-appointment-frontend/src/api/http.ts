import axios from 'axios';

const commonConfig = {
    baseURL: import.meta.env.VITE_API_URL as string,
    withCredentials: true,
    timeout: 10_000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

export const http = axios.create(commonConfig);

export const authHttp = axios.create(commonConfig);

