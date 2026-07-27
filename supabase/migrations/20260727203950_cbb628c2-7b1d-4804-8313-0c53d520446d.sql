ALTER TABLE public.membership_applications
  ADD COLUMN IF NOT EXISTS rejection_reason text,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

CREATE OR REPLACE FUNCTION public.approve_membership_application(_application_id uuid)
RETURNS public.members
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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

  IF _app.status = 'rejected' THEN
    RAISE EXCEPTION 'This application was rejected and cannot be approved. Set it back to pending first.';
  END IF;

  SELECT * INTO _member FROM public.members WHERE application_id = _application_id;
  IF _member.id IS NOT NULL THEN
    RAISE EXCEPTION 'This application has already been approved (member %).', COALESCE(_member.member_no, _member.id::text);
  END IF;

  INSERT INTO public.members (application_id, status, tier, joined_at)
  VALUES (_application_id, 'active'::member_status, _app.membership_type, now())
  RETURNING * INTO _member;

  UPDATE public.membership_applications
    SET status = 'approved',
        rejection_reason = NULL,
        reviewed_by = auth.uid(),
        reviewed_at = now()
    WHERE id = _application_id;

  RETURN _member;
EXCEPTION WHEN unique_violation THEN
  RAISE EXCEPTION 'This application has already been approved.';
END $function$;

CREATE OR REPLACE FUNCTION public.reject_membership_application(_application_id uuid, _reason text DEFAULT NULL)
RETURNS public.membership_applications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _app public.membership_applications;
BEGIN
  IF NOT public.is_staff(auth.uid()) THEN
    RAISE EXCEPTION 'Forbidden: staff role required';
  END IF;

  SELECT * INTO _app FROM public.membership_applications WHERE id = _application_id;
  IF _app.id IS NULL THEN
    RAISE EXCEPTION 'Application not found';
  END IF;

  DELETE FROM public.members WHERE application_id = _application_id;

  UPDATE public.membership_applications
    SET status = 'rejected',
        rejection_reason = NULLIF(btrim(COALESCE(_reason, '')), ''),
        reviewed_by = auth.uid(),
        reviewed_at = now()
    WHERE id = _application_id
    RETURNING * INTO _app;

  RETURN _app;
END $function$;

GRANT EXECUTE ON FUNCTION public.reject_membership_application(uuid, text) TO authenticated;