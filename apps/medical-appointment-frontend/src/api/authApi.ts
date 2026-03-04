import { http } from "./http.ts";
import type { LoginRequestDto, LoginResponseDto } from '@contracts/auth/login.ts';
import type { LogoutRequestDto, LogoutResponseDto } from '@contracts/auth/logout.ts';
import type { RegisterRequestDto, RegisterResponseDto } from '@contracts/auth/register.ts';
import type { RefreshRequestDto, RefreshResponseDto } from '@contracts/auth/refresh.ts';


export const authApi = {
    login: (data: LoginRequestDto) => http.post<LoginResponseDto>('/auth/login', data),
    logout: (data: LogoutRequestDto) => http.post<LogoutResponseDto>('/auth/logout', data),
    register: (data: RegisterRequestDto) => http.post<RegisterResponseDto>('/auth/register', data),
    refresh: (data: RefreshRequestDto) => http.post<RefreshResponseDto>('/auth/refresh', data),
}