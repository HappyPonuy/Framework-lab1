export type GetDoctorsResponseDto = {
    id: string;
    userId: string;
    specialtyId: number;
    specialtyName: string;
    firstName: string;
    lastName: string;
    patronymic: string | null;
    notes: string | null;
    isActive: boolean;
}[];

export type GetSpecialtiesResponseDto = {
    id: number;
    specialtyName: string;
}[];

