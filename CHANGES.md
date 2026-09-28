# INFYBUYS — Change Log

All significant changes to the codebase are logged here in reverse-chronological order.
Each entry records: **what** changed, **why**, **files touched**, and **how to verify**.

---

## [2026-09-26] — Session 3: Remove Dual Email Verification Flag

### M-2 · `VITE_EMAIL_VERIFICATION_ENABLED` removed — backend is sole source of truth

**Problem**: Email verification enforcement was controlled by two independent flags:
- `EMAIL_VERIFICATION_ENABLED` — backend `.env`, enforced at login (correct authority)
- `VITE_EMAIL_VERIFICATION_ENABLED` — frontend `.env`, controlled routing decisions

If these two flags were ever out of sync (e.g. backend enforces but frontend doesn't know), the auth flow would silently misbehave. The `useUserStore.setUser` function was reading the Vite env var to decide whether to set status to `verification-required` — meaning the frontend could set a user as `authenticated` even when the backend would reject them on the next API call.

**Fix**: Removed `VITE_EMAIL_VERIFICATION_ENABLED` from all frontend code. The new flow:
- **Backend enforces verification**: backend rejects login with `401 "Email not verified"` → `Login.tsx` catches this specific error message and always redirects to `/verify-email` — no flag needed
- **Backend does not enforce**: login succeeds → `setUser` sets status to `authenticated` — no flag needed
- **`setUser` in `useUserStore`**: now always sets `authenticated` when a user is provided; `verification-required` status is only triggered explicitly by the login error handler

**Files changed**:
- `frontend/src/store/useUserStore.ts` — removed flag from `setUser`
- `frontend/src/pages/auth/Login.tsx` — removed 3 flag references; error handler now always redirects on `"Email not verified"`
- `frontend/src/pages/auth/Register.tsx` — removed flag from Google signup path
- `frontend/.env.example` — removed `VITE_EMAIL_VERIFICATION_ENABLED`, added explanatory comment

**How to verify**:
1. `EMAIL_VERIFICATION_ENABLED=true` in backend → login with unverified email → backend returns 401 → frontend redirects to `/verify-email` ✓
2. `EMAIL_VERIFICATION_ENABLED=false` in backend → login with unverified email → backend allows it → frontend navigates to home ✓
3. Google login → always goes to home (backend auto-verifies Google users) ✓

---

## [2026-09-25] — Session 2: Auth Service Cleanup

### H-1 · Dead `google-auth-library` import + `googleClient` field removed

**Problem**: `auth.service.ts` imported `OAuth2Client` from `google-auth-library` and instantiated `private googleClient = new OAuth2Client(...)`. Neither were ever used — Google login bypasses it entirely via `fetch` to Google's userinfo endpoint. The unused class property caused unnecessary instantiation on every request.

**Fix**: Removed the import (line 11) and the dead field (line 22).

**Files changed**: `backend/src/auth/auth.service.ts`

---

### H-2 · OTP resend user-existence leak fixed

**Problem**: `resendOtp()` had a comment saying `// Don't leak whether user exists` but the code directly beneath it did exactly that — it threw `BadRequestException('No account found with that email.')`. An attacker could enumerate registered emails by hitting `POST /auth/send-otp`.

**Fix**: Changed `resendOtp` to return silently when the email is not found or already verified. The controller always responds with `{ message: 'Verification code sent' }` regardless of outcome — the caller learns nothing about registration state.

**Files changed**: `backend/src/auth/auth.service.ts`

**How to verify**:
1. Call `POST /auth/send-otp` with a non-existent email → should return `200 { message: 'Verification code sent' }` (not a 400 error)
2. Call with a real unverified email → same 200 response, OTP email is sent
3. Call with a verified email → same 200 response, nothing sent

---

### M-1 · Deprecated link-based email verification removed

**Problem**: The original auth system used signed JWT tokens sent by email link (`POST /auth/verify-email`, `POST /auth/resend-verification`). These were superseded by the OTP flow but the three old methods (`sendVerificationEmail`, `verifyEmail`, `resendVerificationEmail`) and their controller endpoints were left as dead code — live endpoints with no frontend callers.

**Fix**: Removed the three deprecated service methods and the two dead controller endpoints. The OTP flow (`POST /auth/send-otp`, `POST /auth/verify-otp`) is now the only email verification path.

**Files changed**:
- `backend/src/auth/auth.service.ts`
- `backend/src/auth/auth.controller.ts`

**How to verify**: `POST /auth/verify-email` and `POST /auth/resend-verification` now return 404.

---

## [2026-09-25] — Session 1: Critical Fixes


### C-1 · CORS Configuration Added to `main.ts`

**Problem**: `app.enableCors()` was completely absent from `main.ts`. NestJS defaults to CORS disabled. In production (where the frontend and backend are on different origins), the browser would block every API request. The team confirmed no Nginx proxy handles CORS — NestJS is the CORS authority.

**Fix**: Added `app.enableCors()` driven by the `FRONTEND_URL` environment variable. Supports a comma-separated list of origins for multi-domain setups. Defaults to `http://localhost:5173` for local development (no change to dev workflow).

**Files changed**:
- `backend/src/main.ts`

**Key behaviour**:
```
FRONTEND_URL=https://app.infybuys.com        → allows only that origin
FRONTEND_URL=https://app.infybuys.com,https://www.infybuys.com  → allows both
FRONTEND_URL not set                          → allows http://localhost:5173 (dev default)
```

**How to verify**:
1. Start backend with `FRONTEND_URL=http://localhost:5173`
2. From the frontend dev server, make any API call — should succeed (no CORS error)
3. Change `FRONTEND_URL` to a different origin; confirm browser blocks requests from `localhost:5173`

---

### C-2 · Startup Environment Validation Added to `main.ts`

**Problem**: If `JWT_ACCESS_SECRET` (or `DATABASE_URL`) was missing from `.env`, the app would start silently and behave catastrophically — JWT signed with `undefined` as the secret, making all tokens trivially forgeable.

**Fix**: Added `validateEnv()` in `main.ts` that runs before `NestFactory.create()`. It checks `DATABASE_URL` and `JWT_ACCESS_SECRET`. If either is missing, it logs a clear error and calls `process.exit(1)` — the app never starts.

**Files changed**:
- `backend/src/main.ts`

**How to verify**:
1. Temporarily remove `JWT_ACCESS_SECRET` from `.env`
2. Run `npm run start:dev`
3. App should print `FATAL: Missing required environment variables: JWT_ACCESS_SECRET` and exit — no server starts

---

### C-3 · `DATABASE_URL` Credential Leak Removed from `prisma.service.ts`

**Problem**: `prisma.service.ts` constructor had `console.log('DATABASE_URL IS:', process.env.DATABASE_URL)`. The full connection string (including the DB password) was printed to stdout on every cold start. In any log aggregation system (CloudWatch, Datadog, etc.) this persists as plaintext credentials.

**Fix**: Removed the `console.log`. Added:
- A guard that throws a clear `Error` if `DATABASE_URL` is missing (safety net complementing `main.ts` validation)
- NestJS `Logger` calls for connection lifecycle — informational only, no secrets logged

**Files changed**:
- `backend/src/prisma/prisma.service.ts`

**How to verify**:
1. Start the app normally
2. Check stdout — `DATABASE_URL` value must not appear anywhere
3. Logger should print `Database connection established.` instead

---

### C-4 · Fabricated Revenue Metric Removed from `admin.service.ts`

**Problem**: The admin dashboard "total revenue" was computed by:
1. Summing `listing.priceOrRent` for published listings — this is the **asking price**, not received revenue
2. Falling back to a **hardcoded £245,000** if the sum was 0

Both are wrong. Asking price ≠ revenue, and hardcoded fallbacks are dangerous for business decisions.

**Fix**: Replaced with a query against the `Payment` table (the correct source of truth for revenue). Since Stripe is not yet integrated, `Payment` is empty and correctly returns `£0`. Once Stripe payments are recorded, this metric will automatically reflect real revenue.

**Files changed**:
- `backend/src/admin/admin.service.ts`

**How to verify**:
1. Call `GET /admin/dashboard/stats` — `totalRevenue` should be `0`, not `245000`
2. Admin dashboard should show `£0` total revenue

---

### C-5 · `backend/.env.example` — Complete Rewrite

**Problem**: The previous file documented only 5 of ~12 required environment variables. Developers would get silent runtime failures (S3 failing, email broken, Google login missing, etc.).

**Fix**: Full rewrite documenting every variable — with `[REQUIRED]` vs `[OPTIONAL]` guidance, descriptions, and instructions on how to obtain each value.

**Files changed**:
- `backend/.env.example`

---

## Pending — Next Sessions

| Priority | Issue | Status |
|---|---|---|
| High | Stripe payment gateway integration | Planned |
| High | Remove `VITE_EMAIL_VERIFICATION_ENABLED` from frontend (backend is source of truth) | Pending |
| High | Move tokens from localStorage to `httpOnly` cookies | Pending |
| Medium | Fix OTP resend user-existence leak in `resendOtp` | Pending |
| Medium | Fix `markAsActive` — sellers should not bypass admin review | Pending |
| Medium | Remove dead `google-auth-library` import from `auth.service.ts` | Pending |
| Medium | Remove deprecated link-based email verification endpoints | Pending |
| Medium | Add `Notification.userId` FK + `onDelete: Cascade` to Prisma schema | Pending |
| Medium | Add `Listing.coverMediaId` FK constraint to schema | Pending |
| Low | Remove/gitignore 56 root-level utility scripts | Pending |
| Low | Delete `diff.txt` and `diff.sql` (confirmed safe) | Pending |
| Low | Fix `@types/bcrypt` → should be `@types/bcryptjs` | Pending |
| Future | WebSocket / push notification layer | Planned |
| Future | Listing auto-expiry scheduler (`Listing.expiresAt`) | Planned |
| Future | Enforce `featureLimits` per subscription plan | Planned |
