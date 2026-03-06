import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RegisterFormValues } from '../types/auth.types.ts';
import { useAuth as useAuthContext } from '../content/AuthContext.tsx';

export function useAuth() {
    const { login: ctxLogin, logout: ctxLogout, register: ctxRegister } = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const login = async (username: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await ctxLogin(username, password);
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

    const register = async (data: RegisterFormValues) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const result = await ctxRegister(data);
            if (result.success) {
                setSuccessMessage('Регистрация прошла успешно! Войдите в систему.');
                navigate('/auth');
            } else {
                setError(typeof result.data === 'string' ? result.data : 'Ошибка регистрации');
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

    const clearError = () => { setError(null); setSuccessMessage(null); };

    return { loading, error, successMessage, login, logout, register, clearError };
}
