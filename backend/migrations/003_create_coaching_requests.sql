-- Migration 003: Create coaching_requests table (The Bounty Board)
-- request_status ENUM prevents invalid status strings at the DB level.
-- Contact fields (discord_tag, social_links, exact_username) are stored in DB
-- but ALWAYS returned as null by the API unless the coach has 'pro' subscription.

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
    CREATE TYPE request_status AS ENUM ('open', 'filled', 'cancelled');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS coaching_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Public fields (visible to all)
  game_title      VARCHAR(100) NOT NULL,
  target_rank     VARCHAR(100) NOT NULL,
  goal            VARCHAR(255) NOT NULL,
  budget          NUMERIC(10, 2) NOT NULL CHECK (budget >= 0),
  description     TEXT,

  -- Contact fields: stored in DB, always masked to null by API for non-pro coaches
  discord_tag     VARCHAR(255),
  social_links    TEXT,
  exact_username  VARCHAR(255),

  status          request_status NOT NULL DEFAULT 'open',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
