
type LoginFormValues = {
    email: string;
    password: string;
    fio?: string;
    confirmPassword?: string;
}

interface User {
    id: number;
    email: string;
    fio: string;
    role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

interface AuthContentType {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
    loading: boolean;
}

export type {
    LoginFormValues,
    User,
    AuthContentType
}