import { z } from "zod";

export const RegisterRequestSchema = z.object({
    username: z.string().min(4, { message: 'Имя пользователя должно содержать не менее 4 символов' }),
    password: z.string().min(8, { message: 'Пароль должен содержать не менее 8 символов' }),
    role: z.enum(['P', 'D', 'A'], { message: 'Недопустимая роль' }).default('P'),
});

export type RegisterRequestDto = z.infer<typeof RegisterRequestSchema>;

export enum RegisterResult {
    Success = 0,
    Duplicate = 1,
    Error = 2,
}

export type RegisterResponseDto = {
    result: RegisterResult;
    userId: string | null;
};