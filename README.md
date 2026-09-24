# Hospital Feedback System — Frontend

A Next.js (App Router) frontend for the Hospital Feedback System API. Patients
scan a department's QR code to fill out a short survey; hospital admins log
in to view responses and reply.

This app is a pure client that talks to the [backend API](../backend) over
HTTP — it holds no database of its own and does no server-side rendering of
private data. Every request goes through `src/lib/api.js`.

## Tech stack

- **Next.js** (App Router, client components)
- **Tailwind CSS** for styling
- **`qrcode.react`** for rendering department QR codes in the admin UI

## Prerequisites

- Node.js (LTS)
- The backend API running somewhere reachable (locally at
  `http://localhost:8000` by default — see the backend's own README)

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Edit `.env.local` and point it at your backend: 
```NEXT_PUBLIC_API_URL=http://localhost:8000```

Then run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## First-time setup: creating an admin

There's no seeded admin account. The very first account is created via the
public bootstrap route — either call the API directly:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Jane","last_name":"Doe","email":"jane@hospital.org","password":"a-very-strong-password","hospital_name":"Memorial Hospital"}'
```

or use the backend's `/docs` page. That first account becomes `super_admin`.
Once you have an account, log in at `/admin/login`. A `super_admin` can
create further admin accounts via the API's `/admins` endpoint (there's no
frontend UI for this yet — see Known gaps below).

## How it fits together

**Patients** never see a login screen. Scanning a department's QR code opens
`/survey/{qr_code_token}`, which:
1. Calls `POST /qr-scan/{token}` to start an anonymous session (returns an
   opaque session token, stored in `sessionStorage` — it doesn't outlive the
   tab).
2. Fetches the live list of feedback categories and questions from the API
   (nothing is hardcoded in the frontend).
3. Saves each answer to the API immediately as the patient selects it, so
   nothing is lost if they close the tab partway through.

**Admins** log in at `/admin/login` with email/password and get a JWT
(stored in `localStorage`, 30-minute lifetime set by the backend). From
there:
- `/admin` — every feedback response, newest first, with an inline reply
  box per response.
- `/admin/departments` — create departments and reveal/print each one's QR
  code. **This is how the links patients scan are generated** — QR tokens
  are admin-only by design (a public "generate a QR" page would mean every
  department shares the same code, which defeats tracking feedback by
  department).


## Environment variables

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | yes | `http://localhost:8000` | Base URL of the backend API. Exposed to the browser (it's prefixed `NEXT_PUBLIC_`), since all requests are made client-side. |

## Known gaps / next pass

- No UI yet for managing feedback categories/questions — currently
  admin-only via the API directly (`POST /feedback-categories`,
  `POST /questions`).
- No UI for a `super_admin` to create further admin accounts — currently
  via the API directly (`POST /admins`).
- No department-based filtering on the responses dashboard yet.
- Reply box has no delete/edit UI (the API supports it, the frontend
  doesn't expose it yet).
- No automated frontend tests yet (the backend has a pytest suite; nothing
  equivalent — e.g. Playwright/Vitest — exists here yet).

## Troubleshooting

- **Survey page shows "This survey link is invalid or no longer active"**:
  the QR token doesn't match an active department, or the department was
  deactivated. Check `/admin/departments`.
- **Admin pages redirect straight back to `/admin/login`**: the stored JWT
  is missing, expired (30 min by default), or the backend isn't reachable at
  `NEXT_PUBLIC_API_URL`. Check the browser console/network tab for the
  actual API error.
- **CORS errors in the browser console**: the backend's `ALLOWED_ORIGINS`
  setting needs to include this app's origin (e.g. `http://localhost:3000`).