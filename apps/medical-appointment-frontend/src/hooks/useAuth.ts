import { useState} from 'react';
import { useNavigate } from 'react-router-dom'
import { authApi } from "../api/authApi.ts";
import type {LoginFormValues} from "../types/auth.types.ts";
import {useAuthContext} from "../content/AuthContext.tsx";

export function useAuth() {
    const { setUser } = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (data: LoginFormValues) => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.login(data);
            setUser(response.data);
            navigate('/');
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
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await authApi.logout()
        setUser(null)
        navigate('/auth')
    }

    return { loading, error, login, logout, register };
}
