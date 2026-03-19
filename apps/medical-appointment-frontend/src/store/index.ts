import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.ts';
import { medApi } from './api.ts';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [medApi.reducerPath]: medApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(medApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
