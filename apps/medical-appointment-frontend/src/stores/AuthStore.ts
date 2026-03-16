import { makeAutoObservable, runInAction } from 'mobx';
import { http, authHttp } from '../api/http.ts';
import { rootStore } from './RootStore.ts';
import { authApi } from '../api/authApi.ts';
import type { User } from '../types/auth.types.ts';
import type { RegisterFormValues } from '../types/auth.types.ts';
import { LoginRequestSchema } from '@contracts/auth/login.ts';
import { LogoutRequestSchema } from '@contracts/auth/logout.ts';
import { RefreshRequestSchema } from '@contracts/auth/refresh.ts';
import { RegisterRequestSchema, RegisterResult } from '@contracts/auth/register.ts';
import type { RefreshResponseDto } from '@contracts/auth/refresh.ts';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

function parseUserFromToken(token: string): User | null {
    try {
        const payloadB64 = token.split('.')[1];
        if (!payloadB64) return null;
        const json = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
        if (!json.user_id || !json.user_name || !json.user_role) return null;
        return { id: json.user_id, username: json.user_name, role: json.user_role };
    } catch {
        return null;
    }
}

export class AuthStore {
    user: User | null = null;
    token: string = '';
    loading: boolean = true;
    error: string | null = null;

    private _interceptorId: number | null = null;
    private _initialized: boolean = false;

    constructor() {
        makeAutoObservable(this);
        this._setupInterceptor();
    }

    private _setupInterceptor() {
        this._interceptorId = http.interceptors.response.use(
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
                        await this.logout();
                        return Promise.reject(error);
                    }

                    try {
                        const res = await authApi.refresh(parsed.data);
                        const newAccessToken = (res.data as RefreshResponseDto).access_token;
                        this.setToken(newAccessToken);
                        originalReq.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return await http(originalReq);
                    } catch (refreshError: unknown) {
                        const refreshAxiosErr = refreshError as { response?: { status?: number } };
                        if (refreshAxiosErr.response?.status === 401) {
                            localStorage.removeItem('refresh_token');
                            await this.logout();
                        }
                        return Promise.reject(error);
                    }
                }

                return Promise.reject(error);
            },
        );
    }

    disposeInterceptor() {
        if (this._interceptorId !== null) {
            http.interceptors.response.eject(this._interceptorId);
            this._interceptorId = null;
        }
    }

    setToken(newToken: string) {
        this.token = newToken;
        if (newToken) {
            http.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            authHttp.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            this.user = parseUserFromToken(newToken);
        } else {
            delete http.defaults.headers.common['Authorization'];
            delete authHttp.defaults.headers.common['Authorization'];
            this.user = null;
        }
    }

    clearError() {
        this.error = null;
    }


    async init(): Promise<void> {
        if (this._initialized) return;
        this._initialized = true;

        const storedRefresh = localStorage.getItem('refresh_token');

        if (!storedRefresh) {
            runInAction(() => { this.loading = false; });
            return;
        }

        runInAction(() => { this.loading = true; });

        const parsed = RefreshRequestSchema.safeParse({ token: storedRefresh });
        if (!parsed.success) {
            runInAction(() => {
                this.setToken('');
                this.loading = false;
            });
            localStorage.removeItem('refresh_token');
            return;
        }

        try {
            const res = await authApi.refresh(parsed.data);
            runInAction(() => { this.setToken(res.data.access_token); });
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number } };
            if (axiosErr.response?.status === 401) {
                localStorage.removeItem('refresh_token');
            }
            runInAction(() => { this.setToken(''); });
        } finally {
            runInAction(() => { this.loading = false; });
        }
    }

    async login(username: string, password: string): Promise<{ success: boolean; data: string | User }> {
        this.error = null;
        const parsed = LoginRequestSchema.safeParse({ username, password });
        if (!parsed.success) {
            const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ');
            runInAction(() => { this.error = msg; });
            return { success: false, data: msg };
        }

        try {
            const res = await authApi.login(parsed.data);
            const { access_token, refresh_token } = res.data;
            runInAction(() => { this.setToken(access_token); });
            localStorage.setItem('refresh_token', refresh_token);
            return { success: true, data: this.user! };
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            const errmsg = axiosErr.response?.data?.error ?? String(err);
            runInAction(() => { this.error = errmsg; });
            return { success: false, data: errmsg };
        }
    }

    async register(values: RegisterFormValues): Promise<{ success: boolean; data: string | User | null }> {
        this.error = null;

        if (values.password !== values.confirmPassword) {
            const msg = 'Пароли не совпадают';
            runInAction(() => { this.error = msg; });
            return { success: false, data: msg };
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword: _, ...dto } = values;
        const parsed = RegisterRequestSchema.safeParse(dto);
        if (!parsed.success) {
            const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ');
            runInAction(() => { this.error = msg; });
            return { success: false, data: msg };
        }

        try {
            const res = await authApi.register(parsed.data);
            if (res.data.result === RegisterResult.Duplicate) {
                const msg = 'Пользователь с таким именем уже существует';
                runInAction(() => { this.error = msg; });
                return { success: false, data: msg };
            }
            if (res.data.result !== RegisterResult.Success) {
                const msg = 'Ошибка регистрации';
                runInAction(() => { this.error = msg; });
                return { success: false, data: msg };
            }
            return { success: true, data: null };
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            const errmsg = axiosErr.response?.data?.error ?? String(err);
            runInAction(() => { this.error = errmsg; });
            return { success: false, data: errmsg };
        }
    }

    async logout(navigate?: (path: string) => void): Promise<void> {
        const refreshToken = localStorage.getItem('refresh_token') ?? '';
        const parsed = LogoutRequestSchema.safeParse({ token: refreshToken });

        try {
            if (parsed.success) {
                await authApi.logout(parsed.data);
            }
        } catch (err: unknown) {
            console.error(err);
        } finally {
            runInAction(() => { this.setToken(''); });
            localStorage.removeItem('refresh_token');
            rootStore.resetAll();
            if (navigate) navigate('/auth');
        }
    }

    async refreshToken(navigate?: (path: string) => void): Promise<void> {
        const storedRefresh = localStorage.getItem('refresh_token') ?? '';
        const parsed = RefreshRequestSchema.safeParse({ token: storedRefresh });

        if (!parsed.success) {
            runInAction(() => { this.setToken(''); });
            if (navigate) navigate('/auth');
            return;
        }

        try {
            const res = await authApi.refresh(parsed.data);
            runInAction(() => { this.setToken(res.data.access_token); });
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number } };
            if (axiosErr.response?.status === 401) {
                runInAction(() => {
                    this.setToken('');
                    localStorage.removeItem('refresh_token');
                });
                if (navigate) navigate('/auth');
            }
        }
    }
}
