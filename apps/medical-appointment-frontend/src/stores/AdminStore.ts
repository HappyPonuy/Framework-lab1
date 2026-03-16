import { makeAutoObservable, runInAction } from 'mobx';
import type { AdminDoctor, AdminAppointment, AdminPatient } from '../types/admin.types.ts';
import { createAdminApi } from '../api/adminApi.ts';
import type { AxiosInstance } from 'axios';

const CACHE_TTL = 5 * 60 * 1000;

export class AdminStore {
    doctors: AdminDoctor[] = [];
    appointments: AdminAppointment[] = [];
    patients: AdminPatient[] = [];
    loading: boolean = false;
    error: string | null = null;

    private _lastFetched: number | null = null;
    private _api: ReturnType<typeof createAdminApi> | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setAxios(axiosInstance: AxiosInstance) {
        this._api = createAdminApi(axiosInstance);
    }

    get isCacheValid(): boolean {
        if (!this._lastFetched) return false;
        return Date.now() - this._lastFetched < CACHE_TTL;
    }

    get activeDoctorsCount(): number {
        return this.doctors.filter(d => d.is_active).length;
    }

    get cancelledAppointmentsCount(): number {
        return this.appointments.filter(a => a.progress === 'Отменен').length;
    }

    async load(forceRefresh = false): Promise<void> {
        if (!this._api) { return; }
        if (!forceRefresh && this.isCacheValid) { return; }

        runInAction(() => {
            this.loading = true;
            this.error = null;
        });

        try {
            const [doctorsData, appointmentsData, patientsData] = await Promise.all([
                this._api.fetchAllDoctors(),
                this._api.fetchAllAppointments(),
                this._api.fetchAllPatients(),
            ]);
            runInAction(() => {
                this.doctors = Array.isArray(doctorsData) ? doctorsData : [];
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

    async deleteAppointment(appointmentId: string): Promise<void> {
        if (!this._api) return;
        const result = await this._api.deleteAppointment(appointmentId);
        if (result) {
            runInAction(() => {
                this.appointments = this.appointments.filter(a => a.id !== appointmentId);
                this._lastFetched = null;
            });
        }
    }

    reset() {
        this.doctors = [];
        this.appointments = [];
        this.patients = [];
        this.loading = false;
        this.error = null;
        this._lastFetched = null;
    }
}
