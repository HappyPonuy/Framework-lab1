import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { http } from '../api/http.ts';
import { authApi } from '../api/authApi.ts';
import type { User, AuthContextFullType, LoginResult, RegisterFormValues } from '../types/auth.types.ts';
import { LoginRequestSchema } from '@contracts/auth/login.ts';
import { LogoutRequestSchema } from '@contracts/auth/logout.ts';
import { RefreshRequestSchema } from '@contracts/auth/refresh.ts';
import { RegisterRequestSchema, RegisterResult } from '@contracts/auth/register.ts';

const AuthContext = createContext<AuthContextFullType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setTokenState] = useState<string>(localStorage.getItem('token') ?? '');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const PUBLIC_PATHS = ['/', '/patient', '/doctor', '/admin'];

    const setToken = (newToken: string) => {
        setTokenState(newToken);
        if (newToken) {
            localStorage.setItem('token', newToken);
        } else {
            localStorage.removeItem('token');
        }
    };

    const clearError = () => setError(null);

    const getUserInfo = async (currentToken: string): Promise<void> => {
        const res = await http.get<{ user: User }>('/auth/userinfo', {
            headers: { Authorization: `Bearer ${currentToken}` },
        });
        setUser(res.data.user);
    };

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

            await getUserInfo(access_token);
            return { success: true, data: user! };
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
            // После успешной регистрации — сразу войти
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
            setUser(null);
            navigate('/auth');
        }
    };

    const refreshToken = async (): Promise<void> => {
        const storedRefresh = localStorage.getItem('refresh_token') ?? '';

        const parsed = RefreshRequestSchema.safeParse({ token: storedRefresh });
        if (!parsed.success) {
            setToken('');
            setUser(null);
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
                setUser(null);
                navigate('/auth');
            }
        }
    };

    useEffect(() => {
        if (!token) {
            setLoading(false);
            if (!PUBLIC_PATHS.includes(location.pathname)) {
                navigate('/auth');
            }
            return;
        }

        setLoading(true);
        getUserInfo(token)
            .then(() => setLoading(false))
            .catch(async (err: unknown) => {
                const axiosErr = err as { response?: { status?: number } };
                if (axiosErr.response?.status === 401) {
                    try {
                        await refreshToken();
                        setLoading(false);
                    } catch {
                        setToken('');
                        setUser(null);
                        setLoading(false);
                        navigate('/auth');
                    }
                } else {
                    setLoading(false);
                }
            });
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