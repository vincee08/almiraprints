-- Quote requests are complete when their record and optional artwork are saved.
-- Remove only the obsolete quote-email functions and columns; preserve every
-- quote row, private artwork object, staff policy, and Realtime publication.
drop function if exists public.claim_quote_notification(uuid);
drop function if exists public.finish_quote_notification(uuid, uuid, text, text);

alter table public.quote_requests
  drop column if exists notification_state,
  drop column if exists notification_attempts,
  drop column if exists notification_claim,
  drop column if exists notification_error,
  drop column if exists notification_sent_at;
