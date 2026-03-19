import { createContext, useCallback, useContext } from 'react';
import type { PatientContextType, CreateAppointmentDto, UpdatePatientDto } from '../types/patient.types.ts';
import { useAuth } from './AuthContext.tsx';
import {
    useGetPatientProfileQuery,
    useGetDoctorsQuery,
    useGetAppointmentsQuery,
    useCreateAppointmentMutation,
    useCancelAppointmentMutation,
    useUpdatePatientProfileMutation,
    medApi,
} from '../store/api.ts';
import { useAppDispatch } from '../store/hooks.ts';

const PatientContext = createContext<PatientContextType | null>(null);

export function PatientProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const dispatch = useAppDispatch();

    const { data: patient = null, isLoading: loadingProfile, error: profileError } =
        useGetPatientProfileQuery(user?.id ?? '', { skip: !user });
    const { data: doctors = [], isLoading: loadingDoctors } =
        useGetDoctorsQuery();
    const { data: appointments = [], isLoading: loadingAppointments } =
        useGetAppointmentsQuery();

    const [createAppointmentMut] = useCreateAppointmentMutation();
    const [cancelAppointmentMut] = useCancelAppointmentMutation();
    const [updateProfileMut] = useUpdatePatientProfileMutation();

    const loading = loadingProfile || loadingDoctors || loadingAppointments;
    const error   = profileError
        ? ((profileError as { data?: { error?: string } }).data?.error ?? 'Ошибка загрузки профиля')
        : null;

    const bookAppointment = useCallback(async (dto: CreateAppointmentDto) => {
        await createAppointmentMut(dto).unwrap();
    }, [createAppointmentMut]);

    const cancelAppointment = useCallback(async (appointmentId: string) => {
        await cancelAppointmentMut({ appointment_id: appointmentId }).unwrap();
    }, [cancelAppointmentMut]);

    const updateProfile = useCallback(async (dto: UpdatePatientDto) => {
        await updateProfileMut(dto).unwrap();
    }, [updateProfileMut]);

    const refresh = useCallback(async () => {
        dispatch(medApi.util.invalidateTags(['PatientProfile', 'Appointments', 'Doctors']));
    }, [dispatch]);

    return (
        <PatientContext.Provider value={{
            patient:      patient ?? null,
            appointments: Array.isArray(appointments) ? appointments : [],
            doctors:      Array.isArray(doctors)      ? doctors      : [],
            loading,
            error,
            bookAppointment,
            cancelAppointment,
            updateProfile,
            refresh,
        }}>
            {children}
        </PatientContext.Provider>
    );
}

export function usePatient(): PatientContextType {
    const ctx = useContext(PatientContext);
    if (!ctx) throw new Error('usePatient must be used within a PatientProvider');
    return ctx;
}
