CREATE TABLE public.party_position_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  position_id uuid NOT NULL REFERENCES public.party_positions(id) ON DELETE CASCADE,
  motivation text,
  experience text,
  status public.aspirant_status NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES public.profiles(id),
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.party_position_applications TO authenticated;
GRANT ALL ON public.party_position_applications TO service_role;

ALTER TABLE public.party_position_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own party position applications"
  ON public.party_position_applications FOR ALL TO authenticated
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Staff manage all party position applications"
  ON public.party_position_applications FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER party_position_applications_updated
  BEFORE UPDATE ON public.party_position_applications
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();