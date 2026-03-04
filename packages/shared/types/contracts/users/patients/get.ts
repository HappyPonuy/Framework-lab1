export type UsersPatientsGetResponseDto = {
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
}[];

