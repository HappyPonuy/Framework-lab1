CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS appointments (
    id              UUID        PRIMARY KEY,
    patient_id      UUID        NOT NULL,
    doctor_id       UUID        NOT NULL,
    start_time      TIME        NOT NULL,
    patient_notes   TEXT,
    doctor_notes    TEXT,
    created_at      TIMESTAMP   DEFAULT NOW(),
    updated_at      TIMESTAMP   DEFAULT NOW(),
    UNIQUE (doctor_id, start_time)
);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);