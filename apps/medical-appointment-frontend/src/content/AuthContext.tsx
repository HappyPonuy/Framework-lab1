import { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from "../api/authApi.ts";
import type {AuthContentType, User} from "../types/auth.types.ts";

const AuthContext = createContext<AuthContentType | null>(null);

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const mockUser: User = {id: 0, email: 'a1@mail.ru', fio: 'Test User', role: 'PATIENT'};
        setUser(mockUser);
        setLoading(false);

        // Закомментировано для разработки. Раскомментировать для реальной проверки авторизации:
        // authApi.checkAuth()
        //     .then(res => setUser(res.data))
        //     .catch(() => setUser(null))
        //     .finally(() => setLoading(false));
    }, []);

    return(
        <AuthContext.Provider value={{
            user,
            setUser,
            isAuthenticated: user !== null,
            loading,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext(){
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return ctx;
}