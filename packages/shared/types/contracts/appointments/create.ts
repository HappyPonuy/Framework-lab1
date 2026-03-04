import { z } from "zod";

export const AppointmentsCreateRequestSchema = z.object({
    doctor_id: z.string().uuid({ message: 'Некорректный идентификатор врача' }),
    start_time: z.string().min(1, { message: 'Время начала обязательно' }),
    patient_notes: z.string().optional(),
});

export type AppointmentsCreateRequestDto = z.infer<typeof AppointmentsCreateRequestSchema>;

export type AppointmentsCreateResponseDto = {
    id: string;
    patient_id: string;
    patient_name: string;
    doctor_id: string;
    doctor_name: string;
    specialty_name: string;
    start_time: string;
    patient_notes: string | null;
    doctor_notes: string | null;
    created_at: string;
    updated_at: string;
};
