import { useCallback, useEffect, useMemo } from 'react';
import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { useAuth } from '../content/AuthContext.tsx';
import type { RefreshResponseDto } from '@contracts/auth/refresh.ts';
import { RefreshRequestSchema } from '@contracts/auth/refresh.ts';

const refreshApi: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
    timeout: 5000,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});


export const useDebounce = (
    effect: () => void,
    dependencies: React.DependencyList,
    delay: number,
): void => {
    const callback = useCallback(effect, dependencies);

    useEffect(() => {
        const timeout = setTimeout(callback, delay);
        return () => clearTimeout(timeout);
    }, [callback, delay]);
};


export const useApi = (baseURL = '') => {
    const { token, setToken, logout } = useAuth();

    const api: AxiosInstance = useMemo(
        () =>
            axios.create({
                baseURL: `${import.meta.env.VITE_API_URL as string}/${baseURL}`,
                timeout: 5000,
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' },
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    useEffect(() => {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const resInt = api.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error: unknown) => {
                const axiosErr = error as {
                    config: InternalAxiosRequestConfig & { _retry?: boolean };
                    response?: { status?: number };
                };
                const originalReq = axiosErr.config;

                if (axiosErr.response?.status === 401 && !originalReq._retry) {
                    originalReq._retry = true;

                    const storedRefresh = localStorage.getItem('refresh_token') ?? '';
                    const parsed = RefreshRequestSchema.safeParse({ token: storedRefresh });

                    if (!parsed.success) {
                        await logout();
                        return Promise.reject(error);
                    }

                    try {
                        const res = await refreshApi.post<RefreshResponseDto>('/auth/refresh', parsed.data);
                        const newAccessToken = res.data.access_token;
                        setToken(newAccessToken);
                        originalReq.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return await api(originalReq);
                    } catch (refreshError: unknown) {
                        const refreshAxiosErr = refreshError as { response?: { status?: number } };
                        if (refreshAxiosErr.response?.status === 401) {
                            localStorage.removeItem('refresh_token');
                            await logout();
                        }
                        return Promise.reject(error);
                    }
                }

                return Promise.reject(error);
            },
        );

        return () => {
            api.interceptors.response.eject(resInt);
        };
    }, [api, token, setToken, logout]);

    const get = (url: string, config: object = {}): Promise<AxiosResponse> =>
        api.get(url, config);

    const post = (url: string, data?: unknown, config: object = {}): Promise<AxiosResponse> =>
        api.post(url, data, config);

    return { api, get, post };
};
