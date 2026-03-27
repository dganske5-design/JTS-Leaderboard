-- ================================================================
-- JTS SCOREBOARD — Supabase SQL Setup
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query
-- ================================================================

-- 1. REPS TABLE
CREATE TABLE IF NOT EXISTS reps (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. DAILY STATS TABLE
-- One row per rep per calendar date
CREATE TABLE IF NOT EXISTS daily_stats (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rep_id     UUID NOT NULL REFERENCES reps(id) ON DELETE CASCADE,
  stat_date  DATE NOT NULL,
  calls      INTEGER DEFAULT 0 NOT NULL,
  talk_mins  INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(rep_id, stat_date)
);

-- Index for fast date-range queries
CREATE INDEX IF NOT EXISTS idx_daily_stats_date   ON daily_stats(stat_date);
CREATE INDEX IF NOT EXISTS idx_daily_stats_rep_id ON daily_stats(rep_id);

-- 3. ROW LEVEL SECURITY
ALTER TABLE reps        ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

-- Allow public read (scoreboard is public-facing)
CREATE POLICY "Public read reps"
  ON reps FOR SELECT USING (true);

CREATE POLICY "Public read stats"
  ON daily_stats FOR SELECT USING (true);

-- Allow all writes (protected by API password check in Next.js, not at DB level)
CREATE POLICY "Service write reps"
  ON reps FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service write stats"
  ON daily_stats FOR ALL USING (true) WITH CHECK (true);

-- 4. SEED DATA — 3 starting reps
INSERT INTO reps (name) VALUES
  ('Grayson Grimes'),
  ('Mike Crawley'),
  ('Colton Hafey')
ON CONFLICT DO NOTHING;

-- ================================================================
-- Done! Your tables are ready.
-- Next: copy your Project URL + anon key into .env.local
-- ================================================================
