import { AuthStore } from './AuthStore.ts';
import { PatientStore } from './PatientStore.ts';
import { DoctorStore } from './DoctorStore.ts';
import { AdminStore } from './AdminStore.ts';
import { http } from '../api/http.ts';

export class RootStore {
    auth: AuthStore;
    patient: PatientStore;
    doctor: DoctorStore;
    admin: AdminStore;

    constructor() {
        this.auth = new AuthStore();
        this.patient = new PatientStore();
        this.doctor = new DoctorStore();
        this.admin = new AdminStore();

        this.patient.setAxios(http);
        this.doctor.setAxios(http);
        this.admin.setAxios(http);
    }

    resetAll() {
        this.patient.reset();
        this.doctor.reset();
        this.admin.reset();
    }
}

export const rootStore = new RootStore();
