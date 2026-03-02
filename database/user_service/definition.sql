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

CREATE TABLE IF NOT EXISTS doctors (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID        NOT NULL,
    specialty       TEXT        NOT NULL,
    first_name      TEXT        NOT NULL,
    last_name       TEXT        NOT NULL,
    patronymic      TEXT,
    notes           TEXT,
    is_active       BOOLEAN     DEFAULT FALSE,
    work_days       INTEGER     NOT NULL,
    shift_start     TIME        NOT NULL,
    shift_end       TIME        NOT NULL,
    slot_minutes    INTEGER     NOT NULL DEFAULT 30
);