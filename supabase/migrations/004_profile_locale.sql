-- Add locale preference to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'pt-BR'
  CHECK (locale IN ('pt-BR', 'en'));

-- Backfill existing rows with the default
UPDATE profiles SET locale = 'pt-BR' WHERE locale IS NULL;
