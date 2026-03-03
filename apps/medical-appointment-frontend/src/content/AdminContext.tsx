import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AdminUser, AdminDoctor, AdminAppointment, AdminContextType, CreateDoctorDto } from '../types/admin.types.ts';
import type { DoctorSpecialty } from '../types/patient.types.ts';
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
    const [specialties, setSpecialties]   = useState<DoctorSpecialty[]>([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [usersData, doctorsData, appointmentsData, specialtiesData] = await Promise.all([
                adminApiRef.current.fetchAllUsers(),
                adminApiRef.current.fetchAllDoctors(),
                adminApiRef.current.fetchAllAppointments(),
                adminApiRef.current.fetchAllSpecialties(),
            ]);
            setUsers(usersData);
            setDoctors(doctorsData);
            setAppointments(appointmentsData);
            setSpecialties(specialtiesData);
        } catch (err: unknown) {
            const e = err as { message?: string };
            setError(e.message ?? 'Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const toggleDoctorActive = useCallback(async (doctorId: string, isActive: boolean) => {
        await adminApiRef.current.toggleDoctorActive(doctorId, isActive);
        setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, isActive } : d));
    }, []);

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
            users, doctors, appointments, specialties,
            loading, error,
            toggleDoctorActive, deleteAppointment, createDoctor,
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