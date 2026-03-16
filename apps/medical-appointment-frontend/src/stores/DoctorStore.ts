import { makeAutoObservable, runInAction, computed } from 'mobx';
import type { DoctorProfile, DoctorSchedule, DoctorAppointment, UpdateDoctorNotesDto } from '../types/doctor.types.ts';
import type { PatientInfo } from '@shared/types/data/patientinfo.ts';
import { createDoctorApi } from '../api/doctorApi.ts';
import type { AxiosInstance } from 'axios';

const CACHE_TTL = 5 * 60 * 1000;

export class DoctorStore {
    doctor: DoctorProfile | null = null;
    schedule: DoctorSchedule | null = null;
    appointments: DoctorAppointment[] = [];
    patients: PatientInfo[] = [];
    loading: boolean = false;
    error: string | null = null;

    private _lastFetched: number | null = null;
    private _api: ReturnType<typeof createDoctorApi> | null = null;
    private _userId: string | null = null;

    constructor() {
        makeAutoObservable(this, {
            todayAppointments: computed,
        });
    }

    setAxios(axiosInstance: AxiosInstance) {
        this._api = createDoctorApi(axiosInstance);
    }

    setUserId(id: string) {
        this._userId = id;
    }

    get isCacheValid(): boolean {
        if (!this._lastFetched) return false;
        return Date.now() - this._lastFetched < CACHE_TTL;
    }

    get todayAppointments(): DoctorAppointment[] {
        return this.appointments.filter(a => {
            const d = new Date(a.start_time);
            const now = new Date();
            return d.getFullYear() === now.getFullYear()
                && d.getMonth() === now.getMonth()
                && d.getDate() === now.getDate();
        });
    }

    async load(forceRefresh = false): Promise<void> {
        if (!this._api || !this._userId) { return; }
        if (!forceRefresh && this.isCacheValid) { return; }

        runInAction(() => {
            this.loading = true;
            this.error = null;
        });

        try {
            const [profileData, appointmentsData, patientsData] = await Promise.all([
                this._api.fetchProfile(this._userId),
                this._api.fetchAppointments(),
                this._api.fetchPatients(),
            ]);
            runInAction(() => {
                this.doctor = profileData;
                this.schedule = {
                    work_days: profileData.work_days,
                    shift_start: profileData.shift_start,
                    shift_end: profileData.shift_end,
                    slot_minutes: profileData.slot_minutes,
                };
                this.appointments = Array.isArray(appointmentsData) ? appointmentsData : [];
                this.patients = Array.isArray(patientsData) ? patientsData : [];
                this._lastFetched = Date.now();
            });
        } catch (err: unknown) {
            const e = err as { message?: string };
            runInAction(() => { this.error = e.message ?? 'Ошибка загрузки данных'; });
        } finally {
            runInAction(() => { this.loading = false; });
        }
    }

    async updateNotes(dto: UpdateDoctorNotesDto): Promise<void> {
        if (!this._api) return;
        const updatedAppt = await this._api.updateAppointmentNotes(dto);
        runInAction(() => {
            this.appointments = this.appointments.map(a =>
                a.id === dto.appointment_id ? updatedAppt : a
            );
            this._lastFetched = null;
        });
    }

    reset() {
        this.doctor = null;
        this.schedule = null;
        this.appointments = [];
        this.patients = [];
        this.loading = false;
        this.error = null;
        this._lastFetched = null;
        this._userId = null;
    }
}
