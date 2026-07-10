# AGENTS.md — FinVest

Guidance for any AI coding agent (Claude, Cursor, Copilot, etc.) working in this repo.

## Stack
Next.js 14 (App Router) · TypeScript · Zustand · TanStack Query · Axios · Firebase Auth · Tailwind

## Non-negotiable conventions

0. **Admin panel is a separate project (`finvest-admin`), not part of this
   app.** This repo has no `/admin` routes or `apiClient.admin` group
   anymore — only `isAdmin` on the auth store remains, used solely to show
   an external link to `NEXT_PUBLIC_ADMIN_URL` in the Sidebar. Don't
   reintroduce admin routes here; add them to `finvest-admin` instead.

1. **Never call `getAuth()` at module scope.** Use `getFirebaseAuth()` from
   `lib/firebase.ts`, and only inside client code (event handlers, `useEffect`,
   the axios interceptors in `lib/api.ts`). Calling it eagerly at import time
   breaks `next build` when Firebase env vars are absent — this already
   happened once, don't reintroduce it.

2. **State lives in `store/authStore.ts` (Zustand), not Context.** Read it
   through `hooks/useAuth.ts`, never `useAuthStore` directly in page/component
   code, so derived fields (`isExpired`, `daysLeft`) stay consistent everywhere.

3. **All plan-gating goes through `hasAccess()` in `lib/utils.ts`.** Do not
   write a new expiry/plan check inline anywhere (Dashboard, Sidebar,
   EngineGuard, and any new engine page must all call the same function).
   The rule: an expired paid plan silently downgrades to free-tier access.

4. **All backend calls go through `apiClient` in `lib/api.ts`.** Never call
   `axios`/`fetch` directly from a page or component. If a new backend
   endpoint is needed, add it to the relevant group in `apiClient` first.

5. **Route guards, not scattered checks:**
   - `components/AuthGuard.tsx` — requires login
   - `components/AdminGuard.tsx` — requires login + `isAdmin`
   - `components/EngineGuard.tsx` — requires login + plan access for a
     specific engine id (derived from the URL in `app/engines/layout.tsx`)

6. **New pages under `/dashboard/*` or `/admin/*`** don't need their own
   guard — the segment's `layout.tsx` already wraps every child route.

7. **New engine pages** go in `app/engines/<engine-id>/page.tsx` and must
   also be added to the `ENGINES` array in `lib/utils.ts` (id, name, icon,
   color, `plans[]`) — the Dashboard grid, Sidebar, and `EngineGuard` all
   read from that single array.

8. **Currency values from the backend payment endpoints are in paise.**
   Divide by 100 before passing to `formatCurrency()`.

9. **`next.config.js`, not `.ts`.** This project pins Next 14.2.35 (patched
   CVE); `.ts` config requires Next 15+. Don't rename it without also
   upgrading Next.

## Before committing any change

Run, in order:
```bash
npx tsc --noEmit
npm run build
```
Both must pass with zero errors. Also grep for unused imports in any file
you touched — this repo has none currently; keep it that way.

## Backend contract this frontend assumes

- `GET /user/profile` → `{ name, email, photo, plan, plan_expiry, is_admin }`
- Payment amounts are integers in paise
- `/admin/*` endpoints independently verify `is_admin` server-side — the
  frontend `AdminGuard` is a UX convenience only, not a security boundary
