-- Add the missing Kubernetes / CNCF associate badges used by the Kubestronaut track.
INSERT INTO public.certifications (name, vendor, code, slug, is_custom) VALUES
  ('Kubernetes and Cloud Native Associate',          'kubernetes', 'KCNA', 'cncf-kcna', false),
  ('Kubernetes and Cloud Native Security Associate', 'kubernetes', 'KCSA', 'cncf-kcsa', false)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  vendor = EXCLUDED.vendor,
  code = EXCLUDED.code,
  is_custom = EXCLUDED.is_custom;
