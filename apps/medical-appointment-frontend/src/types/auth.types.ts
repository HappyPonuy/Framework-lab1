import type { RegisterRequestDto } from '@contracts/auth/register.ts';

// Форма входа
type LoginFormValues = {
    username: string;
    password: string;
}

// Форма регистрации = RegisterRequestDto + confirmPassword для UI
type RegisterFormValues = RegisterRequestDto & {
    confirmPassword: string;
}

interface User {
    id: string;
    username: string;
    role: 'P' | 'D' | 'A';
}

interface AuthContentType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    loading: boolean;
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

interface ApiInstance {
    get: (url: string, config?: object) => Promise<unknown>;
    post: (url: string, data?: unknown, config?: object) => Promise<unknown>;
}

export type {
    LoginFormValues,
    RegisterFormValues,
    User,
    AuthContentType,
    AuthContextFullType,
    LoginResult,
    ApiInstance,
}