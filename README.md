# AlmiraPrints

AlmiraPrints is a responsive printing-shop website built with Next.js 15, React 19, TypeScript, Tailwind CSS and Radix UI. It includes home, services, service details, portfolio, about, FAQ, contact and quote pages, plus a protected staff dashboard.

The service catalog and project gallery use local data and real project images. Customers can request a quote with optional artwork up to 10 MB. Quotes are saved to Supabase with a reference number; artwork goes directly from the browser to private Supabase Storage. Staff use administrator-created email/password accounts to review requests, search and filter, update status, open artwork, and see new requests through Supabase Realtime. The existing contact form sends through SMTP.

See [backend setup](./BACKEND-SETUP.md) for local Docker/Supabase development, staff creation, hosted Supabase Free and Vercel configuration, and integration tests. The separate contact form uses SMTP when configured; quotes never send email. See [.env.example](./.env.example) for variable names. Never commit real credentials or customer files.

## Run locally

```bash
npm ci
npx supabase start
# Copy the local Supabase values from: npx supabase status -o env
# Set them in ignored .env.local; optional local SMTP values test the contact form
npm run dev
```

Open `http://localhost:3000`. Create staff users only from a trusted administrator shell with `npm run staff:create`; public registration is disabled.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
# With local Supabase and the site running:
npm run test:integration
```

The integration suite checks public quote submission, direct artwork upload, staff row and file permissions, status updates, realtime, idempotency, no quote email, and local contact SMTP acceptance.
