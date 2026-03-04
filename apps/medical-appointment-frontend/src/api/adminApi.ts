import type { AxiosInstance } from 'axios';
import type { AdminUser, AdminDoctor, AdminAppointment, CreateDoctorDto } from '../types/admin.types.ts';
import type { DoctorSpecialty } from '../types/patient.types.ts';


const MOCK_USERS: AdminUser[] = [
    { id: 'u-001', username: 'petrov',       role_id: 'P', first_name: 'Алексей',      last_name: 'Петров',   patronymic: 'Иванович'   },
    { id: 'u-002', username: 'sidorova',     role_id: 'P', first_name: 'Мария',        last_name: 'Сидорова', patronymic: 'Андреевна'  },
    { id: 'u-003', username: 'ivanov_doc',   role_id: 'D', first_name: 'Александр',    last_name: 'Иванов',   patronymic: 'Петрович'   },
    { id: 'u-004', username: 'kuzn',         role_id: 'P', first_name: 'Игорь',        last_name: 'Кузнецов', patronymic: 'Олегович'   },
    { id: 'u-005', username: 'smirnova_doc', role_id: 'D', first_name: 'Елена',        last_name: 'Смирнова', patronymic: 'Викторовна' },
    { id: 'u-006', username: 'kozlov_doc',   role_id: 'D', first_name: 'Дмитрий',      last_name: 'Козлов',   patronymic: 'Сергеевич'  },
    { id: 'u-007', username: 'novikova_doc', role_id: 'D', first_name: 'Анна',         last_name: 'Новикова', patronymic: 'Игоревна'   },
    { id: 'u-008', username: 'admin',        role_id: 'A', first_name: 'Администратор', last_name: 'Системы', patronymic: null         },
];

const MOCK_SPECIALTIES: DoctorSpecialty[] = [
    { id: 1, specialtyName: 'Терапевт'    },
    { id: 2, specialtyName: 'Кардиолог'   },
    { id: 3, specialtyName: 'Невролог'    },
    { id: 4, specialtyName: 'Офтальмолог' },
];

const MOCK_ADMIN_DOCTORS: AdminDoctor[] = [
    { id: 'd-001', user_id: 'u-003', specialty: 'Терапевт',    first_name: 'Александр', last_name: 'Иванов',   patronymic: 'Петрович',   notes: null, is_active: true,  work_days: 31, shift_start: '09:00', shift_end: '18:00', slot_minutes: 30 },
    { id: 'd-002', user_id: 'u-005', specialty: 'Кардиолог',   first_name: 'Елена',     last_name: 'Смирнова', patronymic: 'Викторовна', notes: null, is_active: true,  work_days: 31, shift_start: '09:00', shift_end: '17:00', slot_minutes: 30 },
    { id: 'd-003', user_id: 'u-006', specialty: 'Невролог',    first_name: 'Дмитрий',   last_name: 'Козлов',   patronymic: 'Сергеевич',  notes: null, is_active: false, work_days: 20, shift_start: '10:00', shift_end: '16:00', slot_minutes: 30 },
    { id: 'd-004', user_id: 'u-007', specialty: 'Офтальмолог', first_name: 'Анна',      last_name: 'Новикова', patronymic: 'Игоревна',   notes: null, is_active: true,  work_days: 31, shift_start: '08:00', shift_end: '15:00', slot_minutes: 20 },
];

const MOCK_ADMIN_APPOINTMENTS: AdminAppointment[] = [
    { id: 'a-001', patient_id: 'p-001', patient_name: 'Петров Алексей Иванович',   doctor_id: 'd-001', doctor_name: 'Иванов А.П.',   specialty_name: 'Терапевт',    start_time: '09:00', patient_notes: null, doctor_notes: null,                    created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
    { id: 'a-002', patient_id: 'p-002', patient_name: 'Сидорова Мария Андреевна', doctor_id: 'd-002', doctor_name: 'Смирнова Е.В.', specialty_name: 'Кардиолог',   start_time: '10:00', patient_notes: null, doctor_notes: null,                    created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
    { id: 'a-003', patient_id: 'p-003', patient_name: 'Кузнецов Игорь Олегович',  doctor_id: 'd-001', doctor_name: 'Иванов А.П.',   specialty_name: 'Терапевт',    start_time: '11:30', patient_notes: null, doctor_notes: 'Рекомендован рентген', created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-03T00:00:00Z' },
    { id: 'a-004', patient_id: 'p-004', patient_name: 'Фёдорова Ольга Николаевна',doctor_id: 'd-004', doctor_name: 'Новикова А.И.', specialty_name: 'Офтальмолог', start_time: '09:30', patient_notes: null, doctor_notes: null,                    created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
];


export function createAdminApi(_axios: AxiosInstance) {
    return {
        async fetchAllUsers(): Promise<AdminUser[]> {
            // return (await _axios.get<AdminUser[]>('/users')).data;
            return Promise.resolve(MOCK_USERS);
        },

        async fetchAllDoctors(): Promise<AdminDoctor[]> {
            // return (await _axios.get<UsersDoctorsGetResponseDto>('/users/doctors')).data;
            return Promise.resolve(MOCK_ADMIN_DOCTORS);
        },

        async fetchAllAppointments(): Promise<AdminAppointment[]> {
            // return (await _axios.get<AppointmentsGetResponseDto>('/appointments')).data;
            return Promise.resolve(MOCK_ADMIN_APPOINTMENTS);
        },

        async fetchAllSpecialties(): Promise<DoctorSpecialty[]> {
            // return (await _axios.get<DoctorSpecialty[]>('/specialties')).data;
            return Promise.resolve(MOCK_SPECIALTIES);
        },


        async deleteAppointment(appointmentId: string): Promise<void> {
            // await _axios.delete(`/appointments/${appointmentId}`);
            const idx = MOCK_ADMIN_APPOINTMENTS.findIndex(a => a.id === appointmentId);
            if (idx !== -1) MOCK_ADMIN_APPOINTMENTS.splice(idx, 1);
        },

        async createDoctor(dto: CreateDoctorDto): Promise<AdminDoctor> {
            // return (await _axios.post<AdminDoctor>('/users/doctors', dto)).data;
            const newDoctor: AdminDoctor = {
                id: `d-${Date.now()}`,
                user_id: dto.user_id,
                specialty: dto.specialty,
                first_name: dto.first_name,
                last_name: dto.last_name,
                patronymic: dto.patronymic ?? null,
                notes: dto.notes ?? null,
                is_active: false,
                work_days: dto.work_days,
                shift_start: dto.shift_start,
                shift_end: dto.shift_end,
                slot_minutes: dto.slot_minutes,
            };
            MOCK_ADMIN_DOCTORS.push(newDoctor);
            return Promise.resolve(newDoctor);
        },
    };
}