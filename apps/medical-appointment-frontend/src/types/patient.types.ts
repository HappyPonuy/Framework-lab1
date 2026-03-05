import type { UsersPatientsInfoResponseDto } from '@contracts/users/patients/info.ts';
import type { UsersPatientsUpdateRequestDto } from '@contracts/users/patients/update.ts';
import type { UsersDoctorsGetResponseDto } from '@contracts/users/doctors/get.ts';
import type { AppointmentsGetResponseDto } from '@contracts/appointments/get.ts';
import type { AppointmentsCreateRequestDto } from '@contracts/appointments/create.ts';

export type Patient = UsersPatientsInfoResponseDto;
export type DoctorInfo = UsersDoctorsGetResponseDto[number];
export type Appointment = AppointmentsGetResponseDto[number];
export type CreateAppointmentDto = AppointmentsCreateRequestDto;
export type UpdatePatientDto = UsersPatientsUpdateRequestDto;


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
