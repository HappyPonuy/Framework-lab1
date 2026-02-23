import { useState, useEffect } from 'react';
import { authApi } from "../api/authApi.ts";
import type { LoginFormValues } from "../types/auth.types.ts";

interface User {
    id: number;
    username: string;
    email: string;
    fio: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        authApi.checkAuth()
            .then(response => {
                if (!cancelled) {
                    setUser(response.data);
                    setError(null);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setUser(null);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, []);

    const login = async (data: LoginFormValues) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.login(data);
            setUser(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: LoginFormValues) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.register(data);
            setUser(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await authApi.logout();
        } finally {
            setUser(null);
            setLoading(false);
        }
    };

    const isAuthenticated = user !== null;

    return { user, loading, error, isAuthenticated, login, logout, register };
}
