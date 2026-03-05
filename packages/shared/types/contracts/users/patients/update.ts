import { z } from "zod";

export const UsersPatientsUpdateRequestSchema = z.object({
    id: z.string(),
    email: z.email({ message: 'Некорректный email' }),
    phone: z.string().nullable(),
    first_name: z.string().min(1, { message: 'Имя обязательно' }),
    last_name: z.string().min(1, { message: 'Фамилия обязательна' }),
    patronymic: z.string().nullable(),
    birth_date: z.date({ message: 'Некорректная дата рождения' }),
    gender: z.enum(['M', 'F']),
});

export type UsersPatientsUpdateRequestDto = z.infer<typeof UsersPatientsUpdateRequestSchema>;

export type UsersPatientsUpdateResponseDto = {
    id: string;
    user_id: string;
    email: string;
    phone: string | null;
    first_name: string;
    last_name: string;
    patronymic: string | null;
    birth_date: Date;
    gender: 'M' | 'F';
    created_at: Date;
    updated_at: Date;
};