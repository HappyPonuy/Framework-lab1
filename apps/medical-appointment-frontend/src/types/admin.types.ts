import type { UsersDoctorsGetResponseDto } from '@contracts/users/doctors/get.ts';
import type { AppointmentsGetResponseDto } from '@contracts/appointments/get.ts';
import type { UsersPatientsGetResponseDto } from '@contracts/users/patients/get.ts';

export type AdminDoctor = UsersDoctorsGetResponseDto[number];
export type AdminAppointment = AppointmentsGetResponseDto[number];
export type AdminPatient = UsersPatientsGetResponseDto[number];

export interface AdminContextType {
    doctors: AdminDoctor[];
    appointments: AdminAppointment[];
    patients: AdminPatient[];
    loading: boolean;
    error: string | null;
    deleteAppointment: (appointmentId: string) => Promise<void>;
    refresh: () => Promise<void>;
}
