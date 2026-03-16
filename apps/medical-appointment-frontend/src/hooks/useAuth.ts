import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RegisterFormValues } from '../types/auth.types.ts';
import { useAuthStore } from '../stores/StoreContext.tsx';

export function useAuth() {
    const authStore = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const login = async (username: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await authStore.login(username, password);
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
            const result = await authStore.register(data);
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
        await authStore.logout(navigate);
    };

    const clearError = () => { setError(null); setSuccessMessage(null); };

    return { loading, error, successMessage, login, logout, register, clearError };
}
