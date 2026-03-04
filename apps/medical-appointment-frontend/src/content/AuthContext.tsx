import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { http } from '../api/http.ts';
import { authApi } from '../api/authApi.ts';
import type { User, AuthContextFullType, LoginResult } from '../types/auth.types.ts';
import { LoginRequestSchema } from '@contracts/auth/login.ts';
import { LogoutRequestSchema } from '@contracts/auth/logout.ts';
import { RefreshRequestSchema } from '@contracts/auth/refresh.ts';

const AuthContext = createContext<AuthContextFullType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setTokenState] = useState<string>(localStorage.getItem('token') ?? '');
    const [loading, setLoading] = useState<boolean>(true);
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

    const getUserInfo = async (currentToken: string): Promise<void> => {
        const res = await http.get<{ user: User }>('/auth/userinfo', {
            headers: { Authorization: `Bearer ${currentToken}` },
        });
        setUser(res.data.user);
    };

    const login = async (username: string, password: string): Promise<LoginResult> => {
        const parsed = LoginRequestSchema.safeParse({ username, password });
        if (!parsed.success) {
            const msg = parsed.error.issues.map((e: { message: string }) => e.message).join(', ');
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
        <AuthContext.Provider value={{ user, token, loading, setToken, login, logout, refreshToken }}>
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