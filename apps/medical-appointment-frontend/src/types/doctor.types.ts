import type { UsersDoctorsInfoResponseDto } from '@contracts/users/doctors/info.ts';
import type { AppointmentsGetResponseDto } from '@contracts/appointments/get.ts';
import type { AppointmentsCompleteRequestDto } from '@contracts/appointments/complete.ts';
import type { PatientInfo } from '@shared/types/data/patientinfo.ts';

export type DoctorProfile = UsersDoctorsInfoResponseDto;
export type DoctorSchedule = Pick<DoctorProfile, 'work_days' | 'shift_start' | 'shift_end' | 'slot_minutes'>;
export type DoctorAppointment = AppointmentsGetResponseDto[number];
export type UpdateDoctorNotesDto = AppointmentsCompleteRequestDto;

export interface DoctorContextType {
    doctor: DoctorProfile | null;
    schedule: DoctorSchedule | null;
    appointments: DoctorAppointment[];
    patients: PatientInfo[];
    todayAppointments: DoctorAppointment[];
    loading: boolean;
    error: string | null;
    updateNotes: (dto: UpdateDoctorNotesDto) => Promise<void>;
    refresh: () => Promise<void>;
}
