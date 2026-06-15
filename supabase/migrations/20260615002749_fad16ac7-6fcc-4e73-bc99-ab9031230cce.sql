REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_any_role(uuid, public.app_role[]) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM anon;