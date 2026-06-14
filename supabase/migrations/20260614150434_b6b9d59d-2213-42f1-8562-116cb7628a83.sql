
-- =========================================================
-- ROLES
-- =========================================================
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('super_admin','admin','editor','moderator','member');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid, _roles public.app_role[])
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = ANY(_roles))
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_any_role(_user_id, ARRAY['super_admin','admin','editor','moderator']::public.app_role[])
$$;

CREATE POLICY "self read roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "super admin manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'super_admin'));

-- =========================================================
-- updated_at helper
-- =========================================================
CREATE OR REPLACE FUNCTION public.tg_set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- =========================================================
-- PROFILES + signup trigger
-- =========================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  county text,
  constituency text,
  ward text,
  id_number text,
  dob date,
  gender text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles read all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles self update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles staff manage" ON public.profiles FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'member') ON CONFLICT DO NOTHING;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- LOCAL GROUPS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.local_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  county text,
  constituency text,
  ward text,
  leader_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.local_groups TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.local_groups TO authenticated;
GRANT ALL ON public.local_groups TO service_role;
ALTER TABLE public.local_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "local_groups public read" ON public.local_groups FOR SELECT USING (true);
CREATE POLICY "local_groups staff manage" ON public.local_groups FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER local_groups_updated BEFORE UPDATE ON public.local_groups FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- MEMBERS
-- =========================================================
DO $$ BEGIN CREATE TYPE public.member_status AS ENUM ('pending','active','suspended','expired'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_no text UNIQUE,
  status public.member_status NOT NULL DEFAULT 'pending',
  tier text,
  local_group_id uuid REFERENCES public.local_groups(id) ON DELETE SET NULL,
  joined_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.members TO authenticated;
GRANT ALL ON public.members TO service_role;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read own" ON public.members FOR SELECT TO authenticated USING (profile_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "members self apply" ON public.members FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());
CREATE POLICY "members staff manage" ON public.members FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['super_admin','admin']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin','admin']::public.app_role[]));
CREATE TRIGGER members_updated BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- POLITICAL / PARTY POSITIONS
-- =========================================================
DO $$ BEGIN CREATE TYPE public.position_level AS ENUM ('national','county','constituency','ward'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.political_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  level public.position_level NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.political_positions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.political_positions TO authenticated;
GRANT ALL ON public.political_positions TO service_role;
ALTER TABLE public.political_positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pol_pos public read" ON public.political_positions FOR SELECT USING (is_active OR public.is_staff(auth.uid()));
CREATE POLICY "pol_pos staff manage" ON public.political_positions FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER pol_pos_updated BEFORE UPDATE ON public.political_positions FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE IF NOT EXISTS public.party_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.party_positions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.party_positions TO authenticated;
GRANT ALL ON public.party_positions TO service_role;
ALTER TABLE public.party_positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "party_pos auth read" ON public.party_positions FOR SELECT TO authenticated USING (is_active OR public.is_staff(auth.uid()));
CREATE POLICY "party_pos staff manage" ON public.party_positions FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER party_pos_updated BEFORE UPDATE ON public.party_positions FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- ASPIRANTS
-- =========================================================
DO $$ BEGIN CREATE TYPE public.aspirant_status AS ENUM ('pending','approved','rejected','withdrawn'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.aspirants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  position_id uuid NOT NULL REFERENCES public.political_positions(id) ON DELETE RESTRICT,
  manifesto text,
  motivation text,
  status public.aspirant_status NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.aspirants TO authenticated;
GRANT ALL ON public.aspirants TO service_role;
ALTER TABLE public.aspirants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "aspirants read own" ON public.aspirants FOR SELECT TO authenticated USING (profile_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "aspirants self apply" ON public.aspirants FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());
CREATE POLICY "aspirants self withdraw" ON public.aspirants FOR UPDATE TO authenticated USING (profile_id = auth.uid() AND status = 'pending') WITH CHECK (profile_id = auth.uid());
CREATE POLICY "aspirants staff manage" ON public.aspirants FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER aspirants_updated BEFORE UPDATE ON public.aspirants FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- VOLUNTEERS
-- =========================================================
DO $$ BEGIN CREATE TYPE public.volunteer_status AS ENUM ('pending','approved','rejected'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.volunteers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skills text[] NOT NULL DEFAULT '{}',
  availability text,
  areas_of_interest text[] NOT NULL DEFAULT '{}',
  status public.volunteer_status NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.volunteers TO authenticated;
GRANT ALL ON public.volunteers TO service_role;
ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "volunteers read own" ON public.volunteers FOR SELECT TO authenticated USING (profile_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "volunteers self apply" ON public.volunteers FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());
CREATE POLICY "volunteers staff manage" ON public.volunteers FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER volunteers_updated BEFORE UPDATE ON public.volunteers FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- EVENTS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.event_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  color text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.event_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_categories TO authenticated;
GRANT ALL ON public.event_categories TO service_role;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event_cats public read" ON public.event_categories FOR SELECT USING (true);
CREATE POLICY "event_cats staff manage" ON public.event_categories FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.event_categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  location text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  cover_url text,
  capacity int,
  is_published boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "events public read" ON public.events FOR SELECT USING (is_published OR public.is_staff(auth.uid()));
CREATE POLICY "events staff manage" ON public.events FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'registered',
  registered_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, profile_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_registrations TO authenticated;
GRANT ALL ON public.event_registrations TO service_role;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event_reg read own" ON public.event_registrations FOR SELECT TO authenticated USING (profile_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "event_reg self register" ON public.event_registrations FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());
CREATE POLICY "event_reg self cancel" ON public.event_registrations FOR DELETE TO authenticated USING (profile_id = auth.uid());
CREATE POLICY "event_reg staff manage" ON public.event_registrations FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- BLOGS
-- =========================================================
DO $$ BEGIN CREATE TYPE public.blog_status AS ENUM ('draft','published','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  body text,
  cover_url text,
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  status public.blog_status NOT NULL DEFAULT 'draft',
  tags text[] NOT NULL DEFAULT '{}',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blogs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blogs TO authenticated;
GRANT ALL ON public.blogs TO service_role;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "blogs public read" ON public.blogs FOR SELECT USING (status = 'published' OR public.is_staff(auth.uid()));
CREATE POLICY "blogs staff manage" ON public.blogs FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER blogs_updated BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- PUBLICATIONS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  cover_url text,
  published_at timestamptz NOT NULL DEFAULT now(),
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.publications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.publications TO authenticated;
GRANT ALL ON public.publications TO service_role;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "publications public read" ON public.publications FOR SELECT USING (is_published OR public.is_staff(auth.uid()));
CREATE POLICY "publications staff manage" ON public.publications FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER publications_updated BEFORE UPDATE ON public.publications FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- JOBS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  location text,
  type text,
  is_open boolean NOT NULL DEFAULT true,
  posted_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  closes_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.jobs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jobs public read" ON public.jobs FOR SELECT USING (is_open OR public.is_staff(auth.uid()));
CREATE POLICY "jobs staff manage" ON public.jobs FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER jobs_updated BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

DO $$ BEGIN CREATE TYPE public.application_status AS ENUM ('submitted','reviewing','shortlisted','rejected','hired'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_letter text,
  cv_url text,
  status public.application_status NOT NULL DEFAULT 'submitted',
  reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, profile_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "applications read own" ON public.job_applications FOR SELECT TO authenticated USING (profile_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "applications self apply" ON public.job_applications FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());
CREATE POLICY "applications staff manage" ON public.job_applications FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER applications_updated BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- MERCHANDISE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.merchandise (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price_cents int NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'KES',
  stock int NOT NULL DEFAULT 0,
  images text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.merchandise TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.merchandise TO authenticated;
GRANT ALL ON public.merchandise TO service_role;
ALTER TABLE public.merchandise ENABLE ROW LEVEL SECURITY;
CREATE POLICY "merch public read" ON public.merchandise FOR SELECT USING (is_active OR public.is_staff(auth.uid()));
CREATE POLICY "merch staff manage" ON public.merchandise FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER merch_updated BEFORE UPDATE ON public.merchandise FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- DONATIONS
-- =========================================================
DO $$ BEGIN CREATE TYPE public.donation_status AS ENUM ('pending','completed','failed','refunded'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_profile_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  donor_name text,
  donor_email text,
  donor_phone text,
  amount_cents int NOT NULL,
  currency text NOT NULL DEFAULT 'KES',
  method text,
  reference text,
  status public.donation_status NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.donations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.donations TO authenticated;
GRANT ALL ON public.donations TO service_role;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "donations public donate" ON public.donations FOR INSERT WITH CHECK (status = 'pending');
CREATE POLICY "donations read own" ON public.donations FOR SELECT TO authenticated USING (donor_profile_id = auth.uid() OR public.has_any_role(auth.uid(), ARRAY['super_admin','admin']::public.app_role[]));
CREATE POLICY "donations admin manage" ON public.donations FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['super_admin','admin']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin','admin']::public.app_role[]));
CREATE TRIGGER donations_updated BEFORE UPDATE ON public.donations FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- CONTACT MESSAGES
-- =========================================================
DO $$ BEGIN CREATE TYPE public.message_status AS ENUM ('new','read','replied','archived'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  body text NOT NULL,
  status public.message_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact public send" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "contact staff manage" ON public.contact_messages FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER contact_updated BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- FAQs
-- =========================================================
CREATE TABLE IF NOT EXISTS public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "faqs public read" ON public.faqs FOR SELECT USING (is_published OR public.is_staff(auth.uid()));
CREATE POLICY "faqs staff manage" ON public.faqs FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER faqs_updated BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- =========================================================
-- AUDIT LOGS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  diff jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "audit staff read" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "audit staff insert" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid() AND public.is_staff(auth.uid()));

-- =========================================================
-- SETTINGS
-- =========================================================
CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.settings FOR SELECT USING (true);
CREATE POLICY "settings admin manage" ON public.settings FOR ALL TO authenticated USING (public.has_any_role(auth.uid(), ARRAY['super_admin','admin']::public.app_role[])) WITH CHECK (public.has_any_role(auth.uid(), ARRAY['super_admin','admin']::public.app_role[]));
CREATE TRIGGER settings_updated BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
