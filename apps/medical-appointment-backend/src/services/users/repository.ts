import { Database } from "@modules/database";
import type { PatientInfo } from "@shared/types/data/patientinfo.js";
import type { DoctorInfo } from "@shared/types/data/doctorinfo.js";
import type { VolatilePatientInfo } from "@custom_types/volatilepatientinfo";

export default class UsersRepository {
    constructor(private db: Database) {}

    async getAllPatients(): Promise<PatientInfo[]> {
        try {
            const patientsQueryResult = await this.db.query(
                "SELECT * FROM users"
            );
            return patientsQueryResult.rows as PatientInfo[];
        } catch (err) {
            if (err instanceof Error) {
                console.log(err);
            }
            return [];
        }
    }

    async getAllDoctors(): Promise<DoctorInfo[]> {
        try {
            const doctorsQueryResult = await this.db.query(
                "SELECT * FROM doctors"
            );
            return doctorsQueryResult.rows as DoctorInfo[];
        } catch (err) {
            if (err instanceof Error) {
                console.log(err);
            }
            return [];
        }
    }

    async getPatientById(patientId: string): Promise<PatientInfo | null> {
        try {
            const patientQueryResult = await this.db.query(
                "SELECT * FROM users WHERE id = $1",
                [patientId]
            );
            return patientQueryResult.rows[0] as PatientInfo;
        } catch (err) {
            if (err instanceof Error) {
                console.log(err);
            }
            return null;
        }
    }

    async getDoctorById(doctorId: string): Promise<DoctorInfo | null> {
        try {
            const doctorQueryResult = await this.db.query(
                "SELECT * FROM doctors WHERE id = $1",
                [doctorId]
            );
            return doctorQueryResult.rows[0] as DoctorInfo;
        } catch (err) {
            if (err instanceof Error) {
                console.log(err);
            }
            return null;
        }
    }

    async updatePatient(patientId: string, patientData: VolatilePatientInfo): Promise<PatientInfo | null> {
        try {
            const updatePatientQueryResult = await this.db.query(
                `WITH updated AS (
                    UPDATE patients 
                    SET 
                        email = $1, 
                        phone = $2, 
                        first_name = $3,
                        last_name = $4,
                        patronymic = $5,
                        birth_date = $6,
                        gender = $7,
                        updated_at = NOW()
                    WHERE id = $8
                )
                SELECT * 
                FROM patients 
                WHERE id = $8
                `,
                [
                    patientData.email,
                    patientData.phone,
                    patientData.first_name,
                    patientData.last_name,
                    patientData.patronymic,
                    patientData.birth_date,
                    patientData.gender,
                    patientId
                ]
            );
            return updatePatientQueryResult.rows[0] as PatientInfo;
        } catch (err) {
            if (err instanceof Error) {
                console.log(err);
            }
            return null;
        }
    }
}