import { createContext, useContext } from 'react';
import type { RootStore } from './RootStore.ts';

export const StoreContext = createContext<RootStore | null>(null);

export function useRootStore(): RootStore {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error('useRootStore must be used within a StoreProvider');
    }
    return store;
}

export function useAuthStore() {
    return useRootStore().auth;
}

export function usePatientStore() {
    return useRootStore().patient;
}

export function useDoctorStore() {
    return useRootStore().doctor;
}

export function useAdminStore() {
    return useRootStore().admin;
}
