import { z } from "zod";

export const LoginRequestSchema = z.object({
    username: z.string().min(4),
    password: z.string().min(8),
});

export type LoginRequestDto = z.infer<typeof LoginRequestSchema>;

export type LoginResponseDto = {
    refresh_token: string;
    access_token: string;
};