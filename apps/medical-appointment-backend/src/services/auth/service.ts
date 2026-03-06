import AuthRepository from "./repository.js";
import { AuthHandler } from "@modules/auth_handler";
import { PasswordHandler } from "@modules/password";
import { RegisterResult } from "@contracts/auth/register.js";
import type { UserRole } from "@custom_types/userroles";
import { env } from "@config/env.js";

type PatientProfileData = {
    email: string;
    phone?: string | null | undefined;
    first_name: string;
    last_name: string;
    patronymic?: string | null | undefined;
    birth_date: Date;
    gender: 'M' | 'F';
};

export default class AuthService {
    constructor(private repo: AuthRepository) {}

    async register(name: string, pass: string, role: 'P' | 'D' | 'A', profileData?: PatientProfileData): Promise<{
        result: RegisterResult,
        userId: string | null
    }> {
        const userInfo = await this.repo.getUserByName(name);
        if (userInfo) return { result: RegisterResult.Duplicate, userId: null };

        const passHash = PasswordHandler.hash(pass);
        const userId = await this.repo.addUser(name, passHash, role);
        if (!userId) return { result: RegisterResult.Error, userId: null };

        if (role === 'P' && profileData && env.USERS_SERVICE_URL) {
            try {
                const accessToken = AuthHandler.generateAccessToken({
                    user_id: userId,
                    user_name: name,
                    user_role: 'P' as UserRole,
                });
                await fetch(`${env.USERS_SERVICE_URL}/users/patients/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        email: profileData.email,
                        phone: profileData.phone ?? null,
                        first_name: profileData.first_name,
                        last_name: profileData.last_name,
                        patronymic: profileData.patronymic ?? null,
                        birth_date: profileData.birth_date,
                        gender: profileData.gender,
                    }),
                });
            } catch (err) {
                console.error('Failed to create patient profile in users-service:', err);
            }
        }

        return { result: RegisterResult.Success, userId };
    }

    async login(name: string, pass: string, userAgent?: string, userIp?: string): Promise<{
        refreshToken: string,
        accessToken: string
    } | null> {
        const userAuthData = await this.repo.getUserByName(name);
        if (!userAuthData) return null;
        if (!PasswordHandler.compare(userAuthData.passHash, pass)) return null;

        const refreshTokenData = AuthHandler.generateRefreshToken();
        const refreshTokenHash = AuthHandler.hashToken(refreshTokenData.token);
        const tokenInsertResult = await this.repo.addRefreshToken(
            userAuthData.userId, 
            refreshTokenHash, 
            refreshTokenData.exp,
            userAgent,
            userIp
        );
        if (!tokenInsertResult) return null;

        const accessToken = AuthHandler.generateAccessToken({
            user_id: userAuthData.userId,
            user_name: name,
            user_role: userAuthData.role as UserRole
        });

        return {
            accessToken,
            refreshToken: refreshTokenData.token
        };
    }

    async logout(token: string): Promise<boolean> {
        const tokenHash = AuthHandler.hashToken(token);
        const tokenDeleteResult = await this.repo.deleteRefreshToken(tokenHash);
        return tokenDeleteResult; 
    }

    async refreshToken(token: string): Promise<string | null> {
        const tokenHash = AuthHandler.hashToken(token);
        const tokenData = await this.repo.getRefreshTokenByHash(tokenHash);
        
        if (!tokenData) return null;
        if (tokenData.revoked || new Date(tokenData.exp) < new Date()) {
            await this.repo.deleteRefreshToken(tokenHash);
            return null;
        }

        const userInfo = await this.repo.getUserById(tokenData.userId);
        if (!userInfo) return null;
        
        const newToken = AuthHandler.generateAccessToken({
            user_id: tokenData.userId,
            user_name: userInfo.name,
            user_role: userInfo.role as UserRole
        });
        return newToken;
    }
}