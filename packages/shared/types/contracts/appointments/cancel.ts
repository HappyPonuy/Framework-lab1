import { z } from "zod";

export const AppointmentsCancelRequestSchema = z.object({
    appointmentId: z.string().uuid({ message: 'Некорректный идентификатор записи' }),
});

export type AppointmentsCancelRequestDto = z.infer<typeof AppointmentsCancelRequestSchema>;

export type AppointmentsCancelResponseDto = void;

