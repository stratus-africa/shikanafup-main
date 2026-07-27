-- Ensure the one-member-per-application rule is enforced by the database
CREATE UNIQUE INDEX IF NOT EXISTS members_application_id_uidx
  ON public.members (application_id)
  WHERE application_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.tg_members_unique_application()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
  _existing public.members;
BEGIN
  IF NEW.application_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT * INTO _existing
  FROM public.members
  WHERE application_id = NEW.application_id
    AND (TG_OP = 'INSERT' OR id <> NEW.id)
  LIMIT 1;

  IF _existing.id IS NOT NULL THEN
    RAISE EXCEPTION 'This application has already been approved (member %).',
      COALESCE(_existing.member_no, _existing.id::text)
      USING ERRCODE = 'unique_violation';
  END IF;

  RETURN NEW;
END $function$;

DROP TRIGGER IF EXISTS members_unique_application ON public.members;
CREATE TRIGGER members_unique_application
  BEFORE INSERT OR UPDATE OF application_id ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.tg_members_unique_application();