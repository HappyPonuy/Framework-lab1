import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginFormValues } from '../types/auth.types.ts';
import { useAuth as useAuthContext } from '../content/AuthContext.tsx';
import { LoginRequestSchema } from '@contracts/auth/login.ts';
import { RegisterRequestSchema, RegisterResult } from '@contracts/auth/register.ts';
import { authApi } from '../api/authApi.ts';

export function useAuth() {
    const { login: ctxLogin, logout: ctxLogout } = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (data: LoginFormValues) => {
        const parsed = LoginRequestSchema.safeParse({
            username: data.email,
            password: data.password,
        });
        if (!parsed.success) {
            setError(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const result = await ctxLogin(parsed.data.username, parsed.data.password);
            if (result.success) {
                navigate('/');
            } else {
                setError(typeof result.data === 'string' ? result.data : 'Ошибка входа');
            }
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setError(axiosErr.response?.data?.message ?? 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: LoginFormValues) => {
        if (data.password !== data.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        const parsed = RegisterRequestSchema.safeParse({
            username: data.email,
            password: data.password,
            role: 'P',
        });
        if (!parsed.success) {
            setError(parsed.error.issues.map((e: { message: string }) => e.message).join(', '));
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await authApi.register({
                username: parsed.data.username,
                password: parsed.data.password,
                role: parsed.data.role,
            });

            const registerData = response.data;

            if (registerData.result === RegisterResult.Duplicate) {
                setError('Пользователь с таким именем уже существует');
                return;
            }
            if (registerData.result === RegisterResult.Error || !registerData.userId) {
                setError('Ошибка регистрации на сервере');
                return;
            }

            const result = await ctxLogin(parsed.data.username, parsed.data.password);
            if (result.success) {
                navigate('/');
            } else {
                setError(typeof result.data === 'string' ? result.data : 'Ошибка после регистрации');
            }
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { error?: string; message?: string } } };
            setError(axiosErr.response?.data?.error ?? axiosErr.response?.data?.message ?? 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await ctxLogout();
    };

    const clearError = () => setError(null);

    return { loading, error, login, logout, register, clearError };
}
