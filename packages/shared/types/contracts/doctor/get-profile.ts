export type GetDoctorProfileResponseDto = {
    id: string;
    userId: string;
    specialtyId: number;
    specialtyName: string;
    firstName: string;
    lastName: string;
    patronymic: string | null;
    notes: string | null;
    isActive: boolean;
};

export type GetDoctorScheduleResponseDto = {
    id: string;
    doctorId: string;
    workDays: number;
    startTime: string;
    endTime: string;
    slotMinutes: number;
};

