-- === PROFILES ===
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_public" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- === CERTIFICATIONS ===
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certifications_select_public" ON public.certifications
  FOR SELECT USING (true);

-- Only authenticated users can insert custom certs, and only their own
CREATE POLICY "certifications_insert_custom" ON public.certifications
  FOR INSERT TO authenticated
  WITH CHECK (is_custom = true AND created_by = auth.uid());

-- Users can update/delete only their own custom certs
CREATE POLICY "certifications_update_own_custom" ON public.certifications
  FOR UPDATE TO authenticated
  USING (is_custom = true AND created_by = auth.uid());

CREATE POLICY "certifications_delete_own_custom" ON public.certifications
  FOR DELETE TO authenticated
  USING (is_custom = true AND created_by = auth.uid());

-- === USER CERTIFICATIONS ===
ALTER TABLE public.user_certifications ENABLE ROW LEVEL SECURITY;

-- Public profiles show user certs
CREATE POLICY "user_certifications_select_public" ON public.user_certifications
  FOR SELECT USING (true);

CREATE POLICY "user_certifications_insert_own" ON public.user_certifications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_certifications_update_own" ON public.user_certifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_certifications_delete_own" ON public.user_certifications
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- === EXAM PLANS (private) ===
ALTER TABLE public.exam_plans ENABLE ROW LEVEL SECURITY;

-- Calendar is private; only owner can do anything
CREATE POLICY "exam_plans_owner_only" ON public.exam_plans
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
