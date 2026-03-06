import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Patient, DoctorInfo, Appointment, CreateAppointmentDto, UpdatePatientDto, PatientContextType } from '../types/patient.types.ts';
import { createPatientApi } from '../api/patientApi.ts';
import { useApi } from '../hooks/useApi.ts';
import { useAuth } from './AuthContext.tsx';

const PatientContext = createContext<PatientContextType | null>(null);

export function PatientProvider({ children }: { children: React.ReactNode }) {
    const { api } = useApi();
    const { user } = useAuth();
    const patientApi = useMemo(() => createPatientApi(api), [api]);

    const [patient, setPatient]           = useState<Patient | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors]           = useState<DoctorInfo[]>([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);

    const load = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            const [profileData, doctorsData, appointmentsData] = await Promise.all([
                patientApi.fetchProfile(user.id),
                patientApi.fetchDoctors(),
                patientApi.fetchAppointments(),
            ]);
            setPatient(profileData);
            setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
            setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
        } catch (err: unknown) {
            const e = err as { message?: string };
            setError(e.message ?? 'Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    }, [patientApi, user]);

    useEffect(() => { if (user) load(); }, [load, user]);

    const bookAppointment = useCallback(async (dto: CreateAppointmentDto) => {
        const newAppointment = await patientApi.createAppointment(dto);
        setAppointments(prev =>
            prev.find(a => a.id === newAppointment.id) ? prev : [...prev, newAppointment]
        );
    }, [patientApi]);

    const cancelAppointment = useCallback(async (appointmentId: string) => {
        const result = await patientApi.cancelAppointment({ appointment_id: appointmentId });
        if (result) {
            setAppointments(prev => prev.map(a =>
                a.id === appointmentId ? { ...a, progress: 'Отменен' } : a
            ));
        }
    }, [patientApi]);

    const updateProfile = useCallback(async (dto: UpdatePatientDto) => {
        const updated = await patientApi.updateProfile(dto);
        setPatient(updated);
    }, [patientApi]);

    return (
        <PatientContext.Provider value={{
            patient, appointments, doctors,
            loading, error,
            bookAppointment, cancelAppointment, updateProfile,
            refresh: load,
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