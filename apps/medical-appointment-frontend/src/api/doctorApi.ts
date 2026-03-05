import type { AxiosInstance } from 'axios';
import type { UsersDoctorsInfoResponseDto } from '@contracts/users/doctors/info.ts';
import type { AppointmentsGetResponseDto } from '@contracts/appointments/get.ts';
import type { AppointmentsCompleteRequestDto, AppointmentsCompleteResponseDto } from '@contracts/appointments/complete.ts';
import type { PatientInfo } from '@shared/types/data/patientinfo.js';
import type { UsersPatientsGetResponseDto } from '@contracts/users/patients/get.ts';

const MOCK_DOCTOR: UsersDoctorsInfoResponseDto = {
    id: 'd-001',
    user_id: 'u-003',
    specialty: 'Терапевт',
    first_name: 'Александр',
    last_name: 'Иванов',
    patronymic: 'Петрович',
    notes: null,
    is_active: true,
    work_days: 31,
    shift_start: '09:00',
    shift_end: '18:00',
    slot_minutes: 30,
};

const MOCK_APPOINTMENTS: AppointmentsGetResponseDto = [
    { id: 'a-001', patient_id: 'p-001', doctor_id: 'd-001', progress: 'Назначен', start_time: new Date('2026-03-05T09:00:00Z'), patient_notes: 'Головная боль, температура', doctor_notes: null,                    created_at: new Date('2026-03-04T00:00:00Z'), updated_at: new Date('2026-03-04T00:00:00Z') },
    { id: 'a-002', patient_id: 'p-002', doctor_id: 'd-001', progress: 'Назначен', start_time: new Date('2026-03-05T10:00:00Z'), patient_notes: 'Плановый осмотр',           doctor_notes: null,                    created_at: new Date('2026-03-04T00:00:00Z'), updated_at: new Date('2026-03-04T00:00:00Z') },
    { id: 'a-003', patient_id: 'p-003', doctor_id: 'd-001', progress: 'Завершен', start_time: new Date('2026-03-05T11:30:00Z'), patient_notes: 'Боль в спине',              doctor_notes: 'Рекомендован рентген', created_at: new Date('2026-03-04T00:00:00Z'), updated_at: new Date('2026-03-04T00:00:00Z') },
    { id: 'a-004', patient_id: 'p-004', doctor_id: 'd-001', progress: 'Назначен', start_time: new Date('2026-03-05T14:00:00Z'), patient_notes: 'Давление, слабость',        doctor_notes: null,                    created_at: new Date('2026-03-04T00:00:00Z'), updated_at: new Date('2026-03-04T00:00:00Z') },
    { id: 'a-005', patient_id: 'p-005', doctor_id: 'd-001', progress: 'Назначен', start_time: new Date('2026-03-05T15:30:00Z'), patient_notes: 'Кашель, насморк',           doctor_notes: null,                    created_at: new Date('2026-03-04T00:00:00Z'), updated_at: new Date('2026-03-04T00:00:00Z') },
];

const MOCK_PATIENTS_LIST: PatientInfo[] = [
    { id: 'p-001', user_id: 'u-001', email: 'petrov@mail.ru', phone: '123', first_name: 'Алексей', last_name: 'Петров', patronymic: 'Иванович', birth_date: new Date(), gender: 'M', created_at: new Date(), updated_at: new Date() },
    { id: 'p-002', user_id: 'u-002', email: 'sidorova@mail.ru', phone: '456', first_name: 'Мария', last_name: 'Сидорова', patronymic: 'Андреевна', birth_date: new Date(), gender: 'F', created_at: new Date(), updated_at: new Date() },
    { id: 'p-003', user_id: 'u-004', email: 'kuzn@mail.ru', phone: '789', first_name: 'Игорь', last_name: 'Кузнецов', patronymic: 'Олегович', birth_date: new Date(), gender: 'M', created_at: new Date(), updated_at: new Date() },
    { id: 'p-004', user_id: 'u-008', email: 'smirnov@mail.ru', phone: '000', first_name: 'Петр', last_name: 'Смирнов', patronymic: null, birth_date: new Date(), gender: 'M', created_at: new Date(), updated_at: new Date() },
    { id: 'p-005', user_id: 'u-009', email: 'ivanova@mail.ru', phone: '111', first_name: 'Ксения', last_name: 'Иванова', patronymic: 'Александровна', birth_date: new Date(), gender: 'F', created_at: new Date(), updated_at: new Date() },
];

export function createDoctorApi(_axios: AxiosInstance) {
    return {
        async fetchProfile(doctorId: string): Promise<UsersDoctorsInfoResponseDto> {
            // return (await _axios.get<UsersDoctorsInfoResponseDto>(`/users/doctors/info`, { params: { id: doctorId } })).data;
            return Promise.resolve(MOCK_DOCTOR);
        },

        async fetchAppointments(): Promise<AppointmentsGetResponseDto> {
            // return (await _axios.get<AppointmentsGetResponseDto>('/appointments/get')).data;
            return Promise.resolve(MOCK_APPOINTMENTS);
        },

        async fetchPatients(): Promise<UsersPatientsGetResponseDto> {
            // return (await _axios.get<UsersPatientsGetResponseDto>('/users/patients/get')).data;
            return Promise.resolve(MOCK_PATIENTS_LIST);
        },

        async updateAppointmentNotes(dto: AppointmentsCompleteRequestDto): Promise<AppointmentsCompleteResponseDto> {
            // return (await _axios.post<AppointmentsCompleteResponseDto>('/appointments/complete', dto)).data;
            const idx = MOCK_APPOINTMENTS.findIndex(a => a.id === dto.appointment_id);
            if (idx !== -1) {
                MOCK_APPOINTMENTS[idx].doctor_notes = dto.doctor_notes;
                MOCK_APPOINTMENTS[idx].progress     = 'Завершен';
                return Promise.resolve(MOCK_APPOINTMENTS[idx]);
            }
            throw new Error("Appointment not found");
        },
    };
}
