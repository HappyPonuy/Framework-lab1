import { createContext, useCallback, useContext } from 'react';
import type { DoctorContextType, DoctorSchedule, UpdateDoctorNotesDto } from '../types/doctor.types.ts';
import { useAuth } from './AuthContext.tsx';
import {
    useGetDoctorProfileQuery,
    useGetAppointmentsQuery,
    useGetAllPatientsQuery,
    useCompleteAppointmentMutation,
    medApi,
} from '../store/api.ts';
import { useAppDispatch } from '../store/hooks.ts';

const DoctorContext = createContext<DoctorContextType | null>(null);

export function DoctorProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const dispatch = useAppDispatch();

    const { data: doctor = null, isLoading: loadingProfile, error: profileError } =
        useGetDoctorProfileQuery(user?.id ?? '', { skip: !user });
    const { data: appointments = [], isLoading: loadingAppointments } =
        useGetAppointmentsQuery();
    const { data: patients = [], isLoading: loadingPatients } =
        useGetAllPatientsQuery();

    const [completeAppointmentMut] = useCompleteAppointmentMutation();

    const loading = loadingProfile || loadingAppointments || loadingPatients;
    const error   = profileError
        ? ((profileError as { data?: { error?: string } }).data?.error ?? 'Ошибка загрузки профиля')
        : null;

    const schedule: DoctorSchedule | null = doctor
        ? {
            work_days:    doctor.work_days,
            shift_start:  doctor.shift_start,
            shift_end:    doctor.shift_end,
            slot_minutes: doctor.slot_minutes,
          }
        : null;

    const todayAppointments = (Array.isArray(appointments) ? appointments : []).filter(a => {
        const d   = new Date(a.start_time);
        const now = new Date();
        return d.getFullYear() === now.getFullYear()
            && d.getMonth()    === now.getMonth()
            && d.getDate()     === now.getDate();
    });

    const updateNotes = useCallback(async (dto: UpdateDoctorNotesDto) => {
        await completeAppointmentMut(dto).unwrap();
    }, [completeAppointmentMut]);

    const refresh = useCallback(async () => {
        dispatch(medApi.util.invalidateTags(['DoctorProfile', 'Appointments', 'Patients']));
    }, [dispatch]);

    return (
        <DoctorContext.Provider value={{
            doctor:             doctor ?? null,
            schedule,
            appointments:       Array.isArray(appointments) ? appointments : [],
            todayAppointments,
            patients:           Array.isArray(patients)     ? patients     : [],
            loading,
            error,
            updateNotes,
            refresh,
        }}>
            {children}
        </DoctorContext.Provider>
    );
}

export function useDoctor(): DoctorContextType {
    const ctx = useContext(DoctorContext);
    if (!ctx) throw new Error('useDoctor must be used within a DoctorProvider');
    return ctx;
}
