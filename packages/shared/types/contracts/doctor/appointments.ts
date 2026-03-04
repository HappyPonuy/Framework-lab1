import { z } from "zod";

export type GetDoctorAppointmentsResponseDto = {
    id: string;
    patientId: string;
    patientFirstName: string;
    patientLastName: string;
    patientPatronymic: string | null;
    patientBirthDate: string;
    startTime: string;
    patientNotes: string | null;
    doctorNotes: string | null;
}[];

export const UpdateAppointmentNotesRequestSchema = z.object({
    appointmentId: z.string().uuid({ message: 'Некорректный идентификатор записи' }),
    doctorNotes: z.string().min(1, { message: 'Заметки врача не могут быть пустыми' }),
});

export type UpdateAppointmentNotesRequestDto = z.infer<typeof UpdateAppointmentNotesRequestSchema>;

export type UpdateAppointmentNotesResponseDto = void;

