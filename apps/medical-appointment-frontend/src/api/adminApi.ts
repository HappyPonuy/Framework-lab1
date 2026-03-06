import type { AxiosInstance } from 'axios';
import type { UsersDoctorsGetResponseDto } from '@contracts/users/doctors/get.ts';
import type { AppointmentsGetResponseDto } from '@contracts/appointments/get.ts';
import type { AppointmentsCancelRequestDto, AppointmentsCancelResponseDto } from '@contracts/appointments/cancel.ts';
import type { UsersPatientsGetResponseDto } from '@contracts/users/patients/get.ts';

export function createAdminApi(_axios: AxiosInstance) {
    return {
        async fetchAllDoctors(): Promise<UsersDoctorsGetResponseDto> {
            return (await _axios.get<UsersDoctorsGetResponseDto>('/users/doctors/get')).data;
        },

        async fetchAllAppointments(): Promise<AppointmentsGetResponseDto> {
            return (await _axios.get<AppointmentsGetResponseDto>('/appointments/get')).data;
        },

        async fetchAllPatients(): Promise<UsersPatientsGetResponseDto> {
            return (await _axios.get<UsersPatientsGetResponseDto>('/users/patients/get')).data;
        },

        async deleteAppointment(appointmentId: string): Promise<AppointmentsCancelResponseDto> {
            const dto: AppointmentsCancelRequestDto = { appointment_id: appointmentId };
            return (await _axios.post<AppointmentsCancelResponseDto>('/appointments/cancel', dto)).data;
        },
    };
}
