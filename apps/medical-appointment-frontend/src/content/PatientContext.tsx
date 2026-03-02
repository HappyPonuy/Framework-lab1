import { createContext, useContext, useEffect, useState } from 'react';
import type { Patient, DoctorInfo, Appointment, CreateAppointmentDto, PatientContextType } from '../types/patient.types.ts';
import {
    fetchPatientProfile,
    fetchPatientDoctors,
    fetchPatientAppointments,
    createAppointment as apiCreateAppointment,
    cancelAppointment as apiCancelAppointment,
} from '../api/patientApi.ts';
const PatientContext = createContext<PatientContextType | null>(null);
export function PatientProvider({ children }: { children: React.ReactNode }) {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<DoctorInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const [profileData, doctorsData, appointmentsData] = await Promise.all([
                fetchPatientProfile(),
                fetchPatientDoctors(),
                fetchPatientAppointments(),
            ]);
            setPatient(profileData);
            setDoctors(doctorsData);
            setAppointments(appointmentsData);
        } catch (err: unknown) {
            const e = err as { message?: string };
            setError(e.message ?? 'Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => { load(); }, []);
    const bookAppointment = async (dto: CreateAppointmentDto) => {
        const newAppointment = await apiCreateAppointment(dto);
        setAppointments(prev => [...prev, newAppointment]);
    };
    const cancelAppointment = async (appointmentId: string) => {
        await apiCancelAppointment(appointmentId);
        setAppointments(prev =>
            prev.map(a => a.id === appointmentId ? { ...a, status: 'cancelled' as const } : a)
        );
    };
    return (
        <PatientContext.Provider value={{
            patient, appointments, doctors,
            loading, error,
            bookAppointment, cancelAppointment,
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