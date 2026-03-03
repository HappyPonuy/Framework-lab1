import type { AxiosInstance } from 'axios';
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
    { id: 'a-001', patientId: 'p-001', patientFirstName: 'Алексей', patientLastName: 'Петров',   patientPatronymic: 'Иванович',  patientBirthDate: '1995-03-15', startTime: '09:00', patientNotes: 'Головная боль, температура', doctorNotes: null },
    { id: 'a-002', patientId: 'p-002', patientFirstName: 'Мария',   patientLastName: 'Сидорова', patientPatronymic: 'Андреевна', patientBirthDate: '1981-07-22', startTime: '10:00', patientNotes: 'Плановый осмотр',           doctorNotes: null },
    { id: 'a-003', patientId: 'p-003', patientFirstName: 'Игорь',   patientLastName: 'Кузнецов', patientPatronymic: 'Олегович',  patientBirthDate: '1998-11-05', startTime: '11:30', patientNotes: 'Боль в спине',              doctorNotes: 'Рекомендован рентген' },
    { id: 'a-004', patientId: 'p-004', patientFirstName: 'Ольга',   patientLastName: 'Фёдорова', patientPatronymic: 'Николаевна',patientBirthDate: '1971-04-10', startTime: '14:00', patientNotes: 'Давление, слабость',        doctorNotes: null },
    { id: 'a-005', patientId: 'p-005', patientFirstName: 'Виктор',  patientLastName: 'Морозов',  patientPatronymic: 'Сергеевич', patientBirthDate: '1988-09-17', startTime: '15:30', patientNotes: 'Кашель, насморк',           doctorNotes: null },
];


export function createDoctorApi(_axios: AxiosInstance) {
    return {
        async fetchProfile(): Promise<DoctorProfile> {
            // return (await axios.get<DoctorProfile>('/doctor/profile')).data;
            return Promise.resolve(MOCK_DOCTOR_PROFILE);
        },

        async fetchSchedule(): Promise<DoctorSchedule> {
            // return (await axios.get<DoctorSchedule>('/doctor/schedule')).data;
            return Promise.resolve(MOCK_SCHEDULE);
        },

        async fetchAppointments(): Promise<DoctorAppointment[]> {
            // return (await axios.get<DoctorAppointment[]>('/doctor/appointments')).data;
            return Promise.resolve(MOCK_DOCTOR_APPOINTMENTS);
        },

        async updateAppointmentNotes(dto: UpdateDoctorNotesDto): Promise<void> {
            // await axios.patch(`/doctor/appointments/${dto.appointmentId}/notes`, { doctorNotes: dto.doctorNotes });
            const idx = MOCK_DOCTOR_APPOINTMENTS.findIndex(a => a.id === dto.appointmentId);
            if (idx !== -1) MOCK_DOCTOR_APPOINTMENTS[idx].doctorNotes = dto.doctorNotes;
        },
    };
}
