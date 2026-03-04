export type AppointmentDto = {
    id: string;
    patient_id: string;
    patient_name: string;
    doctor_id: string;
    doctor_name: string;
    specialty_name: string;
    start_time: string;
    patient_notes: string | null;
    doctor_notes: string | null;
    created_at: string;
    updated_at: string;
};

export type AppointmentsGetResponseDto = AppointmentDto[];
