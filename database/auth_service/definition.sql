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