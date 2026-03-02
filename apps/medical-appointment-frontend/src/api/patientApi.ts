import type { Patient, DoctorInfo, Appointment, CreateAppointmentDto } from '../types/patient.types.ts';

const MOCK_PATIENT: Patient = {
    id: 'p-001',
    userId: 'u-001',
    email: 'petrov@mail.ru',
    phone: '+7 (999) 123-45-67',
    firstName: 'Алексей',
    lastName: 'Петров',
    patronymic: 'Иванович',
    birthDate: '1995-03-15',
    gender: 'M',
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-10T00:00:00Z',
};

const MOCK_DOCTORS: DoctorInfo[] = [
    { id: 'd-001', userId: 'u-003', specialtyId: 1, specialtyName: 'Терапевт', firstName: 'Александр', lastName: 'Иванов', patronymic: 'Петрович', notes: null, isActive: true },
    { id: 'd-002', userId: 'u-005', specialtyId: 2, specialtyName: 'Кардиолог', firstName: 'Елена', lastName: 'Смирнова', patronymic: 'Викторовна', notes: null, isActive: true },
    { id: 'd-003', userId: 'u-006', specialtyId: 3, specialtyName: 'Невролог', firstName: 'Дмитрий', lastName: 'Козлов', patronymic: 'Сергеевич', notes: null, isActive: false },
    { id: 'd-004', userId: 'u-007', specialtyId: 4, specialtyName: 'Офтальмолог', firstName: 'Анна', lastName: 'Новикова', patronymic: 'Игоревна', notes: null, isActive: true },
];

const MOCK_APPOINTMENTS: Appointment[] = [
    {
        id: 'a-001', patientId: 'p-001', doctorId: 'd-001',
        doctorName: 'Иванов А.П.', specialtyName: 'Терапевт',
        startTime: '2026-03-02T10:30:00Z', patientNotes: null, doctorNotes: null,
        createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
    },
    {
        id: 'a-002', patientId: 'p-001', doctorId: 'd-002',
        doctorName: 'Смирнова Е.В.', specialtyName: 'Кардиолог',
        startTime: '2026-03-05T14:00:00Z', patientNotes: null, doctorNotes: null,
        createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z',
    },
    {
        id: 'a-003', patientId: 'p-001', doctorId: 'd-003',
        doctorName: 'Козлов Д.С.', specialtyName: 'Невролог',
        startTime: '2026-01-10T11:00:00Z', patientNotes: null, doctorNotes: 'Рекомендован рентген',
        createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-10T00:00:00Z',
    },
];

export async function fetchPatientProfile(): Promise<Patient> {
    return Promise.resolve(MOCK_PATIENT);
}

export async function fetchPatientDoctors(): Promise<DoctorInfo[]> {
    return Promise.resolve(MOCK_DOCTORS);
}

export async function fetchPatientAppointments(): Promise<Appointment[]> {
    return Promise.resolve(MOCK_APPOINTMENTS);
}

export async function createAppointment(dto: CreateAppointmentDto): Promise<Appointment> {
    const newAppointment: Appointment = {
        id: `a-${Date.now()}`,
        patientId: MOCK_PATIENT.id,
        doctorId: dto.doctorId,
        doctorName: MOCK_DOCTORS.find(d => d.id === dto.doctorId)?.lastName ?? 'Врач',
        specialtyName: MOCK_DOCTORS.find(d => d.id === dto.doctorId)?.specialtyName ?? '',
        startTime: dto.startTime,
        patientNotes: dto.patientNotes ?? null,
        doctorNotes: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    MOCK_APPOINTMENTS.push(newAppointment);
    return Promise.resolve(newAppointment);
}

export async function cancelAppointment(appointmentId: string): Promise<void> {
    const idx = MOCK_APPOINTMENTS.findIndex(a => a.id === appointmentId);
    if (idx !== -1) MOCK_APPOINTMENTS.splice(idx, 1);
    return Promise.resolve();
}
