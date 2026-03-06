import type { AxiosInstance } from 'axios';
import type { UsersDoctorsInfoResponseDto } from '@contracts/users/doctors/info.ts';
import type { AppointmentsGetResponseDto } from '@contracts/appointments/get.ts';
import type { AppointmentsCompleteRequestDto, AppointmentsCompleteResponseDto } from '@contracts/appointments/complete.ts';
import type { UsersPatientsGetResponseDto } from '@contracts/users/patients/get.ts';

export function createDoctorApi(_axios: AxiosInstance) {
    return {
        async fetchProfile(doctorId: string): Promise<UsersDoctorsInfoResponseDto> {
            return (await _axios.get<UsersDoctorsInfoResponseDto>(`/users/doctors/info`, { params: { id: doctorId } })).data;
        },

        async fetchAppointments(): Promise<AppointmentsGetResponseDto> {
            return (await _axios.get<AppointmentsGetResponseDto>('/appointments/get')).data;
        },

        async fetchPatients(): Promise<UsersPatientsGetResponseDto> {
            return (await _axios.get<UsersPatientsGetResponseDto>('/users/patients/get')).data;
        },

        async updateAppointmentNotes(dto: AppointmentsCompleteRequestDto): Promise<AppointmentsCompleteResponseDto> {
            return (await _axios.post<AppointmentsCompleteResponseDto>('/appointments/complete', dto)).data;
        },
    };
}
