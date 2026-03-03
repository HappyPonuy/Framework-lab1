import type { DoctorSpecialty } from './patient.types.ts';

export interface AdminUser {
    id: string;
    username: string;
    roleId: 'P' | 'D' | 'A';
}

export interface AdminDoctor {
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

export interface AdminAppointment {
    id: string;
    patientId: string;
    patientName: string;
    doctorId: string;
    doctorName: string;
    specialtyName: string;
    startTime: string;
    patientNotes: string | null;
    doctorNotes: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDoctorDto {
    userId: string;
    specialtyId: number;
    firstName: string;
    lastName: string;
    patronymic?: string;
    notes?: string;
}

export interface AdminContextType {
    users: AdminUser[];
    doctors: AdminDoctor[];
    appointments: AdminAppointment[];
    specialties: DoctorSpecialty[];
    loading: boolean;
    error: string | null;
    toggleDoctorActive: (doctorId: string, isActive: boolean) => Promise<void>;
    deleteAppointment: (appointmentId: string) => Promise<void>;
    createDoctor: (dto: CreateDoctorDto) => Promise<void>;
    refresh: () => Promise<void>;
}
