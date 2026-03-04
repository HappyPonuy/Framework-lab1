import { z } from "zod";

export type GetAppointmentsResponseDto = {
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
}[];

export const CreateAppointmentRequestSchema = z.object({
    doctorId: z.string().uuid({ message: 'Некорректный идентификатор врача' }),
    startTime: z.string().min(1, { message: 'Время начала обязательно' }),
    patientNotes: z.string().optional(),
});

export type CreateAppointmentRequestDto = z.infer<typeof CreateAppointmentRequestSchema>;

export type CreateAppointmentResponseDto = {
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

export type CancelAppointmentResponseDto = void;

export const CancelAppointmentRequestSchema = z.object({
    appointmentId: z.string().uuid({ message: 'Некорректный идентификатор записи' }),
});

export type CancelAppointmentRequestDto = z.infer<typeof CancelAppointmentRequestSchema>;

