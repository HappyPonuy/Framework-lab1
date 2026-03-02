import type { DoctorProfile, DoctorSchedule, DoctorAppointment, UpdateDoctorNotesDto } from '../types/doctor.types.ts';

const MOCK_DOCTOR_PROFILE: DoctorProfile = {
    id: 'd-001',
    userId: 'u-003',
    specialtyId: 1,
    specialtyName: 'Терапевт',
    firstName: 'Александр',
    lastName: 'Иванов',
    patronymic: 'Петрович',
    notes: null,
    isActive: true,
};

const MOCK_SCHEDULE: DoctorSchedule = {
    id: 's-001',
    doctorId: 'd-001',
    workDays: 31,
    startTime: '09:00',
    endTime: '18:00',
    slotMinutes: 30,
};

const MOCK_DOCTOR_APPOINTMENTS: DoctorAppointment[] = [
    {
        id: 'a-001', patientId: 'p-001',
        patientFirstName: 'Алексей', patientLastName: 'Петров', patientPatronymic: 'Иванович',
        patientBirthDate: '1995-03-15',
        startTime: '2026-03-02T09:00:00Z',
        patientNotes: 'Головная боль, температура', doctorNotes: null,
    },
    {
        id: 'a-002', patientId: 'p-002',
        patientFirstName: 'Мария', patientLastName: 'Сидорова', patientPatronymic: 'Андреевна',
        patientBirthDate: '1981-07-22',
        startTime: '2026-03-02T10:00:00Z',
        patientNotes: 'Плановый осмотр', doctorNotes: null,
    },
    {
        id: 'a-003', patientId: 'p-003',
        patientFirstName: 'Игорь', patientLastName: 'Кузнецов', patientPatronymic: 'Олегович',
        patientBirthDate: '1998-11-05',
        startTime: '2026-03-02T11:30:00Z',
        patientNotes: 'Боль в спине', doctorNotes: 'Рекомендован рентген',
    },
    {
        id: 'a-004', patientId: 'p-004',
        patientFirstName: 'Ольга', patientLastName: 'Фёдорова', patientPatronymic: 'Николаевна',
        patientBirthDate: '1971-04-10',
        startTime: '2026-03-03T09:30:00Z',
        patientNotes: 'Давление, слабость', doctorNotes: null,
    },
    {
        id: 'a-005', patientId: 'p-005',
        patientFirstName: 'Виктор', patientLastName: 'Морозов', patientPatronymic: 'Сергеевич',
        patientBirthDate: '1988-09-17',
        startTime: '2026-03-03T11:00:00Z',
        patientNotes: 'Кашель, насморк', doctorNotes: null,
    },
];

export async function fetchDoctorProfile(): Promise<DoctorProfile> {
    return Promise.resolve(MOCK_DOCTOR_PROFILE);
}

export async function fetchDoctorSchedule(): Promise<DoctorSchedule> {
    return Promise.resolve(MOCK_SCHEDULE);
}

export async function fetchDoctorAppointments(): Promise<DoctorAppointment[]> {
    return Promise.resolve(MOCK_DOCTOR_APPOINTMENTS);
}

export async function updateAppointmentNotes(dto: UpdateDoctorNotesDto): Promise<void> {
    const idx = MOCK_DOCTOR_APPOINTMENTS.findIndex(a => a.id === dto.appointmentId);
    if (idx !== -1) MOCK_DOCTOR_APPOINTMENTS[idx].doctorNotes = dto.doctorNotes;
    return Promise.resolve();
}
