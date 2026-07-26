
CREATE TABLE public.membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  dob date,
  gender text,
  id_no text,
  doc_type text,
  county text,
  constituency text,
  ward text,
  religion text,
  ethnicity text,
  postal_address text,
  postal_code text,
  is_pwd text,
  ncpwd_number text,
  polling_station text,
  street_village text,
  membership_type text,
  special_interest text[],
  local_leader text,
  payment_method text,
  payment_phone text,
  amount numeric,
  status text NOT NULL DEFAULT 'pending',
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.membership_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.membership_applications TO authenticated;
GRANT ALL ON public.membership_applications TO service_role;

ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can apply" ON public.membership_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(coalesce(first_name,'')) between 1 and 200
    AND length(coalesce(last_name,'')) between 1 and 200
    AND length(coalesce(email,'')) between 3 and 320
    AND length(coalesce(phone,'')) between 6 and 40
    AND status = 'pending'
  );

CREATE POLICY "staff manage applications" ON public.membership_applications
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER membership_applications_updated
  BEFORE UPDATE ON public.membership_applications
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
