
-- 1. Make profile_id optional and add application_id link
ALTER TABLE public.members
  ALTER COLUMN profile_id DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS application_id uuid UNIQUE
    REFERENCES public.membership_applications(id) ON DELETE SET NULL;

-- 2. Sequence + generator for member_no
CREATE SEQUENCE IF NOT EXISTS public.members_member_no_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_member_no()
RETURNS text
LANGUAGE sql
AS $$
  SELECT 'SFUP-' || lpad(nextval('public.members_member_no_seq')::text, 6, '0')
$$;

-- 3. Trigger to auto-fill member_no on insert if not provided
CREATE OR REPLACE FUNCTION public.tg_members_set_member_no()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.member_no IS NULL OR NEW.member_no = '' THEN
    NEW.member_no := public.generate_member_no();
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS members_set_member_no ON public.members;
CREATE TRIGGER members_set_member_no
  BEFORE INSERT ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.tg_members_set_member_no();

-- 4. Approval function: creates a member row from an application (staff only)
CREATE OR REPLACE FUNCTION public.approve_membership_application(_application_id uuid)
RETURNS public.members
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _app public.membership_applications;
  _member public.members;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Forbidden: staff role required';
  END IF;

  SELECT * INTO _app FROM public.membership_applications WHERE id = _application_id;
  IF _app.id IS NULL THEN
    RAISE EXCEPTION 'Application not found';
  END IF;

  -- Reuse existing member if already linked
  SELECT * INTO _member FROM public.members WHERE application_id = _application_id;

  IF _member.id IS NULL THEN
    INSERT INTO public.members (application_id, status, tier, joined_at)
    VALUES (_application_id, 'active'::member_status, _app.membership_type, now())
    RETURNING * INTO _member;
  ELSE
    UPDATE public.members
      SET status = 'active'::member_status,
          joined_at = COALESCE(joined_at, now())
      WHERE id = _member.id
      RETURNING * INTO _member;
  END IF;

  UPDATE public.membership_applications
    SET status = 'approved'
    WHERE id = _application_id;

  RETURN _member;
END $$;

GRANT EXECUTE ON FUNCTION public.approve_membership_application(uuid) TO authenticated;
