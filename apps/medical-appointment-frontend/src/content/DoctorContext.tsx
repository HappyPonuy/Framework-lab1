import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { DoctorProfile, DoctorSchedule, DoctorAppointment, UpdateDoctorNotesDto, DoctorContextType } from '../types/doctor.types.ts';
import {
    fetchDoctorProfile,
    fetchDoctorSchedule,
    fetchDoctorAppointments,
    updateAppointmentNotes as apiUpdateNotes,
} from '../api/doctorApi.ts';
const DoctorContext = createContext<DoctorContextType | null>(null);
export function DoctorProvider({ children }: { children: React.ReactNode }) {
    const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
    const [schedule, setSchedule] = useState<DoctorSchedule | null>(null);
    const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const [profileData, scheduleData, appointmentsData] = await Promise.all([
                fetchDoctorProfile(),
                fetchDoctorSchedule(),
                fetchDoctorAppointments(),
            ]);
            setDoctor(profileData);
            setSchedule(scheduleData);
            setAppointments(appointmentsData);
        } catch (err: unknown) {
            const e = err as { message?: string };
            setError(e.message ?? 'Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { load(); }, []);
    const todayAppointments = useMemo(() => {
        const today = new Date().toISOString().slice(0, 10);
        return appointments.filter(a => a.startTime.startsWith(today));
    }, [appointments]);
    const updateNotes = async (dto: UpdateDoctorNotesDto) => {
        await apiUpdateNotes(dto);
        setAppointments(prev =>
            prev.map(a => a.id === dto.appointmentId ? { ...a, doctorNotes: dto.doctorNotes } : a)
        );
    };
    return (
        <DoctorContext.Provider value={{
            doctor, schedule, appointments, todayAppointments,
            loading, error,
            updateNotes,
            refresh: load,
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