# Inquiry delivery

The contact form uses the existing validated `/api/contact` SMTP route. It reports success only after the configured staff recipient is accepted by the SMTP server, and it never claims final inbox delivery. If SMTP is unavailable, customers see call and email alternatives and no simulated success.

Quote requests use `/api/quote` and Supabase. A quote is acknowledged only after the database record and any required private artwork are saved. The server then sends a separate staff email containing the reference and a protected dashboard link, without attaching private artwork. Email failures remain visible to staff and do not erase the saved quote. A definite failure can be retried atomically; an ambiguous SMTP outcome requires an inbox check before any further send.

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and `SMTP_TO` on the server. A local Mailpit server at `127.0.0.1:54325` is the only supported unauthenticated SMTP case. See [backend setup](./BACKEND-SETUP.md) and [.env.example](./.env.example) for the full local and hosted configuration.
