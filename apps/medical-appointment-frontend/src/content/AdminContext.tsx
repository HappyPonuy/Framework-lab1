import { createContext, useCallback, useContext } from 'react';
import type { AdminContextType } from '../types/admin.types.ts';
import {
    useGetDoctorsQuery,
    useGetAppointmentsQuery,
    useGetAllPatientsQuery,
    useCancelAppointmentMutation,
    medApi,
} from '../store/api.ts';
import { useAppDispatch } from '../store/hooks.ts';

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();

    const { data: doctors = [], isLoading: loadingDoctors } = 
        useGetDoctorsQuery();
    const { data: appointments = [], isLoading: loadingAppointments } = 
        useGetAppointmentsQuery();
    const { data: patients = [],     isLoading: loadingPatients } = 
        useGetAllPatientsQuery();

    const [cancelAppointmentMut] = useCancelAppointmentMutation();

    const loading = loadingDoctors || loadingAppointments || loadingPatients;

    const deleteAppointment = useCallback(async (appointmentId: string) => {
        await cancelAppointmentMut({ appointment_id: appointmentId }).unwrap();
    }, [cancelAppointmentMut]);

    const refresh = useCallback(async () => {
        dispatch(medApi.util.invalidateTags(['Doctors', 'Appointments', 'Patients']));
    }, [dispatch]);

    return (
        <AdminContext.Provider value={{
            doctors:      Array.isArray(doctors)      ? doctors      : [],
            appointments: Array.isArray(appointments) ? appointments : [],
            patients:     Array.isArray(patients)     ? patients     : [],
            loading,
            error: null,
            deleteAppointment,
            refresh,
        }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin(): AdminContextType {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error('useAdmin must be used within an AdminProvider');
    return ctx;
}
