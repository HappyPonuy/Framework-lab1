import type { AxiosInstance } from 'axios';
import type { UsersPatientsInfoResponseDto } from '@contracts/users/patients/info.ts';
import type { UsersDoctorsGetResponseDto } from '@contracts/users/doctors/get.ts';
import type { UsersPatientsUpdateRequestDto, UsersPatientsUpdateResponseDto } from '@contracts/users/patients/update.ts';
import type { AppointmentsGetResponseDto } from '@contracts/appointments/get.ts';
import type { AppointmentsCreateRequestDto, AppointmentsCreateResponseDto } from '@contracts/appointments/create.ts';
import type { AppointmentsCancelRequestDto, AppointmentsCancelResponseDto } from '@contracts/appointments/cancel.ts';

function generateTimeSlots(shiftStart: string, shiftEnd: string, slotMinutes: number): string[] {
    const slots: string[] = [];
    const [startH, startM] = shiftStart.split(':').map(Number);
    const [endH, endM] = shiftEnd.split(':').map(Number);
    let cur = startH * 60 + startM;
    const end = endH * 60 + endM;
    while (cur + slotMinutes <= end) {
        slots.push(`${Math.floor(cur / 60).toString().padStart(2, '0')}:${(cur % 60).toString().padStart(2, '0')}`);
        cur += slotMinutes;
    }
    return slots;
}

export { generateTimeSlots };

export function createPatientApi(_axios: AxiosInstance) {
    return {
        async fetchProfile(userId: string): Promise<UsersPatientsInfoResponseDto> {
            return (await _axios.get<UsersPatientsInfoResponseDto>('/users/patients/info', { params: { id: userId } })).data;
        },

        async fetchDoctors(): Promise<UsersDoctorsGetResponseDto> {
            return (await _axios.get<UsersDoctorsGetResponseDto>('/users/doctors/get')).data;
        },

        async fetchAppointments(): Promise<AppointmentsGetResponseDto> {
            return (await _axios.get<AppointmentsGetResponseDto>('/appointments/get')).data;
        },

        async createAppointment(dto: AppointmentsCreateRequestDto): Promise<AppointmentsCreateResponseDto> {
            return (await _axios.post<AppointmentsCreateResponseDto>('/appointments/create', dto)).data;
        },

        async cancelAppointment(dto: AppointmentsCancelRequestDto): Promise<AppointmentsCancelResponseDto> {
            return (await _axios.post<AppointmentsCancelResponseDto>('/appointments/cancel', dto)).data;
        },

        async updateProfile(dto: UsersPatientsUpdateRequestDto): Promise<UsersPatientsUpdateResponseDto> {
            return (await _axios.post<UsersPatientsUpdateResponseDto>('/users/patients/update', dto)).data;
        },
    };
}



