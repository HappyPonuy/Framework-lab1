import { z } from "zod";

export const UsersPatientsUpdateRequestSchema = z.object({
    email: z.string().email({ message: 'Некорректный email' }),
    phone: z.string().nullable(),
    firstName: z.string().min(1, { message: 'Имя обязательно' }),
    lastName: z.string().min(1, { message: 'Фамилия обязательна' }),
    patronymic: z.string().nullable(),
    birthDate: z.string().min(1, { message: 'Дата рождения обязательна' }),
    gender: z.enum(['M', 'F']).nullable(),
});

export type UsersPatientsUpdateRequestDto = z.infer<typeof UsersPatientsUpdateRequestSchema>;

export type UsersPatientsUpdateResponseDto = {
    id: string;
    userId: string;
    email: string;
    phone: string | null;
    firstName: string;
    lastName: string;
    patronymic: string | null;
    birthDate: string;
    gender: 'M' | 'F' | null;
    createdAt: string;
    updatedAt: string;
};

