export interface DoctorProfile {
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

export interface DoctorSchedule {
    id: string;
    doctorId: string;
    workDays: number;
    startTime: string;
    endTime: string;
    slotMinutes: number;
}

export interface DoctorAppointment {
    id: string;
    patientId: string;
    patientFirstName: string;
    patientLastName: string;
    patientPatronymic: string | null;
    patientBirthDate: string;
    startTime: string;
    patientNotes: string | null;
    doctorNotes: string | null;
}

export interface UpdateDoctorNotesDto {
    appointmentId: string;
    doctorNotes: string;
}

export interface DoctorContextType {
    doctor: DoctorProfile | null;
    schedule: DoctorSchedule | null;
    appointments: DoctorAppointment[];
    todayAppointments: DoctorAppointment[];
    loading: boolean;
    error: string | null;
    updateNotes: (dto: UpdateDoctorNotesDto) => Promise<void>;
    refresh: () => Promise<void>;
}
