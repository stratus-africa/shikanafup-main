# Admin Backend Plan

The admin UI pages already exist (members, aspirants, volunteers, jobs/applications, events, blogs, donations, merchandise, local-groups, admin-users, audit-trails, roles, settings). They currently use placeholder/mock data. This plan builds the backend that powers them.

## 1. Roles & access control

- `app_role` enum: `super_admin`, `admin`, `editor`, `moderator`, `member`
- `user_roles` table (`user_id`, `role`) — never store roles on profiles
- `has_role(_user_id, _role)` security-definer function
- `has_any_role(_user_id, _roles[])` helper
- All admin routes gated by `has_any_role(uid, ['super_admin','admin','editor','moderator'])` via `_authenticated/admin` `beforeLoad` check calling a `getMyAdminContext` server fn
- Public `profiles` table auto-created on signup via trigger

## 2. Domain tables (all in `public`, RLS on, GRANTs included)

```text
profiles(id=auth uid, full_name, phone, avatar_url, county, constituency, ward, id_number, dob, gender, created_at)
members(id, profile_id, member_no unique, status[pending|active|suspended|expired], tier, joined_at, expires_at)
local_groups(id, name unique, county, constituency, ward, leader_profile_id, description, created_at)
aspirants(id, profile_id, position_id, status[pending|approved|rejected|withdrawn], manifesto, motivation, reviewed_by, reviewed_at, notes)
political_positions(id, title, level[national|county|constituency|ward], description, is_active)
party_positions(id, title, description, is_active)            -- internal
volunteers(id, profile_id, skills[], availability, areas_of_interest, status[pending|approved|rejected], reviewed_by, reviewed_at, notes)
events(id, category_id, title, slug unique, description, location, starts_at, ends_at, cover_url, capacity, is_published)
event_categories(id, name unique, color)
event_registrations(id, event_id, profile_id, status, registered_at)
blogs(id, title, slug unique, excerpt, body, cover_url, author_id, status[draft|published], published_at, tags[])
publications(id, title, file_url, description, published_at)
jobs(id, title, slug unique, description, location, type, is_open, posted_by, closes_at, created_at)
job_applications(id, job_id, profile_id, cover_letter, cv_url, status[submitted|reviewing|shortlisted|rejected|hired], notes)
merchandise(id, name, slug unique, description, price_cents, currency, stock, images[], is_active)
donations(id, donor_name, donor_email, donor_phone, amount_cents, currency, method, reference, status[pending|completed|failed], notes, created_at)
contact_messages(id, name, email, subject, body, status[new|read|replied], created_at)
faqs(id, question, answer, category, sort_order, is_published)
audit_logs(id, actor_id, action, entity, entity_id, diff jsonb, created_at)
settings(key primary key, value jsonb, updated_by, updated_at)
```

## 3. RLS policy patterns

- Public read (published only): blogs/events/publications/faqs/merchandise/jobs/political_positions where `is_published`/`is_active`/`status='published'`
- Authenticated self-write: aspirants/volunteers/event_registrations/job_applications/donations insert where `profile_id = auth.uid()`; read own rows
- Admin/editor full write: gated via `has_any_role`
- `audit_logs`: insert via trigger only; read for admins
- `user_roles`: read self; write super_admin only

## 4. Server functions (`src/lib/admin/*.functions.ts`)

One file per domain. Each exports list/get/create/update/delete fns guarded by `requireSupabaseAuth` + role check, plus status transitions (approve/reject) for aspirants/volunteers/applications. Public-facing read fns (events, blogs, etc.) live in `src/lib/public/*.functions.ts`.

Audit trail middleware: every admin mutation writes to `audit_logs` with actor, action, entity, before/after diff.

## 5. Storage buckets

- `avatars` (public read, owner write)
- `blog-covers`, `event-covers`, `merch-images`, `publications`, `cv-uploads` (CV is private; admin read via signed URLs)

## 6. Wiring the existing admin pages

Replace mock data in each `_authenticated.admin.ui.*.tsx` route + its table/dialog components with TanStack Query calls to the new server fns (loader `ensureQueryData` + `useSuspenseQuery`, mutations via `useMutation` + invalidate).

Also wire matching public pages (events, blogs, publications, donate, listings, register, volunteer, careers, political-position, party-position, contact, faq) to public read fns.

## 7. Auth wiring

- Signup trigger creates `profiles` row; default role = `member`
- Admin user creation dialog calls a `createAdminUser` server fn (admin-only) that invites via Supabase Admin API and assigns role
- `/admin` `beforeLoad` redirects non-admins to `/`

## Open questions before I start

1. Roles list above OK, or do you want different titles?
2. Donations: integrate a payment provider (M-Pesa Daraja / Stripe / Paddle) now, or just record manual donations for now and add payments later?
3. Merchandise: same — full checkout now, or admin-managed catalogue with "request to buy" for now?
4. CV uploads for job applications — private bucket with admin-only signed URLs OK?

Once you confirm, I'll execute in this order: migration → server fns → wire admin pages → wire public pages.
