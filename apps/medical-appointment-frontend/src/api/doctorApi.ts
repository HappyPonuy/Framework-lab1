import type { AxiosInstance } from 'axios';
import type { DoctorProfile, DoctorSchedule, DoctorAppointment } from '../types/doctor.types.ts';
import type { AppointmentsUpdateNotesRequestDto } from '@contracts/appointments/update_notes.ts';


const MOCK_DOCTOR_PROFILE: DoctorProfile = {
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

const MOCK_SCHEDULE: DoctorSchedule = {
    id: 's-001',
    doctor_id: 'd-001',
    work_days: 31,
    start_time: '09:00',
    end_time: '18:00',
    slot_minutes: 30,
};

const MOCK_DOCTOR_APPOINTMENTS: DoctorAppointment[] = [
    { id: 'a-001', patient_id: 'p-001', patient_name: 'Петров Алексей Иванович',   doctor_id: 'd-001', doctor_name: 'Иванов А.П.', specialty_name: 'Терапевт', start_time: '09:00', patient_notes: 'Головная боль, температура', doctor_notes: null,                    created_at: '2026-03-04T00:00:00Z', updated_at: '2026-03-04T00:00:00Z' },
    { id: 'a-002', patient_id: 'p-002', patient_name: 'Сидорова Мария Андреевна', doctor_id: 'd-001', doctor_name: 'Иванов А.П.', specialty_name: 'Терапевт', start_time: '10:00', patient_notes: 'Плановый осмотр',           doctor_notes: null,                    created_at: '2026-03-04T00:00:00Z', updated_at: '2026-03-04T00:00:00Z' },
    { id: 'a-003', patient_id: 'p-003', patient_name: 'Кузнецов Игорь Олегович',  doctor_id: 'd-001', doctor_name: 'Иванов А.П.', specialty_name: 'Терапевт', start_time: '11:30', patient_notes: 'Боль в спине',              doctor_notes: 'Рекомендован рентген', created_at: '2026-03-04T00:00:00Z', updated_at: '2026-03-04T00:00:00Z' },
    { id: 'a-004', patient_id: 'p-004', patient_name: 'Фёдорова Ольга Николаевна',doctor_id: 'd-001', doctor_name: 'Иванов А.П.', specialty_name: 'Терапевт', start_time: '14:00', patient_notes: 'Давление, слабость',        doctor_notes: null,                    created_at: '2026-03-04T00:00:00Z', updated_at: '2026-03-04T00:00:00Z' },
    { id: 'a-005', patient_id: 'p-005', patient_name: 'Морозов Виктор Сергеевич', doctor_id: 'd-001', doctor_name: 'Иванов А.П.', specialty_name: 'Терапевт', start_time: '15:30', patient_notes: 'Кашель, насморк',           doctor_notes: null,                    created_at: '2026-03-04T00:00:00Z', updated_at: '2026-03-04T00:00:00Z' },
];


export function createDoctorApi(_axios: AxiosInstance) {
    return {
        async fetchProfile(): Promise<DoctorProfile> {
            // return (await _axios.get<DoctorProfile>('/users/doctors/me')).data;
            return Promise.resolve(MOCK_DOCTOR_PROFILE);
        },

        async fetchSchedule(): Promise<DoctorSchedule> {
            // return (await _axios.get<DoctorSchedule>('/users/doctors/me/schedule')).data;
            return Promise.resolve(MOCK_SCHEDULE);
        },

        async fetchAppointments(): Promise<DoctorAppointment[]> {
            // return (await _axios.get<DoctorAppointment[]>('/appointments')).data;
            return Promise.resolve(MOCK_DOCTOR_APPOINTMENTS);
        },

        async updateAppointmentNotes(dto: AppointmentsUpdateNotesRequestDto): Promise<void> {
            // await _axios.patch(`/appointments/${dto.appointment_id}/notes`, { doctor_notes: dto.doctor_notes });
            const idx = MOCK_DOCTOR_APPOINTMENTS.findIndex(a => a.id === dto.appointment_id);
            if (idx !== -1) MOCK_DOCTOR_APPOINTMENTS[idx].doctor_notes = dto.doctor_notes;
        },
    };
}
