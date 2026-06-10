-- Profiles: created automatically when a user signs up
CREATE TABLE IF NOT EXISTS public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username    text UNIQUE NOT NULL,
  display_name text,
  avatar_url  text,
  bio         text,
  created_at  timestamptz DEFAULT now()
);

-- Certifications catalog (curated + custom)
CREATE TABLE IF NOT EXISTS public.certifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  vendor     text NOT NULL CHECK (vendor IN ('aws','azure','cisco','kubernetes','gcp','other')),
  code       text,
  slug       text UNIQUE NOT NULL,
  is_custom  bool NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- User certifications (have / seeking)
CREATE TABLE IF NOT EXISTS public.user_certifications (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id   uuid NOT NULL REFERENCES public.certifications(id) ON DELETE CASCADE,
  status             text NOT NULL CHECK (status IN ('have','seeking')),
  obtained_at        date,
  created_at         timestamptz DEFAULT now(),
  UNIQUE (user_id, certification_id)
);

-- Exam plans (calendar events)
CREATE TABLE IF NOT EXISTS public.exam_plans (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_id uuid NOT NULL REFERENCES public.certifications(id) ON DELETE CASCADE,
  title            text NOT NULL,
  scheduled_at     timestamptz NOT NULL,
  notes            text,
  status           text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','done','canceled')),
  reminder_sent    bool NOT NULL DEFAULT false,
  created_at       timestamptz DEFAULT now()
);

-- Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'user_name',
      SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(NEW.id::text, 1, 6)
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      SPLIT_PART(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
