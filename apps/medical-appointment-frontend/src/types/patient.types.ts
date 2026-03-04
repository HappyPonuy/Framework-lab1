import type { UsersPatientsInfoResponseDto } from '@contracts/users/patients/info.ts';
import type { UsersPatientsUpdateRequestDto } from '@contracts/users/patients/update.ts';
import type { UsersDoctorDto } from '@contracts/users/doctors/get.ts';
import type { AppointmentDto } from '@contracts/appointments/get.ts';
import type { AppointmentsCreateRequestDto } from '@contracts/appointments/create.ts';

export type Patient = UsersPatientsInfoResponseDto;
export type DoctorInfo = UsersDoctorDto;
export type Appointment = AppointmentDto;
export type CreateAppointmentDto = AppointmentsCreateRequestDto;
export type UpdatePatientDto = UsersPatientsUpdateRequestDto;

export interface DoctorSpecialty {
    id: number;
    specialtyName: string;
}

export interface PatientContextType {
    patient: Patient | null;
    appointments: Appointment[];
    doctors: DoctorInfo[];
    loading: boolean;
    error: string | null;
    bookAppointment: (dto: CreateAppointmentDto) => Promise<void>;
    cancelAppointment: (appointmentId: string) => Promise<void>;
    updateProfile: (dto: UpdatePatientDto) => Promise<void>;
    refresh: () => Promise<void>;
}
