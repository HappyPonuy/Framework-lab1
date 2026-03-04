import { z } from "zod";

export const AppointmentsCreateRequestSchema = z.object({
    doctorId: z.string().uuid({ message: 'Некорректный идентификатор врача' }),
    startTime: z.string().min(1, { message: 'Время начала обязательно' }),
    patientNotes: z.string().optional(),
});

export type AppointmentsCreateRequestDto = z.infer<typeof AppointmentsCreateRequestSchema>;

export type AppointmentsCreateResponseDto = {
    id: string;
    patientId: string;
    doctorId: string;
    doctorName: string;
    specialtyName: string;
    startTime: string;
    patientNotes: string | null;
    doctorNotes: string | null;
    createdAt: string;
    updatedAt: string;
};

