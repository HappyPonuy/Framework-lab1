import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { DoctorProfile, DoctorSchedule, DoctorAppointment, UpdateDoctorNotesDto, DoctorContextType } from '../types/doctor.types.ts';
import { createDoctorApi } from '../api/doctorApi.ts';
import { useApi } from '../hooks/useApi.ts';

const DoctorContext = createContext<DoctorContextType | null>(null);

export function DoctorProvider({ children }: { children: React.ReactNode }) {
    const { api } = useApi();
    const doctorApi = useMemo(() => createDoctorApi(api), [api]);
    const doctorApiRef = useRef(doctorApi);
    doctorApiRef.current = doctorApi;

    const [doctor, setDoctor]             = useState<DoctorProfile | null>(null);
    const [schedule, setSchedule]         = useState<DoctorSchedule | null>(null);
    const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [profileData, scheduleData, appointmentsData] = await Promise.all([
                doctorApiRef.current.fetchProfile(),
                doctorApiRef.current.fetchSchedule(),
                doctorApiRef.current.fetchAppointments(),
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
    }, []);

    useEffect(() => { load(); }, [load]);

    const todayAppointments = appointments;

    const updateNotes = useCallback(async (dto: UpdateDoctorNotesDto) => {
        await doctorApiRef.current.updateAppointmentNotes(dto);
        setAppointments(prev =>
            prev.map(a => a.id === dto.appointment_id ? { ...a, doctor_notes: dto.doctor_notes } : a)
        );
    }, []);

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