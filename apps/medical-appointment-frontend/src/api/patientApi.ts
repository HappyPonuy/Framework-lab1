import type { AxiosInstance } from 'axios';
import type { Patient, DoctorInfo, Appointment } from '../types/patient.types.ts';
import type { GetPatientProfileResponseDto, UpdatePatientProfileRequestDto, UpdatePatientProfileResponseDto } from '@contracts/patient/get-profile.ts';
import type { GetDoctorsResponseDto } from '@contracts/patient/get-doctors.ts';
import type { GetAppointmentsResponseDto, CreateAppointmentRequestDto, CreateAppointmentResponseDto, CancelAppointmentRequestDto, CancelAppointmentResponseDto } from '@contracts/patient/appointments.ts';


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
    { id: 'd-001', userId: 'u-003', specialtyId: 1, specialtyName: 'Терапевт',    firstName: 'Александр', lastName: 'Иванов',   patronymic: 'Петрович',   notes: null, isActive: true  },
    { id: 'd-002', userId: 'u-005', specialtyId: 2, specialtyName: 'Кардиолог',   firstName: 'Елена',     lastName: 'Смирнова', patronymic: 'Викторовна', notes: null, isActive: true  },
    { id: 'd-003', userId: 'u-006', specialtyId: 3, specialtyName: 'Невролог',    firstName: 'Дмитрий',   lastName: 'Козлов',   patronymic: 'Сергеевич',  notes: null, isActive: false },
    { id: 'd-004', userId: 'u-007', specialtyId: 4, specialtyName: 'Офтальмолог', firstName: 'Анна',      lastName: 'Новикова', patronymic: 'Игоревна',   notes: null, isActive: true  },
];

const MOCK_APPOINTMENTS: Appointment[] = [
    { id: 'a-001', patientId: 'p-001', doctorId: 'd-001', doctorName: 'Иванов А.П.',   specialtyName: 'Терапевт',    startTime: '10:30', patientNotes: null, doctorNotes: null,                    createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
    { id: 'a-002', patientId: 'p-001', doctorId: 'd-002', doctorName: 'Смирнова Е.В.', specialtyName: 'Кардиолог',   startTime: '14:00', patientNotes: null, doctorNotes: null,                    createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-01T00:00:00Z' },
    { id: 'a-003', patientId: 'p-001', doctorId: 'd-003', doctorName: 'Козлов Д.С.',   specialtyName: 'Невролог',    startTime: '11:00', patientNotes: null, doctorNotes: 'Рекомендован рентген', createdAt: '2026-03-01T00:00:00Z', updatedAt: '2026-03-03T00:00:00Z' },
];


export function createPatientApi(_axios: AxiosInstance) {
    return {
        async fetchProfile(): Promise<GetPatientProfileResponseDto> {
            // return (await _axios.get<GetPatientProfileResponseDto>('/patient/profile')).data;
            return Promise.resolve(MOCK_PATIENT);
        },

        async fetchDoctors(): Promise<GetDoctorsResponseDto> {
            // return (await _axios.get<GetDoctorsResponseDto>('/patient/doctors')).data;
            return Promise.resolve(MOCK_DOCTORS);
        },

        async fetchAppointments(): Promise<GetAppointmentsResponseDto> {
            // return (await _axios.get<GetAppointmentsResponseDto>('/patient/appointments')).data;
            return Promise.resolve(MOCK_APPOINTMENTS);
        },

        async createAppointment(dto: CreateAppointmentRequestDto): Promise<CreateAppointmentResponseDto> {
            // return (await _axios.post<CreateAppointmentResponseDto>('/patient/appointments', dto)).data;
            const doc = MOCK_DOCTORS.find(d => d.id === dto.doctorId);
            const id = `a-${dto.doctorId}-${dto.startTime}`;
            if (MOCK_APPOINTMENTS.find(a => a.id === id)) {
                return Promise.resolve(MOCK_APPOINTMENTS.find(a => a.id === id)!);
            }
            const newAppointment: Appointment = {
                id,
                patientId: MOCK_PATIENT.id,
                doctorId: dto.doctorId,
                doctorName: doc ? `${doc.lastName} ${doc.firstName[0]}.${doc.patronymic ? doc.patronymic[0] + '.' : ''}` : 'Врач',
                specialtyName: doc?.specialtyName ?? '',
                startTime: dto.startTime,
                patientNotes: dto.patientNotes ?? null,
                doctorNotes: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            MOCK_APPOINTMENTS.push(newAppointment);
            return Promise.resolve(newAppointment);
        },

        async cancelAppointment(dto: CancelAppointmentRequestDto): Promise<CancelAppointmentResponseDto> {
            // await _axios.delete<CancelAppointmentResponseDto>(`/patient/appointments/${dto.appointmentId}`);
            const idx = MOCK_APPOINTMENTS.findIndex(a => a.id === dto.appointmentId);
            if (idx !== -1) MOCK_APPOINTMENTS.splice(idx, 1);
        },

        async updateProfile(dto: UpdatePatientProfileRequestDto): Promise<UpdatePatientProfileResponseDto> {
            // return (await _axios.patch<UpdatePatientProfileResponseDto>('/patient/profile', dto)).data;
            Object.assign(MOCK_PATIENT, dto, { updatedAt: new Date().toISOString() });
            return Promise.resolve({ ...MOCK_PATIENT });
        },
    };
}
