import { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { http } from '../api/http.ts';
import { authApi } from '../api/authApi.ts';
import type { User, AuthContextFullType, LoginResult, RegisterFormValues } from '../types/auth.types.ts';
import { LoginRequestSchema } from '@contracts/auth/login.ts';
import { LogoutRequestSchema } from '@contracts/auth/logout.ts';
import { RefreshRequestSchema } from '@contracts/auth/refresh.ts';
import { RegisterRequestSchema, RegisterResult } from '@contracts/auth/register.ts';
import type { RefreshResponseDto } from '@contracts/auth/refresh.ts';

const AuthContext = createContext<AuthContextFullType | null>(null);

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setTokenState] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const PUBLIC_PATHS = ['/auth'];

    const setToken = (newToken: string) => {
        setTokenState(newToken);
        if (newToken) {
            http.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            setUser(parseUserFromToken(newToken));
        } else {
            delete http.defaults.headers.common['Authorization'];
            setUser(null);
        }
    };

    const clearError = () => setError(null);

    const setTokenRef = useRef(setToken);
    setTokenRef.current = setToken;
    const logoutRef = useRef<() => Promise<void>>(async () => { /* placeholder */ });

    useEffect(() => {
        const resInt = http.interceptors.response.use(
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
                        await logoutRef.current();
                        return Promise.reject(error);
                    }

                    try {
                        const res = await authApi.refresh(parsed.data);
                        const newAccessToken = (res.data as RefreshResponseDto).access_token;
                        setTokenRef.current(newAccessToken);
                        originalReq.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return await http(originalReq);
                    } catch (refreshError: unknown) {
                        const refreshAxiosErr = refreshError as { response?: { status?: number } };
                        if (refreshAxiosErr.response?.status === 401) {
                            localStorage.removeItem('refresh_token');
                            await logoutRef.current();
                        }
                        return Promise.reject(error);
                    }
                }

                return Promise.reject(error);
            },
        );
        return () => { http.interceptors.response.eject(resInt); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (username: string, password: string): Promise<LoginResult> => {
        setError(null);
        const parsed = LoginRequestSchema.safeParse({ username, password });
        if (!parsed.success) {
            const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ');
            setError(msg);
            return { success: false, data: msg };
        }

        try {
            const res = await authApi.login(parsed.data);
            const { access_token, refresh_token } = res.data;

            setToken(access_token);
            localStorage.setItem('refresh_token', refresh_token);

            return { success: true, data: res.data as unknown as User };
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            const errmsg = axiosErr.response?.data?.error ?? String(err);
            setError(errmsg);
            return { success: false, data: errmsg };
        }
    };

    const register = async (values: RegisterFormValues): Promise<LoginResult> => {
        setError(null);

        if (values.password !== values.confirmPassword) {
            const msg = 'Пароли не совпадают';
            setError(msg);
            return { success: false, data: msg };
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword: _, ...dto } = values;
        const parsed = RegisterRequestSchema.safeParse(dto);
        if (!parsed.success) {
            const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ');
            setError(msg);
            return { success: false, data: msg };
        }

        try {
            const res = await authApi.register(parsed.data);
            if (res.data.result === RegisterResult.Duplicate) {
                const msg = 'Пользователь с таким именем уже существует';
                setError(msg);
                return { success: false, data: msg };
            }
            if (res.data.result !== RegisterResult.Success) {
                const msg = 'Ошибка регистрации';
                setError(msg);
                return { success: false, data: msg };
            }
            return await login(values.username, values.password);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            const errmsg = axiosErr.response?.data?.error ?? String(err);
            setError(errmsg);
            return { success: false, data: errmsg };
        }
    };

    const logout = async (): Promise<void> => {
        const refreshToken = localStorage.getItem('refresh_token') ?? '';
        const parsed = LogoutRequestSchema.safeParse({ token: refreshToken });

        try {
            if (parsed.success) {
                await authApi.logout(parsed.data);
            }
        } catch (err: unknown) {
            console.error(err);
        } finally {
            setToken('');
            localStorage.removeItem('refresh_token');
            navigate('/auth');
        }
    };
    logoutRef.current = logout;

    const refreshToken = async (): Promise<void> => {
        const storedRefresh = localStorage.getItem('refresh_token') ?? '';
        const parsed = RefreshRequestSchema.safeParse({ token: storedRefresh });

        if (!parsed.success) {
            setToken('');
            navigate('/auth');
            return;
        }

        try {
            const res = await authApi.refresh(parsed.data);
            setToken(res.data.access_token);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number } };
            if (axiosErr.response?.status === 401) {
                setToken('');
                localStorage.removeItem('refresh_token');
                navigate('/auth');
            }
        }
    };

    useEffect(() => {
        const storedRefresh = localStorage.getItem('refresh_token');
        if (!storedRefresh) {
            setLoading(false);
            if (!PUBLIC_PATHS.includes(location.pathname)) {
                navigate('/auth');
            }
            return;
        }

        setLoading(true);
        refreshToken()
            .catch(() => {
                setToken('');
                navigate('/auth');
            })
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, loading, error, setToken, login, logout, refreshToken, register, clearError }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextFullType {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}