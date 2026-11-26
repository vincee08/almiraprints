# Supabase, staff and Vercel setup

The public Next.js site stays in this repository. Quote records and artwork use Supabase. Contact messages keep the existing SMTP route. Staff access uses Supabase email/password Auth plus an administrator-managed `staff_members` row. No public staff registration page or endpoint exists.

## Local development

1. Install dependencies with `npm ci`. Start Docker Desktop, then run `npx supabase start` in this repository. The CLI applies `supabase/migrations` and starts Postgres, Auth, Storage, Realtime, Studio and Mailpit.
2. Run `npx supabase status -o env`. Copy `API_URL` to `NEXT_PUBLIC_SUPABASE_URL`, `ANON_KEY` to `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SERVICE_ROLE_KEY` to `SUPABASE_SERVICE_ROLE_KEY` in an ignored `.env.local`. Never commit that file or put the service role key in a public variable.
3. For local email testing, use `SMTP_HOST=127.0.0.1`, `SMTP_PORT=54325`, `SMTP_SECURE=false`, `SMTP_FROM=almira@localhost.test`, and a test `SMTP_TO` address. Local Mailpit needs no SMTP username or password. View accepted test messages at `http://127.0.0.1:54324`. For any nonlocal SMTP host, credentials are required.
4. Set `APP_BASE_URL=http://localhost:3000`, run `npm run dev`, and open the site. `npx supabase db reset` recreates only this local project's database from migrations and discards its local data.

Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and, with the local stack and app running, `npm run test:integration`. The integration suite creates temporary staff and customer fixtures and removes their database rows, Auth users and artwork. It checks SMTP acceptance in Mailpit, including while no staff session is open. It does not prove delivery to a real inbox.

## Staff accounts

Public Supabase signups are disabled in `supabase/config.toml`. In the hosted Supabase project, also switch off **Authentication > Providers > Email > Allow new users to sign up**. An administrator creates a staff account from a trusted shell by setting `STAFF_EMAIL` and a strong `STAFF_PASSWORD` (at least 12 characters), then running `npm run staff:create`. The script uses the server-only service role key to create an already confirmed Auth user and its `staff_members` authorization row. Do not put the staff password in Git, Vercel environment variables, or a public form. Staff sign in at `/staff/sign-in`.

Staff authorization is checked by the protected Next.js routes and API, database row-level policies, and the private artwork bucket. File links are signed for 60 seconds only after staff authorization. Removing a staff member's row revokes future dashboard and file-link access. Existing signed links expire on their own.

## Quote flow and notification semantics

The public quote endpoint validates catalog choices, quantity, text, and artwork metadata. It rejects a filled honeypot, limits each hashed IP to eight new quote records per hour, and deduplicates the same request for five minutes. A random submission key makes retries idempotent. No customer gets direct table access.

Without artwork, the server saves a submitted quote and reference number, then sends the staff email. With artwork, the server first creates a pending record and a one-path signed upload token. The browser sends the file straight to the private Supabase bucket. The server verifies that the stored object's size and type match the validated file before marking the request submitted. The bucket itself enforces the 10,485,760-byte limit. An incomplete upload cannot produce the customer success screen or staff email. Files never travel through a Vercel Function request body.

For every submitted quote, the server attempts SMTP independently of dashboard login. The email contains the reference and a protected `/staff?request=...` link, never the artwork attachment. The database records `sent` only after SMTP accepts the configured staff recipient; this does not prove final inbox delivery. Missing SMTP settings or definite recipient rejection produce `failed` status, which staff can retry. An ambiguous transport error produces `uncertain` status and no automatic retry, because SMTP may already have accepted that message. Atomic database claims prevent two simultaneous retries from sending twice. The customer sees saved success only after the request and required artwork are stored, plus a prompt to call if staff email could not be confirmed.

Contact inquiries continue to use `/api/contact` and the existing validated SMTP handler. They are not quote records.

## Hosted Free demo

1. Create a dedicated **Supabase Free** project in a free allocation you control. Record its project reference, API URL, publishable/anon key, and service role key privately. In the project, disable public email signups. Configure allowed site URLs for the Vercel domain.
2. From this repository, run `npx supabase link --project-ref <ref>` and `npx supabase db push --linked`. Review the linked project before pushing; never use `db reset --remote` on a live project. The migration creates the staff and quote tables, RLS policies, private 10 MB bucket, and Realtime publication.
3. In the existing Vercel `almiraprints` project, set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `APP_BASE_URL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and `SMTP_TO` for the deployment environment. Only the first two are public. Set `APP_BASE_URL` to the actual HTTPS deployment URL. Use a real SMTP provider and a sender address it authorizes; `SMTP_TO` must be the staff inbox.
4. Deploy the Next.js project to Vercel. Create the first staff user using the trusted script against the hosted project. Test live quotes with and without a file, staff sign-in and file access, realtime unread status, the contact form, and receipt in the real staff inbox. Do not describe SMTP acceptance as confirmed inbox delivery until the inbox is checked.

No credentials or customer files belong in commits. `.env.local`, Vercel linkage, and Supabase local state are Git-ignored.
