import type { AxiosInstance } from 'axios';
import type { UsersPatientsInfoResponseDto } from '@contracts/users/patients/info.ts';
import type { UsersDoctorsGetResponseDto } from '@contracts/users/doctors/get.ts';
import type { UsersPatientsUpdateRequestDto, UsersPatientsUpdateResponseDto } from '@contracts/users/patients/update.ts';
import type { AppointmentsGetResponseDto } from '@contracts/appointments/get.ts';
import type { AppointmentsCreateRequestDto, AppointmentsCreateResponseDto } from '@contracts/appointments/create.ts';
import type { AppointmentsCancelRequestDto, AppointmentsCancelResponseDto } from '@contracts/appointments/cancel.ts';


const MOCK_PATIENT: UsersPatientsInfoResponseDto = {
    id: 'p-001',
    user_id: 'u-001',
    email: 'petrov@mail.ru',
    phone: '+7 (999) 123-45-67',
    first_name: 'Алексей',
    last_name: 'Петров',
    patronymic: 'Иванович',
    birth_date: new Date('1995-03-15'),
    gender: 'M',
    created_at: new Date('2026-01-10T00:00:00Z'),
    updated_at: new Date('2026-01-10T00:00:00Z'),
};

const MOCK_DOCTORS: UsersDoctorsGetResponseDto = [
    { id: 'd-001', user_id: 'u-003', specialty: 'Терапевт',    first_name: 'Александр', last_name: 'Иванов',   patronymic: 'Петрович',   notes: null, is_active: true,  work_days: 31, shift_start: '09:00', shift_end: '18:00', slot_minutes: 30 },
    { id: 'd-002', user_id: 'u-005', specialty: 'Кардиолог',   first_name: 'Елена',     last_name: 'Смирнова', patronymic: 'Викторовна', notes: null, is_active: true,  work_days: 31, shift_start: '09:00', shift_end: '17:00', slot_minutes: 30 },
    { id: 'd-003', user_id: 'u-006', specialty: 'Невролог',    first_name: 'Дмитрий',   last_name: 'Козлов',   patronymic: 'Сергеевич',  notes: null, is_active: false, work_days: 20, shift_start: '10:00', shift_end: '16:00', slot_minutes: 30 },
    { id: 'd-004', user_id: 'u-007', specialty: 'Офтальмолог', first_name: 'Анна',      last_name: 'Новикова', patronymic: 'Игоревна',   notes: null, is_active: true,  work_days: 31, shift_start: '08:00', shift_end: '15:00', slot_minutes: 20 },
];

const MOCK_APPOINTMENTS: AppointmentsGetResponseDto = [
    { id: 'a-001', patient_id: 'p-001', doctor_id: 'd-001', progress: 'Назначен',  start_time: new Date('2026-03-10T10:30:00Z'), patient_notes: null, doctor_notes: null,                    created_at: new Date('2026-03-01T00:00:00Z'), updated_at: new Date('2026-03-01T00:00:00Z') },
    { id: 'a-002', patient_id: 'p-001', doctor_id: 'd-002', progress: 'Назначен',  start_time: new Date('2026-03-11T14:00:00Z'), patient_notes: null, doctor_notes: null,                    created_at: new Date('2026-03-01T00:00:00Z'), updated_at: new Date('2026-03-01T00:00:00Z') },
    { id: 'a-003', patient_id: 'p-001', doctor_id: 'd-003', progress: 'Завершен',  start_time: new Date('2026-03-05T11:00:00Z'), patient_notes: null, doctor_notes: 'Рекомендован рентген', created_at: new Date('2026-03-01T00:00:00Z'), updated_at: new Date('2026-03-03T00:00:00Z') },
];

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
        async fetchProfile(_patientId?: string): Promise<UsersPatientsInfoResponseDto> {
             // return (await _axios.get<UsersPatientsInfoResponseDto>(`/users/patients/info`, { params: { id: patientId } })).data;
             return Promise.resolve(MOCK_PATIENT);
        },

        async fetchDoctors(): Promise<UsersDoctorsGetResponseDto> {
            // return (await _axios.get<UsersDoctorsGetResponseDto>('/users/doctors/get')).data;
            return Promise.resolve(MOCK_DOCTORS);
        },

        async fetchAppointments(): Promise<AppointmentsGetResponseDto> {
            // return (await _axios.get<AppointmentsGetResponseDto>('/appointments/get')).data;
            return Promise.resolve(MOCK_APPOINTMENTS);
        },

        async createAppointment(dto: AppointmentsCreateRequestDto): Promise<AppointmentsCreateResponseDto> {
            // return (await _axios.post<AppointmentsCreateResponseDto>('/appointments/create', dto)).data;
            const id = `a-${dto.doctor_id}-${dto.start_time.getTime()}`;
            const existing = MOCK_APPOINTMENTS.find(a => a.id === id);
            if (existing) return Promise.resolve(existing);
            const now = new Date();
            const newAppointment: AppointmentsCreateResponseDto = {
                id,
                patient_id: MOCK_PATIENT.id,
                doctor_id:  dto.doctor_id,
                progress:   'Назначен',
                start_time: dto.start_time,
                patient_notes: dto.patient_notes ?? null,
                doctor_notes:  null,
                created_at: now,
                updated_at: now,
            };
            MOCK_APPOINTMENTS.push(newAppointment);
            return Promise.resolve(newAppointment);
        },

        async cancelAppointment(dto: AppointmentsCancelRequestDto): Promise<AppointmentsCancelResponseDto> {
            // await _axios.post(`/appointments/cancel`, dto);
            const idx = MOCK_APPOINTMENTS.findIndex(a => a.id === dto.appointment_id);
            if (idx !== -1) {
                MOCK_APPOINTMENTS[idx].progress = 'Отменен';
                MOCK_APPOINTMENTS[idx].updated_at = new Date();
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        },

        async updateProfile(dto: UsersPatientsUpdateRequestDto): Promise<UsersPatientsUpdateResponseDto> {
            // return (await _axios.post<UsersPatientsUpdateResponseDto>('/users/patients/update', dto)).data;
            Object.assign(MOCK_PATIENT, dto, {
                birth_date: new Date(dto.birth_date),
                updated_at: new Date(),
            });
            return Promise.resolve({ ...MOCK_PATIENT });
        },
    };
}



