# Inquiry storage

The contact form uses the validated `/api/contact` route to save a private Supabase `contact_messages` row. It reports success and a reference only after the row is saved. If storage is unavailable, it reports a failure and offers a phone alternative. Staff read messages in the protected dashboard. Duplicate retries return the same reference; new identical messages within five minutes are deduplicated.

Quote requests use `/api/quote` and Supabase. A quote is acknowledged only after the database record and any required private artwork are saved. Staff review quotes in the protected dashboard. Quote submission does not send email.

Neither form sends an email. Both use the existing Supabase configuration described in [backend setup](./BACKEND-SETUP.md) and [.env.example](./.env.example).
