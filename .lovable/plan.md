## Scope

The uploaded `shikana-main.zip` is a Next.js 16 / React 19 app with:
- **~70 page files** across public site (`shared-ui/*`), auth (`login`, `otp`, `forgot-password`), and admin panel (`admin/ui/*` — users, admin-users, aspirants, audit-trails, blogs, donations, events, jobs, members, merchandise, local-groups, roles, settings, volunteer)
- **~150 components** (shadcn/ui, motion primitives, hero sections, forms, tables, dialogs)
- Axios-based API layer (`lib/axios.js`) talking to an external backend
- Auth context, cookie-based session, OTP flow
- Many heavy deps: GSAP, Three.js/OGL, face-api.js, react-pdf, pdfjs-dist, recharts, dnd-kit, react-hook-form, zod, sonner

This project is **TanStack Start**, not Next.js. A clean port can't be done in one shot — it'll take several iterations, and some Next-specific features (`app/layout.tsx`, `next/image`, `next/link`, `useRouter`, `[param]` folder dynamic routes, `"use client"` directives) must be converted file by file.

## Phased plan

I'll port in vertical slices so you have a runnable app at each stage. This plan covers **Phase 1 only**; we'll iterate after you see it.

### Phase 1 — Foundation + public landing page (this turn)

1. **Dependencies.** Add the runtime libs the ported code needs: `axios`, `js-cookie`, `react-hook-form`, `@hookform/resolvers`, `zod`, `react-hot-toast`, `motion`, `gsap`, `lucide-react`, `@tabler/icons-react`, `class-variance-authority`, `clsx`, `tailwind-merge`, `date-fns`, `embla-carousel-react`, `recharts`, `next-themes`, plus the missing Radix primitives (`react-toast`, `react-select`, `react-slot`, etc.). Skip Three.js/face-api/pdfjs until pages that need them are ported.
2. **Design tokens.** Port the Shikana Tailwind v4 tokens / fonts into `src/styles.css` so colors and typography match.
3. **Shared layout primitives.** Copy `components/ui/*` (shadcn) into `src/components/ui/`, replacing the template's versions where names overlap. Bring over `lib/utils.ts`, `hooks/use-mobile.ts`.
4. **Assets.** Move `public/*` images into the project's `public/` folder so they keep working.
5. **Public site shell.** Convert `app/layout.tsx` + `components/header.tsx` + `components/footer.tsx` into a TanStack pathless layout `src/routes/_public.tsx`.
6. **Home page.** Convert `app/page.tsx` (with `hero-section`, `mission-vision`, `impact-story-home`, `thematic-areas`, `events-preview`, `blog-preview`, `testimonials-section`, `newsletter-cta`) into `src/routes/index.tsx`.
7. **404/error pages** stay as-is in `__root.tsx`.

Deferred (later phases, in this order):
- **Phase 2:** Remaining public pages (`about`, `contact`, `faq`, `donate`, `events`, `blog`, `careers`, `volunteer`, `local-group`, `publications`, `register`, `verify-membership`, legal pages).
- **Phase 3:** Auth flow (`/login`, `/otp`, `/forgot-password`) + `AuthContext` adapted for TanStack (router context + `_authenticated` guard).
- **Phase 4:** Admin shell (`app-sidebar`, `site-header`, `nav-*`) under `src/routes/_authenticated/admin/`.
- **Phase 5:** Admin CRUD pages in batches (dashboard + users → aspirants/volunteers/members → blogs/events/jobs → donations/merchandise/local-groups → audit-trails/roles/settings).

### Things I will NOT change without asking

- The backend API base URL inside `lib/axios.js` — I'll keep it pointed at the same host so your existing backend keeps working.
- The visual design — it's ported 1:1, not redesigned.

## Technical notes

- `next/link` → `@tanstack/react-router` `<Link to=...>`.
- `next/navigation` `useRouter` / `usePathname` → `useNavigate` / `useLocation`.
- `next/image` → plain `<img>` with the asset URL (no automatic optimization in this stack).
- `app/[param]/page.tsx` → `src/routes/segment.$param.tsx` with `Route.useParams()`.
- `"use client"` directives are removed — every TanStack route component is already a client component unless explicitly SSR'd.
- `app/layout.tsx` becomes a pathless `_public.tsx` layout (or `_authenticated.tsx` for the admin) rendering `<Outlet />`.
- Axios calls stay client-side for now. If/when you want them server-side, we can wrap each endpoint in `createServerFn`.
- I'll wire `react-hot-toast` alongside the existing `sonner` rather than rip out the template's toaster.

## What I need from you before starting Phase 1

1. **Backend URL.** What's the API base URL (`NEXT_PUBLIC_API_URL` or hardcoded value) the frontend should hit? I'll read `lib/axios.js` to confirm, but if it's an env var I need the value.
2. **Confirm scope.** OK to start with Phase 1 (foundation + landing page only) and iterate, or do you want a different starting slice (e.g. admin shell first)?
