import { env } from "@config/env";
import { Database } from "@modules/database";

const AppointmentsDatabase = new Database(
    `postgresql://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/mas_appointments`
);

export default AppointmentsDatabase;