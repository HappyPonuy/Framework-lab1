import { createContext, useContext, useEffect, useState } from 'react';
import type { AdminUser, AdminDoctor, AdminAppointment, AdminContextType } from '../types/admin.types.ts';
import type { DoctorSpecialty } from '../types/patient.types.ts';
import {
    fetchAllUsers,
    fetchAllDoctors,
    fetchAllAppointments,
    fetchAllSpecialties,
    toggleDoctorActive as apiToggleDoctorActive,
    deleteAppointment as apiDeleteAppointment,
} from '../api/adminApi.ts';
const AdminContext = createContext<AdminContextType | null>(null);
export function AdminProvider({ children }: { children: React.ReactNode }) {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
    const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
    const [specialties, setSpecialties] = useState<DoctorSpecialty[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const [usersData, doctorsData, appointmentsData, specialtiesData] = await Promise.all([
                fetchAllUsers(),
                fetchAllDoctors(),
                fetchAllAppointments(),
                fetchAllSpecialties(),
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
    };
    useEffect(() => { load(); }, []);
    const toggleDoctorActive = async (doctorId: string, isActive: boolean) => {
        await apiToggleDoctorActive(doctorId, isActive);
        setDoctors(prev =>
            prev.map(d => d.id === doctorId ? { ...d, isActive } : d)
        );
    };
    const deleteAppointment = async (appointmentId: string) => {
        await apiDeleteAppointment(appointmentId);
        setAppointments(prev => prev.filter(a => a.id !== appointmentId));
    };
    return (
        <AdminContext.Provider value={{
            users, doctors, appointments, specialties,
            loading, error,
            toggleDoctorActive, deleteAppointment,
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