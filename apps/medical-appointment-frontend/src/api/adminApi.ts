import type { AxiosInstance } from 'axios';
import type { AdminUser, AdminDoctor, AdminAppointment } from '../types/admin.types.ts';
import type { DoctorSpecialty } from '../types/patient.types.ts';
import type {
    GetAdminUsersResponseDto,
    GetAdminDoctorsResponseDto,
    GetAdminAppointmentsResponseDto,
    GetAdminSpecialtiesResponseDto,
    CreateDoctorRequestDto,
    CreateDoctorResponseDto,
    ToggleDoctorActiveResponseDto,
    DeleteAppointmentResponseDto,
} from '@contracts/admin/index.ts';


const MOCK_USERS: AdminUser[] = [
    { id: 'u-001', username: 'petrov',       roleId: 'P' },
    { id: 'u-002', username: 'sidorova',     roleId: 'P' },
    { id: 'u-003', username: 'ivanov_doc',   roleId: 'D' },
    { id: 'u-004', username: 'kuzn',         roleId: 'P' },
    { id: 'u-005', username: 'smirnova_doc', roleId: 'D' },
    { id: 'u-006', username: 'kozlov_doc',   roleId: 'D' },
    { id: 'u-007', username: 'novikova_doc', roleId: 'D' },
    { id: 'u-008', username: 'admin',        roleId: 'A' },
];

const MOCK_SPECIALTIES: DoctorSpecialty[] = [
    { id: 1, specialtyName: 'Терапевт'    },
    { id: 2, specialtyName: 'Кардиолог'   },
    { id: 3, specialtyName: 'Невролог'    },
    { id: 4, specialtyName: 'Офтальмолог' },
];

const MOCK_ADMIN_DOCTORS: AdminDoctor[] = [
    { id: 'd-001', userId: 'u-003', specialtyId: 1, specialtyName: 'Терапевт',    firstName: 'Александр', lastName: 'Иванов',   patronymic: 'Петрович',   notes: null, isActive: true  },
    { id: 'd-002', userId: 'u-005', specialtyId: 2, specialtyName: 'Кардиолог',   firstName: 'Елена',     lastName: 'Смирнова', patronymic: 'Викторовна', notes: null, isActive: true  },
    { id: 'd-003', userId: 'u-006', specialtyId: 3, specialtyName: 'Невролог',    firstName: 'Дмитрий',   lastName: 'Козлов',   patronymic: 'Сергеевич',  notes: null, isActive: false },
    { id: 'd-004', userId: 'u-007', specialtyId: 4, specialtyName: 'Офтальмолог', firstName: 'Анна',      lastName: 'Новикова', patronymic: 'Игоревна',   notes: null, isActive: true  },
];

const MOCK_ADMIN_APPOINTMENTS: AdminAppointment[] = [
    { id: 'a-001', patientId: 'p-001', patientName: 'Петров А.И.',    doctorId: 'd-001', doctorName: 'Иванов А.П.',   specialtyName: 'Терапевт',    startTime: '09:00', patientNotes: null, doctorNotes: null,                    createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
    { id: 'a-002', patientId: 'p-002', patientName: 'Сидорова М.А.',  doctorId: 'd-002', doctorName: 'Смирнова Е.В.', specialtyName: 'Кардиолог',   startTime: '10:00', patientNotes: null, doctorNotes: null,                    createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
    { id: 'a-003', patientId: 'p-003', patientName: 'Кузнецов И.О.', doctorId: 'd-001', doctorName: 'Иванов А.П.',   specialtyName: 'Терапевт',    startTime: '11:30', patientNotes: null, doctorNotes: 'Рекомендован рентген', createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-03T00:00:00Z' },
    { id: 'a-004', patientId: 'p-004', patientName: 'Фёдорова О.Н.', doctorId: 'd-004', doctorName: 'Новикова А.И.', specialtyName: 'Офтальмолог', startTime: '09:30', patientNotes: null, doctorNotes: null,                    createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
];


export function createAdminApi(_axios: AxiosInstance) {
    return {
        async fetchAllUsers(): Promise<GetAdminUsersResponseDto> {
            // return (await _axios.get<GetAdminUsersResponseDto>('/admin/users')).data;
            return Promise.resolve(MOCK_USERS);
        },

        async fetchAllDoctors(): Promise<GetAdminDoctorsResponseDto> {
            // return (await _axios.get<GetAdminDoctorsResponseDto>('/admin/doctors')).data;
            return Promise.resolve(MOCK_ADMIN_DOCTORS);
        },

        async fetchAllAppointments(): Promise<GetAdminAppointmentsResponseDto> {
            // return (await _axios.get<GetAdminAppointmentsResponseDto>('/admin/appointments')).data;
            return Promise.resolve(MOCK_ADMIN_APPOINTMENTS);
        },

        async fetchAllSpecialties(): Promise<GetAdminSpecialtiesResponseDto> {
            // return (await _axios.get<GetAdminSpecialtiesResponseDto>('/admin/specialties')).data;
            return Promise.resolve(MOCK_SPECIALTIES);
        },

        async toggleDoctorActive(doctorId: string, dto: import('@contracts/admin/index.ts').ToggleDoctorActiveRequestDto): Promise<ToggleDoctorActiveResponseDto> {
            // await _axios.patch<ToggleDoctorActiveResponseDto>(`/admin/doctors/${doctorId}`, dto);
            const idx = MOCK_ADMIN_DOCTORS.findIndex(d => d.id === doctorId);
            if (idx !== -1) MOCK_ADMIN_DOCTORS[idx].isActive = dto.isActive;
        },

        async deleteAppointment(appointmentId: string): Promise<DeleteAppointmentResponseDto> {
            // await _axios.delete<DeleteAppointmentResponseDto>(`/admin/appointments/${appointmentId}`);
            const idx = MOCK_ADMIN_APPOINTMENTS.findIndex(a => a.id === appointmentId);
            if (idx !== -1) MOCK_ADMIN_APPOINTMENTS.splice(idx, 1);
        },

        async createDoctor(dto: CreateDoctorRequestDto): Promise<CreateDoctorResponseDto> {
            // return (await _axios.post<CreateDoctorResponseDto>('/admin/doctors', dto)).data;
            const specialty = MOCK_SPECIALTIES.find(s => s.id === dto.specialtyId);
            const newDoctor: AdminDoctor = {
                id: `d-${Date.now()}`,
                userId: dto.userId,
                specialtyId: dto.specialtyId,
                specialtyName: specialty?.specialtyName ?? '',
                firstName: dto.firstName,
                lastName: dto.lastName,
                patronymic: dto.patronymic ?? null,
                notes: dto.notes ?? null,
                isActive: false,
            };
            MOCK_ADMIN_DOCTORS.push(newDoctor);
            return Promise.resolve(newDoctor);
        },
    };
}