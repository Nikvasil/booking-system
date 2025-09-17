CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    capacity INTEGER NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    room_id INTEGER NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_range TSTZRANGE NOT NULL,

    CONSTRAINT no_overlapping_bookings
    EXCLUDE USING GIST (room_id WITH =, booking_range WITH &&)
);

CREATE INDEX bookings_range_idx ON bookings USING GIST (booking_range);

INSERT INTO rooms (name, capacity) VALUES ('Conference Room A', 10);
INSERT INTO rooms (name, capacity) VALUES ('Focus Booth B', 4);
INSERT INTO rooms (name, capacity) VALUES ('Project Room C', 12);

GRANT ALL ON rooms, users, bookings TO myuser;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO myuser;