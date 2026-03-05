import type { AxiosInstance } from 'axios';
import type { AdminUser, CreateDoctorDto } from '../types/admin.types.ts';
import type { DoctorSpecialty } from '@shared/types/data/doctorinfo.ts';
import type { UsersDoctorsGetResponseDto } from '@contracts/users/doctors/get.ts';
import type { AppointmentsGetResponseDto } from '@contracts/appointments/get.ts';
import type { AppointmentsCancelResponseDto } from '@contracts/appointments/cancel.ts';
import type { PatientInfo } from '@shared/types/data/patientinfo.js';


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

const MOCK_ADMIN_DOCTORS: UsersDoctorsGetResponseDto = [
    { id: 'd-001', user_id: 'u-003', specialty: 'Терапевт',    first_name: 'Александр', last_name: 'Иванов',   patronymic: 'Петрович',   notes: null, is_active: true,  work_days: 31, shift_start: '09:00', shift_end: '18:00', slot_minutes: 30 },
    { id: 'd-002', user_id: 'u-005', specialty: 'Кардиолог',   first_name: 'Елена',     last_name: 'Смирнова', patronymic: 'Викторовна', notes: null, is_active: true,  work_days: 31, shift_start: '09:00', shift_end: '17:00', slot_minutes: 30 },
    { id: 'd-003', user_id: 'u-006', specialty: 'Невролог',    first_name: 'Дмитрий',   last_name: 'Козлов',   patronymic: 'Сергеевич',  notes: null, is_active: false, work_days: 20, shift_start: '10:00', shift_end: '16:00', slot_minutes: 30 },
    { id: 'd-004', user_id: 'u-007', specialty: 'Офтальмолог', first_name: 'Анна',      last_name: 'Новикова', patronymic: 'Игоревна',   notes: null, is_active: true,  work_days: 31, shift_start: '08:00', shift_end: '15:00', slot_minutes: 20 },
];

const MOCK_ADMIN_APPOINTMENTS: AppointmentsGetResponseDto = [
    { id: 'a-001', patient_id: 'p-001', doctor_id: 'd-001', progress: 'Назначен', start_time: new Date('2026-03-05T09:00:00Z'), patient_notes: null, doctor_notes: null,                    created_at: new Date('2026-03-01T00:00:00Z'), updated_at: new Date('2026-03-01T00:00:00Z') },
    { id: 'a-002', patient_id: 'p-002', doctor_id: 'd-002', progress: 'Назначен', start_time: new Date('2026-03-05T10:00:00Z'), patient_notes: null, doctor_notes: null,                    created_at: new Date('2026-03-01T00:00:00Z'), updated_at: new Date('2026-03-01T00:00:00Z') },
    { id: 'a-003', patient_id: 'p-003', doctor_id: 'd-001', progress: 'Завершен', start_time: new Date('2026-03-05T11:30:00Z'), patient_notes: null, doctor_notes: 'Рекомендован рентген', created_at: new Date('2026-03-01T00:00:00Z'), updated_at: new Date('2026-03-03T00:00:00Z') },
    { id: 'a-004', patient_id: 'p-004', doctor_id: 'd-004', progress: 'Назначен', start_time: new Date('2026-03-05T09:30:00Z'), patient_notes: null, doctor_notes: null,                    created_at: new Date('2026-03-01T00:00:00Z'), updated_at: new Date('2026-03-01T00:00:00Z') },
];

const MOCK_SPECIALTIES: DoctorSpecialty[] = [
    { id: 1, specialtyName: 'Терапевт'    },
    { id: 2, specialtyName: 'Кардиолог'   },
    { id: 3, specialtyName: 'Невролог'    },
    { id: 4, specialtyName: 'Офтальмолог' },
];

const MOCK_PATIENTS_LIST: PatientInfo[] = [
    { id: 'p-001', user_id: 'u-001', email: 'petrov@mail.ru', phone: '123', first_name: 'Алексей', last_name: 'Петров', patronymic: 'Иванович', birth_date: new Date(), gender: 'M', created_at: new Date(), updated_at: new Date() },
    { id: 'p-002', user_id: 'u-002', email: 'sidorova@mail.ru', phone: '456', first_name: 'Мария', last_name: 'Сидорова', patronymic: 'Андреевна', birth_date: new Date(), gender: 'F', created_at: new Date(), updated_at: new Date() },
    { id: 'p-003', user_id: 'u-004', email: 'kuzn@mail.ru', phone: '789', first_name: 'Игорь', last_name: 'Кузнецов', patronymic: 'Олегович', birth_date: new Date(), gender: 'M', created_at: new Date(), updated_at: new Date() },
    { id: 'p-004', user_id: 'u-008', email: 'smirnov@mail.ru', phone: '000', first_name: 'Петр', last_name: 'Смирнов', patronymic: null, birth_date: new Date(), gender: 'M', created_at: new Date(), updated_at: new Date() },
    { id: 'p-005', user_id: 'u-009', email: 'ivanova@mail.ru', phone: '111', first_name: 'Ксения', last_name: 'Иванова', patronymic: 'Александровна', birth_date: new Date(), gender: 'F', created_at: new Date(), updated_at: new Date() },
];

export function createAdminApi(_axios: AxiosInstance) {
    return {
        async fetchAllUsers(): Promise<AdminUser[]> {
            // return (await _axios.get<AdminUser[]>('/users')).data;
            // TODO: Here we should combine Patients, Doctors, Admins
            // For now using pure MOCK_USERS
            return Promise.resolve(MOCK_USERS);
        },

        async fetchAllDoctors(): Promise<UsersDoctorsGetResponseDto> {
            // return (await _axios.get<UsersDoctorsGetResponseDto>('/users/doctors/get')).data;
            return Promise.resolve(MOCK_ADMIN_DOCTORS);
        },

        async fetchAllAppointments(): Promise<AppointmentsGetResponseDto> {
            // return (await _axios.get<AppointmentsGetResponseDto>('/appointments/get')).data;
            return Promise.resolve(MOCK_ADMIN_APPOINTMENTS);
        },

        async fetchAllSpecialties(): Promise<DoctorSpecialty[]> {
             // No endpoint for specialties yet
            return Promise.resolve(MOCK_SPECIALTIES);
        },

        async fetchAllPatients(): Promise<PatientInfo[]> {
            return Promise.resolve(MOCK_PATIENTS_LIST);
        },

        async deleteAppointment(appointmentId: string): Promise<AppointmentsCancelResponseDto> {
            // const dto: AppointmentsCancelRequestDto = { appointment_id: appointmentId };
            // await _axios.post(`/appointments/cancel`, dto);
            const idx = MOCK_ADMIN_APPOINTMENTS.findIndex(a => a.id === appointmentId);
            if (idx !== -1) {
                MOCK_ADMIN_APPOINTMENTS.splice(idx, 1);
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        },

        async createDoctor(dto: CreateDoctorDto): Promise<void> {
             console.warn('createDoctor endpoint missing', dto);
             return Promise.resolve();
        },
    };
}


