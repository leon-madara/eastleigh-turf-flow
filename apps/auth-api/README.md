Auth API (Next.js + Firebase Session Cookies)

Overview
- Verifies Firebase ID tokens from the client (phone OTP sign-in) and mints HttpOnly session cookies.
- Endpoints: POST /api/auth/sessionLogin, GET /api/auth/me, POST /api/auth/logout.
- Uses Firebase Admin SDK session cookies; no tokens in localStorage.

Setup
1) Create a Firebase project and enable Phone Authentication.
2) Create a service account (JSON) and capture:
   - FIREBASE_PROJECT_ID
   - FIREBASE_CLIENT_EMAIL
   - FIREBASE_PRIVATE_KEY (escape newlines as \n)
3) Copy .env.example to .env and fill values. Example:

   FIREBASE_PROJECT_ID=...
   FIREBASE_CLIENT_EMAIL=...
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
   SESSION_COOKIE_NAME=sid
   SESSION_TTL_DAYS=7
   ALLOWED_ORIGINS=http://localhost:5173
   DATABASE_URL=postgresql://user:password@localhost:5432/yourdb?schema=public

4) Optional logging config:
   LOG_LEVEL=debug  # or info|warn|error

5) Install deps, generate Prisma client, and run:
   npm install
   npx prisma generate
   # optional: npx prisma migrate dev --name init
   npm run dev

API Endpoints
- POST /api/auth/sessionLogin
  Body: { idToken: string }
  Sets HttpOnly cookie; returns { user: { uid, phone } }.

- GET /api/auth/me
  Reads cookie; resolves user from DB; returns { user } when status is ACTIVE.
  Returns 403 when authenticated but not approved (PENDING/BLOCKED), 401 otherwise.

- POST /api/auth/logout
  Revokes refresh tokens and clears cookie; returns { ok: true }.

- GET /api/admin/metrics (admin-only)
  Returns aggregate counts: { total, pending, active, blocked, admins }.

Notes
- In production, deploy behind HTTPS so cookies use Secure flag.
- Prefer hosting the SPA and this API on the same domain to avoid CORS.
- For dev across ports, set ALLOWED_ORIGINS and use fetch(..., { credentials: 'include' }).
- Structured logs are emitted as JSON lines with events like session_login_request|success|error,
  me_request|success|error, logout_request|success|error, and firebase_admin_initialized.

Dev Webhook Receiver
- POST /api/dev/webhook — simple receiver for local testing of NOTIFY_WEBHOOK_URLS; logs payload and returns { ok: true }.
