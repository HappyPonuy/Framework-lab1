import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './index.ts';
import type { UsersPatientsInfoResponseDto } from '@contracts/users/patients/info.ts';
import type { UsersDoctorsGetResponseDto } from '@contracts/users/doctors/get.ts';
import type { UsersDoctorsInfoResponseDto } from '@contracts/users/doctors/info.ts';
import type { UsersPatientsGetResponseDto } from '@contracts/users/patients/get.ts';
import type { AppointmentsGetResponseDto } from '@contracts/appointments/get.ts';
import type { AppointmentsCreateRequestDto, AppointmentsCreateResponseDto } from '@contracts/appointments/create.ts';
import type { AppointmentsCancelRequestDto, AppointmentsCancelResponseDto } from '@contracts/appointments/cancel.ts';
import type { AppointmentsCompleteRequestDto, AppointmentsCompleteResponseDto } from '@contracts/appointments/complete.ts';
import type { UsersPatientsUpdateRequestDto, UsersPatientsUpdateResponseDto } from '@contracts/users/patients/update.ts';

export const medApi = createApi({
    reducerPath: 'medApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_URL as string,
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) headers.set('Authorization', `Bearer ${token}`);
            headers.set('Content-Type', 'application/json');
            headers.set('Accept', 'application/json');
            return headers;
        },
    }),
    keepUnusedDataFor: 300,
    tagTypes: ['PatientProfile', 'Doctors', 'Appointments', 'Patients', 'DoctorProfile'],
    endpoints: (builder) => ({
        getPatientProfile: builder.query<UsersPatientsInfoResponseDto, string>({
            query: (id) => ({ url: '/users/patients/info', params: { id } }),
            providesTags: ['PatientProfile'],
        }),

        getDoctors: builder.query<UsersDoctorsGetResponseDto, void>({
            query: () => '/users/doctors/get',
            providesTags: ['Doctors'],
        }),

        getAppointments: builder.query<AppointmentsGetResponseDto, void>({
            query: () => '/appointments/get',
            providesTags: ['Appointments'],
        }),

        createAppointment: builder.mutation<AppointmentsCreateResponseDto, AppointmentsCreateRequestDto>({
            query: (body) => ({ url: '/appointments/create', method: 'POST', body }),
            invalidatesTags: ['Appointments'],
        }),

        cancelAppointment: builder.mutation<AppointmentsCancelResponseDto, AppointmentsCancelRequestDto>({
            query: (body) => ({ url: '/appointments/cancel', method: 'POST', body }),
            invalidatesTags: ['Appointments'],
        }),

        updatePatientProfile: builder.mutation<UsersPatientsUpdateResponseDto, UsersPatientsUpdateRequestDto>({
            query: (body) => ({ url: '/users/patients/update', method: 'POST', body }),
            invalidatesTags: ['PatientProfile'],
        }),

        getDoctorProfile: builder.query<UsersDoctorsInfoResponseDto, string>({
            query: (id) => ({ url: '/users/doctors/info', params: { id } }),
            providesTags: ['DoctorProfile'],
        }),

        getAllPatients: builder.query<UsersPatientsGetResponseDto, void>({
            query: () => '/users/patients/get',
            providesTags: ['Patients'],
        }),

        completeAppointment: builder.mutation<AppointmentsCompleteResponseDto, AppointmentsCompleteRequestDto>({
            query: (body) => ({ url: '/appointments/complete', method: 'POST', body }),
            invalidatesTags: ['Appointments'],
        }),
    }),
});

export const {
    useGetPatientProfileQuery,
    useGetDoctorsQuery,
    useGetAppointmentsQuery,
    useCreateAppointmentMutation,
    useCancelAppointmentMutation,
    useUpdatePatientProfileMutation,
    useGetDoctorProfileQuery,
    useGetAllPatientsQuery,
    useCompleteAppointmentMutation,
} = medApi;
