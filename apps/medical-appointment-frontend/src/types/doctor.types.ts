import type { UsersDoctorsInfoResponseDto } from '@contracts/users/doctors/info.ts';
import type { UsersDoctorsGetScheduleResponseDto } from '@contracts/users/doctors/get_schedule.ts';
import type { AppointmentDto } from '@contracts/appointments/get.ts';
import type { AppointmentsUpdateNotesRequestDto } from '@contracts/appointments/update_notes.ts';

export type DoctorProfile = UsersDoctorsInfoResponseDto;
export type DoctorSchedule = UsersDoctorsGetScheduleResponseDto;
export type DoctorAppointment = AppointmentDto;
export type UpdateDoctorNotesDto = AppointmentsUpdateNotesRequestDto;

export interface DoctorContextType {
    doctor: DoctorProfile | null;
    schedule: DoctorSchedule | null;
    appointments: DoctorAppointment[];
    todayAppointments: DoctorAppointment[];
    loading: boolean;
    error: string | null;
    updateNotes: (dto: UpdateDoctorNotesDto) => Promise<void>;
    refresh: () => Promise<void>;
}
