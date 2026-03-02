export interface Patient {
    id: string;
    userId: string;
    email: string;
    phone: string | null;
    firstName: string;
    lastName: string;
    patronymic: string | null;
    birthDate: string;
    gender: 'M' | 'F' | null;
    createdAt: string;
    updatedAt: string;
}

export interface DoctorSpecialty {
    id: number;
    specialtyName: string;
}

export interface DoctorInfo {
    id: string;
    userId: string;
    specialtyId: number;
    specialtyName: string;
    firstName: string;
    lastName: string;
    patronymic: string | null;
    notes: string | null;
    isActive: boolean;
}

export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    doctorName: string;
    specialtyName: string;
    startTime: string;
    patientNotes: string | null;
    doctorNotes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAppointmentDto {
    doctorId: string;
    startTime: string;
    patientNotes?: string;
}

export interface PatientContextType {
    patient: Patient | null;
    appointments: Appointment[];
    doctors: DoctorInfo[];
    loading: boolean;
    error: string | null;
    bookAppointment: (dto: CreateAppointmentDto) => Promise<void>;
    cancelAppointment: (appointmentId: string) => Promise<void>;
    refresh: () => Promise<void>;
}
