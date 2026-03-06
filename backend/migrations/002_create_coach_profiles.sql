-- Migration 002: Create coach_profiles table
-- subscription_status ENUM locks/unlocks Bounty Board data paywall.

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    CREATE TYPE subscription_status AS ENUM ('free', 'pro');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS coach_profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio                 TEXT,
  game_expertise      TEXT[],
  stripe_customer_id  VARCHAR(255),
  subscription_status subscription_status NOT NULL DEFAULT 'free',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
