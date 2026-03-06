import type { RegisterRequestDto } from '@contracts/auth/register.ts';

type LoginFormValues = {
    username: string;
    password: string;
}
type RegisterFormValues = RegisterRequestDto & {
    confirmPassword: string;
}

interface User {
    id: string;
    username: string;
    role: 'P' | 'D' | 'A';
}

interface AuthContextFullType {
    user: User | null;
    token: string;
    loading: boolean;
    error: string | null;
    setToken: (token: string) => void;
    login: (username: string, password: string) => Promise<LoginResult>;
    register: (values: RegisterFormValues) => Promise<LoginResult>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    clearError?: () => void;
}

interface LoginResult {
    success: boolean;
    data: User | string;
}

export type {
    LoginFormValues,
    RegisterFormValues,
    User,
    AuthContextFullType,
    LoginResult,
}