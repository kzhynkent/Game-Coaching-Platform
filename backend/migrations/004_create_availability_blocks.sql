-- Migration 004: Create availability_blocks table
-- CHECK constraint enforces end_time > start_time at the DB level.
-- TIMESTAMPTZ ensures global timezone synchronization in UTC.

CREATE TABLE IF NOT EXISTS availability_blocks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time  TIMESTAMPTZ NOT NULL,
  end_time    TIMESTAMPTZ NOT NULL,
  is_booked   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT no_zero_length_slot CHECK (end_time > start_time)
);
