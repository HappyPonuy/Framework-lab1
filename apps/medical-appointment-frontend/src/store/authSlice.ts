import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types/auth.types.ts';

interface AuthState {
    user: User | null;
    token: string;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: '',
    loading: true,
    error: null,
};

function parseUserFromToken(token: string): User | null {
    try {
        const payloadB64 = token.split('.')[1];
        if (!payloadB64) return null;
        const json = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
        if (!json.user_id || !json.user_name || !json.user_role) return null;
        return { id: json.user_id, username: json.user_name, role: json.user_role };
    } catch {
        return null;
    }
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
            state.user = action.payload ? parseUserFromToken(action.payload) : null;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
        logout(state) {
            state.token = '';
            state.user = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export const { setToken, setLoading, setError, clearError, logout } = authSlice.actions;
export default authSlice.reducer;
