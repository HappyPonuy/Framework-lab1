import type { AdminUser, AdminDoctor, AdminAppointment } from '../types/admin.types.ts';
import type { DoctorSpecialty } from '../types/patient.types.ts';

const MOCK_USERS: AdminUser[] = [
    { id: 'u-001', username: 'petrov', roleId: 'P' },
    { id: 'u-002', username: 'sidorova', roleId: 'P' },
    { id: 'u-003', username: 'ivanov_doc', roleId: 'D' },
    { id: 'u-004', username: 'kuzn', roleId: 'P' },
];

const MOCK_SPECIALTIES: DoctorSpecialty[] = [
    { id: 1, specialtyName: 'Терапевт' },
    { id: 2, specialtyName: 'Кардиолог' },
    { id: 3, specialtyName: 'Невролог' },
    { id: 4, specialtyName: 'Офтальмолог' },
];

const MOCK_ADMIN_DOCTORS: AdminDoctor[] = [
    { id: 'd-001', userId: 'u-003', specialtyId: 1, specialtyName: 'Терапевт', firstName: 'Александр', lastName: 'Иванов', patronymic: 'Петрович', notes: null, isActive: true },
    { id: 'd-002', userId: 'u-005', specialtyId: 2, specialtyName: 'Кардиолог', firstName: 'Елена', lastName: 'Смирнова', patronymic: 'Викторовна', notes: null, isActive: true },
    { id: 'd-003', userId: 'u-006', specialtyId: 3, specialtyName: 'Невролог', firstName: 'Дмитрий', lastName: 'Козлов', patronymic: 'Сергеевич', notes: null, isActive: false },
    { id: 'd-004', userId: 'u-007', specialtyId: 4, specialtyName: 'Офтальмолог', firstName: 'Анна', lastName: 'Новикова', patronymic: 'Игоревна', notes: null, isActive: true },
];

const MOCK_ADMIN_APPOINTMENTS: AdminAppointment[] = [
    { id: 'a-001', patientId: 'p-001', patientName: 'Петров А.И.', doctorId: 'd-001', doctorName: 'Иванов А.П.', specialtyName: 'Терапевт', startTime: '2026-02-24T09:00:00Z', patientNotes: null, doctorNotes: null, createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z' },
    { id: 'a-002', patientId: 'p-002', patientName: 'Сидорова М.А.', doctorId: 'd-002', doctorName: 'Смирнова Е.В.', specialtyName: 'Кардиолог', startTime: '2026-02-24T10:00:00Z', patientNotes: null, doctorNotes: null, createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z' },
    { id: 'a-003', patientId: 'p-003', patientName: 'Кузнецов И.О.', doctorId: 'd-001', doctorName: 'Иванов А.П.', specialtyName: 'Терапевт', startTime: '2026-02-23T11:30:00Z', patientNotes: null, doctorNotes: 'Рекомендован рентген', createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-23T00:00:00Z' },
    { id: 'a-004', patientId: 'p-004', patientName: 'Фёдорова О.Н.', doctorId: 'd-004', doctorName: 'Новикова А.И.', specialtyName: 'Офтальмолог', startTime: '2026-02-25T09:30:00Z', patientNotes: null, doctorNotes: null, createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z' },
];

export async function fetchAllUsers(): Promise<AdminUser[]> {
    return Promise.resolve(MOCK_USERS);
}

export async function fetchAllDoctors(): Promise<AdminDoctor[]> {
    return Promise.resolve(MOCK_ADMIN_DOCTORS);
}

export async function fetchAllAppointments(): Promise<AdminAppointment[]> {
    return Promise.resolve(MOCK_ADMIN_APPOINTMENTS);
}

export async function fetchAllSpecialties(): Promise<DoctorSpecialty[]> {
    return Promise.resolve(MOCK_SPECIALTIES);
}

export async function toggleDoctorActive(doctorId: string, isActive: boolean): Promise<void> {
    const idx = MOCK_ADMIN_DOCTORS.findIndex(d => d.id === doctorId);
    if (idx !== -1) MOCK_ADMIN_DOCTORS[idx].isActive = isActive;
    return Promise.resolve();
}

export async function deleteAppointment(appointmentId: string): Promise<void> {
    const idx = MOCK_ADMIN_APPOINTMENTS.findIndex(a => a.id === appointmentId);
    if (idx !== -1) MOCK_ADMIN_APPOINTMENTS.splice(idx, 1);
    return Promise.resolve();
}

