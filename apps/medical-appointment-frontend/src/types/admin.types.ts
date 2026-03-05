import type { UsersDoctorsGetResponseDto } from '@contracts/users/doctors/get.ts';
import type { AppointmentsGetResponseDto } from '@contracts/appointments/get.ts';
import type { PatientInfo } from '@shared/types/data/patientinfo.d.ts';

export interface AdminUser {
    id: string;
    username: string;
    role_id: 'P' | 'D' | 'A';
    first_name: string;
    last_name: string;
    patronymic: string | null;
}

export type AdminDoctor = UsersDoctorsGetResponseDto[number];
export type AdminAppointment = AppointmentsGetResponseDto[number];

export interface CreateDoctorDto {
    user_id: string;
    specialty: string;
    first_name: string;
    last_name: string;
    patronymic?: string;
    notes?: string;
    work_days: number;
    shift_start: string;
    shift_end: string;
    slot_minutes: number;
}

export interface AdminContextType {
    users: AdminUser[];
    doctors: AdminDoctor[];
    appointments: AdminAppointment[];
    patients: PatientInfo[];
    loading: boolean;
    error: string | null;
    deleteAppointment: (appointmentId: string) => Promise<void>;
    createDoctor: (dto: CreateDoctorDto) => Promise<void>;
    refresh: () => Promise<void>;
}
