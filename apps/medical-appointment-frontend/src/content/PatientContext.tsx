import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Patient, DoctorInfo, Appointment, CreateAppointmentDto, UpdatePatientDto, PatientContextType } from '../types/patient.types.ts';
import { createPatientApi } from '../api/patientApi.ts';
import { useApi } from '../hooks/useApi.ts';

const PatientContext = createContext<PatientContextType | null>(null);

export function PatientProvider({ children }: { children: React.ReactNode }) {
    const { api } = useApi();
    const patientApi = useMemo(() => createPatientApi(api), [api]);

    const [patient, setPatient]           = useState<Patient | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors]           = useState<DoctorInfo[]>([]);
    const [loading, setLoading]           = useState(true);
    const [error, setError]               = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const [profileData, doctorsData, appointmentsData] = await Promise.all([
                patientApi.fetchProfile(),
                patientApi.fetchDoctors(),
                patientApi.fetchAppointments(),
            ]);
            setPatient(profileData);
            setDoctors(doctorsData);
            setAppointments(prev => {
                const existingIds = new Set(prev.map(a => a.id));
                const fresh = appointmentsData.filter(a => !existingIds.has(a.id));
                return prev.length === 0 ? appointmentsData : [...prev, ...fresh];
            });
        } catch (err: unknown) {
            const e = err as { message?: string };
            setError(e.message ?? 'Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const bookAppointment = async (dto: CreateAppointmentDto) => {
        const newAppointment = await patientApi.createAppointment(dto);
        setAppointments(prev =>
            prev.find(a => a.id === newAppointment.id) ? prev : [...prev, newAppointment]
        );
    };

    const cancelAppointment = async (appointmentId: string) => {
        await patientApi.cancelAppointment( { appointmentId } );
        setAppointments(prev => prev.filter(a => a.id !== appointmentId));
    };

    const updateProfile = async (dto: UpdatePatientDto) => {
        const updated = await patientApi.updateProfile(dto);
        setPatient(updated);
    };

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