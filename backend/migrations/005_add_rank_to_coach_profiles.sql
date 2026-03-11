-- Migration 005: Add rank column to coach_profiles
-- Required for Phase 3 Coach Profile UI. game_expertise (TEXT[]) and bio already exist.

ALTER TABLE coach_profiles
ADD COLUMN IF NOT EXISTS rank VARCHAR(100);
