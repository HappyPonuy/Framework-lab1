import { z } from "zod";

export const AppointmentsUpdateNotesRequestSchema = z.object({
    appointmentId: z.string().uuid({ message: 'Некорректный идентификатор записи' }),
    doctorNotes: z.string().min(1, { message: 'Заметки врача не могут быть пустыми' }),
});

export type AppointmentsUpdateNotesRequestDto = z.infer<typeof AppointmentsUpdateNotesRequestSchema>;

export type AppointmentsUpdateNotesResponseDto = void;

