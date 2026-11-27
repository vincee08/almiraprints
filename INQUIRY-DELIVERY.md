# Inquiry delivery

The contact form uses the existing validated `/api/contact` SMTP route. It reports success only after the configured staff recipient is accepted by the SMTP server, and it never claims final inbox delivery. If SMTP is unavailable, customers see call and email alternatives and no simulated success.

Quote requests use `/api/quote` and Supabase. A quote is acknowledged only after the database record and any required private artwork are saved. Staff review quotes in the protected dashboard. Quote submission does not send email.

To enable the separate contact form, set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and `SMTP_TO` on the server. A local Mailpit server at `127.0.0.1:54325` is the only supported unauthenticated SMTP case. Without SMTP, `/api/contact` returns 503. See [backend setup](./BACKEND-SETUP.md) and [.env.example](./.env.example) for the full local and hosted configuration.
