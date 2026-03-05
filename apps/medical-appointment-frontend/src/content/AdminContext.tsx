import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AdminUser, AdminDoctor, AdminAppointment, AdminContextType, CreateDoctorDto } from '../types/admin.types.ts';
import type { PatientInfo } from '@shared/types/data/patientinfo.d.ts';
import { createAdminApi } from '../api/adminApi.ts';
import { useApi } from '../hooks/useApi.ts';

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    const { api } = useApi();
    const adminApi = useMemo(() => createAdminApi(api), [api]);
    const adminApiRef = useRef(adminApi);
    adminApiRef.current = adminApi;

    const [users, setUsers]               = useState<AdminUser[]>([]);
    const [doctors, setDoctors]           = useState<AdminDoctor[]>([]);
    const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
    const [patients, setPatients]         = useState<PatientInfo[]>([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [usersData, doctorsData, appointmentsData, patientsData] = await Promise.all([
                adminApiRef.current.fetchAllUsers(),
                adminApiRef.current.fetchAllDoctors(),
                adminApiRef.current.fetchAllAppointments(),
                adminApiRef.current.fetchAllPatients(),
            ]);
            setUsers(usersData);
            setDoctors(doctorsData);
            setAppointments(appointmentsData);
            setPatients(patientsData);
        } catch (err: unknown) {
            const e = err as { message?: string };
            setError(e.message ?? 'Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const deleteAppointment = useCallback(async (appointmentId: string) => {
        await adminApiRef.current.deleteAppointment(appointmentId);
        setAppointments(prev => prev.filter(a => a.id !== appointmentId));
    }, []);

    const createDoctor = useCallback(async (dto: CreateDoctorDto) => {
        const newDoctor = await adminApiRef.current.createDoctor(dto);
        setDoctors(prev => [...prev, newDoctor]);
    }, []);

    return (
        <AdminContext.Provider value={{
            users, doctors, appointments, patients,
            loading, error,
            deleteAppointment, createDoctor,
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