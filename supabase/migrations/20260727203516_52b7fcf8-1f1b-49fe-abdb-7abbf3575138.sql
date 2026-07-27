GRANT INSERT ON public.membership_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.membership_applications TO authenticated;
GRANT ALL ON public.membership_applications TO service_role;