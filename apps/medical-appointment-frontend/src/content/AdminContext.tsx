import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AdminDoctor, AdminAppointment, AdminPatient, AdminContextType } from '../types/admin.types.ts';
import { createAdminApi } from '../api/adminApi.ts';
import { useApi } from '../hooks/useApi.ts';

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const { api } = useApi();
    const adminApi = useMemo(() => createAdminApi(api), [api]);
    const adminApiRef = useRef(adminApi);
    adminApiRef.current = adminApi;

    const [doctors, setDoctors]           = useState<AdminDoctor[]>([]);
    const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
    const [patients, setPatients]         = useState<AdminPatient[]>([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [doctorsData, appointmentsData, patientsData] = await Promise.all([
                adminApiRef.current.fetchAllDoctors(),
                adminApiRef.current.fetchAllAppointments(),
                adminApiRef.current.fetchAllPatients(),
            ]);
            setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
            setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
            setPatients(Array.isArray(patientsData) ? patientsData : []);
        } catch (err: unknown) {
            const e = err as { message?: string };
            setError(e.message ?? 'Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const deleteAppointment = useCallback(async (appointmentId: string) => {
        const result = await adminApiRef.current.deleteAppointment(appointmentId);
        if (result) {
            setAppointments(prev => prev.filter(a => a.id !== appointmentId));
        }
    }, []);

    return (
        <AdminContext.Provider value={{
            doctors, appointments, patients,
            loading, error,
            deleteAppointment,
            refresh: load,
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