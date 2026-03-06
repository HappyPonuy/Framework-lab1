import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { DoctorProfile, DoctorSchedule, DoctorAppointment, UpdateDoctorNotesDto, DoctorContextType } from '../types/doctor.types.ts';
import type { PatientInfo } from '@shared/types/data/patientinfo.ts';
import { createDoctorApi } from '../api/doctorApi.ts';
import { useApi } from '../hooks/useApi.ts';
import { useAuth } from './AuthContext.tsx';

const DoctorContext = createContext<DoctorContextType | null>(null);

export function DoctorProvider({ children }: { children: React.ReactNode }) {
    const { api } = useApi();
    const { user } = useAuth();
    const doctorApi = useMemo(() => createDoctorApi(api), [api]);
    const doctorApiRef = useRef(doctorApi);
    doctorApiRef.current = doctorApi;

    const [doctor, setDoctor]             = useState<DoctorProfile | null>(null);
    const [schedule, setSchedule]         = useState<DoctorSchedule | null>(null);
    const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
    const [patients, setPatients]         = useState<PatientInfo[]>([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const [profileData, appointmentsData, patientsData] = await Promise.all([
                doctorApiRef.current.fetchProfile(user.id),
                doctorApiRef.current.fetchAppointments(),
                doctorApiRef.current.fetchPatients(),
            ]);
            setDoctor(profileData);

            const scheduleData: DoctorSchedule = {
                work_days: profileData.work_days,
                shift_start: profileData.shift_start,
                shift_end: profileData.shift_end,
                slot_minutes: profileData.slot_minutes
            };
            setSchedule(scheduleData);

            setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
            setPatients(Array.isArray(patientsData) ? patientsData : []);
        } catch (err: unknown) {
            const e = err as { message?: string };
            setError(e.message ?? 'Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => { if (user) load(); }, [load, user]);

    const todayAppointments = appointments.filter(a => {
        const d = new Date(a.start_time);
        const now = new Date();
        return d.getFullYear() === now.getFullYear()
            && d.getMonth()    === now.getMonth()
            && d.getDate()     === now.getDate();
    });

    const updateNotes = useCallback(async (dto: UpdateDoctorNotesDto) => {
        const updatedAppt = await doctorApiRef.current.updateAppointmentNotes(dto);
        setAppointments(prev =>
            prev.map(a => a.id === dto.appointment_id ? updatedAppt : a)
        );
    }, []);

    return (
        <DoctorContext.Provider value={{
            doctor, schedule, appointments, todayAppointments, patients,
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