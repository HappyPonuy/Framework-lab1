CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id          UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    username    TEXT            UNIQUE NOT NULL,
    passhash    VARCHAR(255)    NOT NULL,
    role_id     CHAR(1)         CHECK(role_id IN ('P', 'D', 'A'))
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
	id          UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id     UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	token_hash  TEXT            NOT NULL,
	created_at  TIMESTAMP       DEFAULT NOW(),
	expires_at  TIMESTAMP       NOT NULL,
	revoked     BOOLEAN         DEFAULT false,
    user_agent  TEXT,
    user_ip     INET
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);

CREATE TABLE IF NOT EXISTS patients (
    id          UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email       TEXT            UNIQUE NOT NULL,
    phone       VARCHAR(20)     UNIQUE,
    first_name  TEXT            NOT NULL,
    last_name   TEXT            NOT NULL,
    patronymic  TEXT,
    birth_date  DATE            NOT NULL,
    gender      CHAR(1)         CHECK(gender IN ('M', 'F')),
    created_at  TIMESTAMP       DEFAULT NOW(),
    updated_at  TIMESTAMP       DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctor_specialties (
    id              SERIAL  PRIMARY KEY,
    specialty_name  TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS doctors (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    specialty_id    INTEGER     NOT NULL REFERENCES doctor_specialties(id) ON DELETE SET NULL,
    first_name      TEXT        NOT NULL,
    last_name       TEXT        NOT NULL,
    patronymic      TEXT,
    notes           TEXT,
    is_active       BOOLEAN     DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS schedules (
    id           UUID       PRIMARY KEY,
    doctor_id    UUID       UNIQUE NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    work_days    INTEGER    NOT NULL,
    start_time   TIME       NOT NULL,
    end_time     TIME       NOT NULL,
    slot_minutes INTEGER    NOT NULL DEFAULT 30
);

CREATE TABLE IF NOT EXISTS appointments (
    id              UUID        PRIMARY KEY,
    patient_id      UUID        NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id       UUID        NOT NULL REFERENCES doctors(id) ON DELETE SET NULL,
    start_time      TIME        NOT NULL,
    patient_notes   TEXT,
    doctor_notes    TEXT,
    created_at      TIMESTAMP   DEFAULT NOW(),
    updated_at      TIMESTAMP   DEFAULT NOW(),
    UNIQUE (doctor_id, start_time)
);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);