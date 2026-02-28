CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS patients (
    id          UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID            NOT NULL,
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
    user_id         UUID        NOT NULL,
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