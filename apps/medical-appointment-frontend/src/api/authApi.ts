import { http } from "./http.ts";
import type { LoginFormValues } from "../types/auth.types.ts";


export const authApi = {
    login: (data: LoginFormValues) => http.post('/auth/login', data),
    logout: () => http.post('/auth/logout'),
    checkAuth: () => http.get('/auth/check'),
    register: (data: LoginFormValues) => http.post('/auth/register', data),
}