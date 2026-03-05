export type UsersDoctorsGetScheduleResponseDto = {
    id: string;
    doctor_id: string;
    work_days: number;
    start_time: string;
    end_time: string;
    slot_minutes: number;
};