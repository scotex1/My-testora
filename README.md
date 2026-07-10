# FinVest

Real Next.js 14 (App Router) + TypeScript app — full structure: marketing site,
auth, dashboard, 7 AI engines, and admin panel. State management via Zustand.

## Setup

```bash
npm install
cp .env.local.example .env.local   # fill in Firebase + API values
npm run dev
```

## Verified

- ✅ `tsc --noEmit` — zero type errors
- ✅ `next build` — zero errors, all 26 routes generate successfully
- ✅ No unused imports

## Structure

```
app/
  home, about, contact, pricing, testimonials, legal/terms   → marketing (public)
  auth/login, auth/signup                                     → authentication
  dashboard/ (+ profile, subscription)                        → user area (protected)
  engines/{7 engines}                                          → plan-gated AI tools
  admin/ (+ users, payments, plans)                            → admin-only panel
components/
  layout/  → MarketingNav, MarketingFooter, Navbar, Sidebar
  ui/      → Card, Button, Input, Select, Badge, StatCard
  AuthGuard, AdminGuard, EngineGuard, AuthInitializer
hooks/useAuth.ts       → thin selector over the Zustand store
store/authStore.ts     → Zustand: firebase uid, profile, plan, admin flag
lib/{firebase,api,utils}.ts
```

## Key implementation notes

- **`lib/firebase.ts`**: `getAuth()` is lazily initialized (`getFirebaseAuth()`),
  never called at module scope — this is what let the app build cleanly even
  before real Firebase keys are set. Call `getFirebaseAuth()` from client code
  only (event handlers, `useEffect`), never at module top-level.
- **`store/authStore.ts` + `components/AuthInitializer.tsx`**: the initializer
  runs the Firebase `onAuthStateChanged` listener once (mounted in
  `providers.tsx`) and pushes state into the Zustand store; `useAuth()` is a
  read-only selector on top of it.
- **`lib/utils.ts` → `hasAccess()`**: the same expired-paid-plan → free-tier
  downgrade rule from the original spec, reused by the Dashboard grid,
  `EngineGuard`, and the Sidebar lock icons — one source of truth.
- **`components/EngineGuard.tsx`**: derives the engine id from the URL
  segment in `app/engines/layout.tsx` and redirects to `/pricing` if the
  current plan doesn't include it.
- **`components/AdminGuard.tsx`**: layers on top of `AuthGuard`; redirects
  non-admins to `/dashboard`.
- **Goal Planner**: calls the backend SIP endpoint first; if it fails, falls
  back to a local SIP-annuity formula so the engine still works offline/degraded.
- **next.config.js, not .ts**: `.ts` config files require Next.js 15+; this
  project pins Next 14.2.35 (patched CVE) so the config is plain JS. Upgrade
  to Next 15 first if you want `next.config.ts`.

## ⚠️ Backend contract assumptions

This frontend assumes REST endpoints matching `lib/api.ts` (`/user/profile`,
`/engines/*`, `/admin/*`, etc.) and that `/user/profile` returns
`{ name, email, photo, plan, plan_expiry, is_admin }`. Adjust field names in
`store/authStore.ts` and `AuthInitializer.tsx` if your backend differs.

## Security reminder

`hasAccess()` and `AdminGuard` are client-side UX only. Your backend must
independently verify plan/expiry and admin status on every protected
endpoint — never trust the frontend check alone.
