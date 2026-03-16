import { makeAutoObservable, runInAction } from 'mobx';
import type { Patient, DoctorInfo, Appointment, CreateAppointmentDto, UpdatePatientDto } from '../types/patient.types.ts';
import { createPatientApi } from '../api/patientApi.ts';
import type { AxiosInstance } from 'axios';

const CACHE_TTL = 5 * 60 * 1000;

export class PatientStore {
    patient: Patient | null = null;
    appointments: Appointment[] = [];
    doctors: DoctorInfo[] = [];
    loading: boolean = false;
    doctorsLoading: boolean = false;
    error: string | null = null;

    private _lastFetched: number | null = null;
    private _doctorsLastFetched: number | null = null;
    private _api: ReturnType<typeof createPatientApi> | null = null;
    private _userId: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    setAxios(axiosInstance: AxiosInstance) {
        this._api = createPatientApi(axiosInstance);
    }

    setUserId(id: string) {
        this._userId = id;
    }

    get isCacheValid(): boolean {
        if (!this._lastFetched) return false;
        return Date.now() - this._lastFetched < CACHE_TTL;
    }

    get isDoctorsCacheValid(): boolean {
        if (!this._doctorsLastFetched) return false;
        return Date.now() - this._doctorsLastFetched < CACHE_TTL;
    }

    get activeAppointmentsCount(): number {
        return this.appointments.filter(a => a.progress === 'Назначен').length;
    }

    get activeDoctorsCount(): number {
        return this.doctors.filter(d => d.is_active).length;
    }

    get appointmentsWithNotesCount(): number {
        return this.appointments.filter(a => a.doctor_notes).length;
    }

    async load(forceRefresh = false): Promise<void> {
        if (!this._api || !this._userId) { return; }
        if (!forceRefresh && this.isCacheValid) { return; }

        runInAction(() => {
            this.loading = true;
            this.error = null;
        });

        try {
            const [profileData, appointmentsData] = await Promise.all([
                this._api.fetchProfile(this._userId),
                this._api.fetchAppointments(),
            ]);
            runInAction(() => {
                this.patient = profileData;
                this.appointments = Array.isArray(appointmentsData) ? appointmentsData : [];
                this._lastFetched = Date.now();
            });
        } catch (err: unknown) {
            const e = err as { message?: string };
            runInAction(() => { this.error = e.message ?? 'Ошибка загрузки данных'; });
        } finally {
            runInAction(() => { this.loading = false; });
        }
    }

    async loadDoctors(forceRefresh = false): Promise<void> {
        if (!this._api) { return; }
        if (!forceRefresh && this.isDoctorsCacheValid) { return; }

        runInAction(() => { this.doctorsLoading = true; });

        try {
            const doctorsData = await this._api.fetchDoctors();
            runInAction(() => {
                this.doctors = Array.isArray(doctorsData) ? doctorsData : [];
                this._doctorsLastFetched = Date.now();
            });
        } catch (err: unknown) {
            const e = err as { message?: string };
            runInAction(() => { this.error = e.message ?? 'Ошибка загрузки врачей'; });
        } finally {
            runInAction(() => { this.doctorsLoading = false; });
        }
    }

    async bookAppointment(dto: CreateAppointmentDto): Promise<void> {
        if (!this._api) return;
        const newAppointment = await this._api.createAppointment(dto);
        runInAction(() => {
            if (!this.appointments.find(a => a.id === newAppointment.id)) {
                this.appointments = [...this.appointments, newAppointment];
            }
            this._lastFetched = null;
        });
    }

    async cancelAppointment(appointmentId: string): Promise<void> {
        if (!this._api) return;
        const result = await this._api.cancelAppointment({ appointment_id: appointmentId });
        if (result) {
            runInAction(() => {
                this.appointments = this.appointments.map(a =>
                    a.id === appointmentId ? { ...a, progress: 'Отменен' } : a
                );
                this._lastFetched = null;
            });
        }
    }

    async updateProfile(dto: UpdatePatientDto): Promise<void> {
        if (!this._api) return;
        const updated = await this._api.updateProfile(dto);
        runInAction(() => {
            this.patient = updated;
            this._lastFetched = null;
        });
    }

    reset() {
        this.patient = null;
        this.appointments = [];
        this.doctors = [];
        this.loading = false;
        this.doctorsLoading = false;
        this.error = null;
        this._lastFetched = null;
        this._doctorsLastFetched = null;
        this._userId = null;
    }
}
