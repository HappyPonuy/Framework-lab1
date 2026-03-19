import { createContext, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { http } from '../api/http.ts';
import { authApi } from '../api/authApi.ts';
import type { AuthContextFullType, LoginResult, RegisterFormValues } from '../types/auth.types.ts';
import { LoginRequestSchema } from '@contracts/auth/login.ts';
import { LogoutRequestSchema } from '@contracts/auth/logout.ts';
import { RefreshRequestSchema } from '@contracts/auth/refresh.ts';
import { RegisterRequestSchema, RegisterResult } from '@contracts/auth/register.ts';
import type { RefreshResponseDto } from '@contracts/auth/refresh.ts';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import {
    setToken as setTokenAction,
    setLoading,
    setError,
    clearError as clearErrorAction,
    logout as logoutAction,
} from '../store/authSlice.ts';
import { medApi } from '../store/api.ts';

const AuthContext = createContext<AuthContextFullType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const { user, token, loading, error } = useAppSelector((s) => s.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const PUBLIC_PATHS = ['/auth'];

    const handleSetToken = (newToken: string) => {
        dispatch(setTokenAction(newToken));
        if (newToken) {
            http.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        } else {
            delete http.defaults.headers.common['Authorization'];
        }
    };

    const handleClearError = () => dispatch(clearErrorAction());

    const logoutRef = useRef<() => Promise<void>>(async () => {});

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
                        handleSetToken(newAccessToken);
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
    }, []);

    const login = async (username: string, password: string): Promise<LoginResult> => {
        dispatch(setError(null));
        const parsed = LoginRequestSchema.safeParse({ username, password });
        if (!parsed.success) {
            const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ');
            dispatch(setError(msg));
            return { success: false, data: msg };
        }
        try {
            const res = await authApi.login(parsed.data);
            const { access_token, refresh_token } = res.data;
            handleSetToken(access_token);
            localStorage.setItem('refresh_token', refresh_token);
            return { success: true, data: res.data as never };
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            const errmsg = axiosErr.response?.data?.error ?? String(err);
            dispatch(setError(errmsg));
            return { success: false, data: errmsg };
        }
    };

    const register = async (values: RegisterFormValues): Promise<LoginResult> => {
        dispatch(setError(null));
        if (values.password !== values.confirmPassword) {
            const msg = 'Пароли не совпадают';
            dispatch(setError(msg));
            return { success: false, data: msg };
        }
        
        const { confirmPassword: _, ...dto } = values;
        const parsed = RegisterRequestSchema.safeParse(dto);
        if (!parsed.success) {
            const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ');
            dispatch(setError(msg));
            return { success: false, data: msg };
        }
        try {
            const res = await authApi.register(parsed.data);
            if (res.data.result === RegisterResult.Duplicate) {
                const msg = 'Пользователь с таким именем уже существует';
                dispatch(setError(msg));
                return { success: false, data: msg };
            }
            if (res.data.result !== RegisterResult.Success) {
                const msg = 'Ошибка регистрации';
                dispatch(setError(msg));
                return { success: false, data: msg };
            }
            return { success: true, data: null as never };
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string } } };
            const errmsg = axiosErr.response?.data?.error ?? String(err);
            dispatch(setError(errmsg));
            return { success: false, data: errmsg };
        }
    };

    const logout = async (): Promise<void> => {
        const refreshToken = localStorage.getItem('refresh_token') ?? '';
        const parsed = LogoutRequestSchema.safeParse({ token: refreshToken });
        try {
            if (parsed.success) await authApi.logout(parsed.data);
        } catch (err: unknown) {
            console.error(err);
        } finally {
            handleSetToken('');
            localStorage.removeItem('refresh_token');
            dispatch(logoutAction());
            dispatch(medApi.util.resetApiState());
            navigate('/auth');
        }
    };
    logoutRef.current = logout;

    const refreshToken = async (): Promise<void> => {
        const storedRefresh = localStorage.getItem('refresh_token') ?? '';
        const parsed = RefreshRequestSchema.safeParse({ token: storedRefresh });
        if (!parsed.success) {
            handleSetToken('');
            navigate('/auth');
            return;
        }
        try {
            const res = await authApi.refresh(parsed.data);
            handleSetToken(res.data.access_token);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number } };
            if (axiosErr.response?.status === 401) {
                handleSetToken('');
                localStorage.removeItem('refresh_token');
                navigate('/auth');
            }
        }
    };

    useEffect(() => {
        const storedRefresh = localStorage.getItem('refresh_token');
        if (!storedRefresh) {
            dispatch(setLoading(false));
            if (!PUBLIC_PATHS.includes(location.pathname)) navigate('/auth');
            return;
        }
        dispatch(setLoading(true));
        refreshToken()
            .catch(() => { handleSetToken(''); navigate('/auth'); })
            .finally(() => dispatch(setLoading(false)));
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            error,
            setToken: handleSetToken,
            login,
            logout,
            refreshToken,
            register,
            clearError: handleClearError,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextFullType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
