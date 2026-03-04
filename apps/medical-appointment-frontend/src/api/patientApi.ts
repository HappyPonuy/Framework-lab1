import type { AxiosInstance } from 'axios';
import type { Patient, DoctorInfo, Appointment, UpdatePatientDto } from '../types/patient.types.ts';
import type { AppointmentsCreateRequestDto } from '@contracts/appointments/create.ts';
import type { AppointmentsCancelRequestDto } from '@contracts/appointments/cancel.ts';


const MOCK_PATIENT: Patient = {
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

const MOCK_DOCTORS: DoctorInfo[] = [
    { id: 'd-001', user_id: 'u-003', specialty: 'Терапевт',    first_name: 'Александр', last_name: 'Иванов',   patronymic: 'Петрович',   notes: null, is_active: true,  work_days: 31, shift_start: '09:00', shift_end: '18:00', slot_minutes: 30 },
    { id: 'd-002', user_id: 'u-005', specialty: 'Кардиолог',   first_name: 'Елена',     last_name: 'Смирнова', patronymic: 'Викторовна', notes: null, is_active: true,  work_days: 31, shift_start: '09:00', shift_end: '17:00', slot_minutes: 30 },
    { id: 'd-003', user_id: 'u-006', specialty: 'Невролог',    first_name: 'Дмитрий',   last_name: 'Козлов',   patronymic: 'Сергеевич',  notes: null, is_active: false, work_days: 20, shift_start: '10:00', shift_end: '16:00', slot_minutes: 30 },
    { id: 'd-004', user_id: 'u-007', specialty: 'Офтальмолог', first_name: 'Анна',      last_name: 'Новикова', patronymic: 'Игоревна',   notes: null, is_active: true,  work_days: 31, shift_start: '08:00', shift_end: '15:00', slot_minutes: 20 },
];

const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'a-001', patient_id: 'p-001', patient_name: 'Петров Алексей Иванович', doctor_id: 'd-001', doctor_name: 'Иванов А.П.',   specialty_name: 'Терапевт',  start_time: '10:30', patient_notes: null, doctor_notes: null,                    created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
    { id: 'a-002', patient_id: 'p-001', patient_name: 'Петров Алексей Иванович', doctor_id: 'd-002', doctor_name: 'Смирнова Е.В.', specialty_name: 'Кардиолог', start_time: '14:00', patient_notes: null, doctor_notes: null,                    created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-01T00:00:00Z' },
    { id: 'a-003', patient_id: 'p-001', patient_name: 'Петров Алексей Иванович', doctor_id: 'd-003', doctor_name: 'Козлов Д.С.',   specialty_name: 'Невролог',  start_time: '11:00', patient_notes: null, doctor_notes: 'Рекомендован рентген', created_at: '2026-03-01T00:00:00Z', updated_at: '2026-03-03T00:00:00Z' },
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
        async fetchProfile(): Promise<Patient> {
            // return (await _axios.get<Patient>('/users/patients/me')).data;
            return Promise.resolve(MOCK_PATIENT);
        },

        async fetchDoctors(): Promise<DoctorInfo[]> {
            // return (await _axios.get<DoctorInfo[]>('/users/doctors')).data;
            return Promise.resolve(MOCK_DOCTORS);
        },

        async fetchAppointments(): Promise<Appointment[]> {
            // return (await _axios.get<Appointment[]>('/appointments')).data;
            return Promise.resolve(MOCK_APPOINTMENTS);
        },

        async createAppointment(dto: AppointmentsCreateRequestDto): Promise<Appointment> {
            // return (await _axios.post<Appointment>('/appointments', dto)).data;
            const doc = MOCK_DOCTORS.find(d => d.id === dto.doctor_id);
            const id = `a-${dto.doctor_id}-${dto.start_time}`;
            const existing = MOCK_APPOINTMENTS.find(a => a.id === id);
            if (existing) return Promise.resolve(existing);
            const newAppointment: Appointment = {
                id,
                patient_id: MOCK_PATIENT.id,
                patient_name: `${MOCK_PATIENT.last_name} ${MOCK_PATIENT.first_name} ${MOCK_PATIENT.patronymic ?? ''}`.trim(),
                doctor_id: dto.doctor_id,
                doctor_name: doc ? `${doc.last_name} ${doc.first_name[0]}.${doc.patronymic ? doc.patronymic[0] + '.' : ''}` : 'Врач',
                specialty_name: doc?.specialty ?? '',
                start_time: dto.start_time,
                patient_notes: dto.patient_notes ?? null,
                doctor_notes: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            MOCK_APPOINTMENTS.push(newAppointment);
            return Promise.resolve(newAppointment);
        },

        async cancelAppointment(dto: AppointmentsCancelRequestDto): Promise<void> {
            // await _axios.delete(`/appointments/${dto.appointment_id}`);
            const idx = MOCK_APPOINTMENTS.findIndex(a => a.id === dto.appointment_id);
            if (idx !== -1) MOCK_APPOINTMENTS.splice(idx, 1);
        },

        async updateProfile(dto: UpdatePatientDto): Promise<Patient> {
            // return (await _axios.patch<Patient>('/users/patients/me', dto)).data;
            Object.assign(MOCK_PATIENT, dto, {
                birth_date: new Date(dto.birth_date),
                updated_at: new Date(),
            });
            return Promise.resolve({ ...MOCK_PATIENT });
        },
    };
}
