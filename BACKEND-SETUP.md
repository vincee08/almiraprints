# Supabase, staff and Vercel setup

The public Next.js site stays in this repository. Quote requests, artwork, and contact messages use Supabase. Staff access uses Supabase email/password Auth plus an administrator-managed `staff_members` row. No public staff registration page or endpoint exists. Form submissions do not use email delivery.

## Local development

1. Install dependencies with `npm ci`. Start Docker Desktop, then run `npx supabase start` in this repository. The CLI applies `supabase/migrations` and starts Postgres, Auth, Storage, Realtime and Studio.
2. Run `npx supabase status -o env`. Copy `API_URL` to `NEXT_PUBLIC_SUPABASE_URL`, `ANON_KEY` to `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SERVICE_ROLE_KEY` to `SUPABASE_SERVICE_ROLE_KEY` in an ignored `.env.local`. Never commit that file or put the service role key in a public variable.
3. Run `npm run dev` and open the site. `npx supabase db reset` recreates only this local project's database from migrations and discards its local data.

Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and, with the local stack and app running, `npm run test:integration`. The integration suite creates temporary staff and customer fixtures and removes their database rows, Auth users and artwork. It checks both save flows, deduplication, privacy and Realtime.

## Staff accounts

Public Supabase signups are disabled in `supabase/config.toml`. In the hosted Supabase project, also switch off **Authentication > Providers > Email > Allow new users to sign up**. An administrator creates a staff account from a trusted shell by setting `STAFF_EMAIL` and a strong `STAFF_PASSWORD` (at least 12 characters), then running `npm run staff:create`. The script uses the server-only service role key to create an already confirmed Auth user and its `staff_members` authorization row. Do not put the staff password in Git, Vercel environment variables, or a public form. Staff sign in at `/staff/sign-in`.

Staff authorization is checked by the protected Next.js routes and API, database row-level policies, and the private artwork bucket. File links are signed for 60 seconds only after staff authorization. Removing a staff member's row revokes future dashboard and file-link access. Existing signed links expire on their own.

## Quote flow

The public quote endpoint validates catalog choices, quantity, text, and artwork metadata. It rejects a filled honeypot, limits each hashed IP to eight new quote records per hour, and deduplicates the same request for five minutes. A random submission key makes retries idempotent. No customer gets direct table access.

Without artwork, the server saves a submitted quote and returns its reference number. With artwork, the server first creates a pending record and a one-path signed upload token. The browser sends the file straight to the private Supabase bucket. The server verifies that the stored object's size and type match the validated file before marking the request submitted. The bucket itself enforces the 10,485,760-byte limit. An incomplete upload cannot produce the customer success screen. Files never travel through a Vercel Function request body.

The customer sees saved success only after the request and required artwork are stored. Staff find new requests in the protected dashboard, with Realtime unread updates while it is open. Quote submission does not send an email or depend on SMTP. The forward migration removes obsolete quote-email state without deleting existing quote records or artwork; previously failed test notifications are not retried.

## Contact messages

`/api/contact` validates the existing form fields, rejects a filled honeypot, limits each hashed IP to eight new messages per hour, and deduplicates identical messages for five minutes. A browser submission key makes retries idempotent. The server returns a reference only after `contact_messages` is saved. Customers have no direct table access; staff can search and read messages in the protected dashboard. No email is sent.

## Hosted Free demo

1. Create a dedicated **Supabase Free** project in a free allocation you control. Record its project reference, API URL, publishable/anon key, and service role key privately. In the project, disable public email signups. Configure allowed site URLs for the Vercel domain.
2. From this repository, run `npx supabase link --project-ref <ref>` and `npx supabase db push --remote`. Review pending migrations first; never use `db reset --remote` on a live project. The migrations create the staff, quote and contact tables, RLS policies, private 10 MB artwork bucket and quote Realtime publication.
3. In the existing Vercel `almiraprints` project, set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` for Production. Only the first two are public. No SMTP settings are needed.
4. Deploy the Next.js project to Vercel. Create the first staff user using the trusted script against the hosted project. Test live quote and contact saves, staff access to both views, private artwork and quote Realtime unread status.

No credentials or customer files belong in commits. `.env.local`, Vercel linkage, and Supabase local state are Git-ignored.
