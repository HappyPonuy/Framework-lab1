export type AppointmentDto = {
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
};

export type AppointmentsGetResponseDto = AppointmentDto[];

