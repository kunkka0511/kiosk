# Mandala QR mobile lead MVP

## Routes

- Mobile presentation: `/m/mandala?source=kiosk_qr&screen=sales_managers`
- Admin login: `/admin/login`
- Admin leads: `/admin/leads`
- Lead submit API: `POST /api/leads`
- CSV export: `/api/admin/leads/export`

## Setup

1. Copy `.env.example` to `.env.local` and replace every admin placeholder.
2. For a real phone scan, set `NEXT_PUBLIC_MOBILE_PRESENTATION_URL` to an absolute URL the phone can reach.
   For LAN testing, use the kiosk PC IPv4 address, for example:
   `http://192.168.1.50:3000/m/mandala?source=kiosk_qr&screen=sales_managers`.
3. Run `npm run build` and `npm run start`. `start-kiosk.bat` binds the server to `0.0.0.0`.
4. Allow TCP port 3000 through Windows Firewall when testing from another device.

## Admin and CSV

Open `/admin/login` and sign in with `ADMIN_USERNAME` and `ADMIN_PASSWORD` from the server environment.
The session is an 8-hour signed HttpOnly cookie using `ADMIN_SESSION_SECRET`.
Keep `ADMIN_COOKIE_SECURE=false` for local HTTP/LAN kiosk use. Set it to `true` only when the site is served over HTTPS.
Open `/admin/leads`, then use **CSV татах**. The file includes a UTF-8 BOM for Mongolian text in Excel.

## Storage and deployment limitation

Leads are stored in `data/leads.sqlite` by default. This is persistent for the local standalone kiosk while that folder remains intact.
Vercel/serverless filesystems are ephemeral, so production cloud deployment must replace `lib/leads.ts` with a durable Postgres/Supabase repository. The UI and API contract can remain unchanged.
