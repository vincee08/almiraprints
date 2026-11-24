-- Customer writes are performed only by the validated server endpoint using the
-- service role. Staff access is restricted again by RLS and column grants.
create table public.staff_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create function public.is_staff() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.staff_members where user_id = (select auth.uid())) $$;
revoke all on function public.is_staff() from public, anon;
grant execute on function public.is_staff() to authenticated, service_role;

create table public.quote_requests (
  id uuid primary key,
  reference text not null unique default ('AP-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  submission_key uuid not null unique,
  fingerprint text not null,
  ip_hash text not null,
  customer_name text not null check (char_length(customer_name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) <= 30),
  service_category text not null,
  specific_service text not null,
  quantity integer not null check (quantity between 1 and 1000000),
  size text,
  material text,
  deadline date,
  additional_requirements text,
  tshirt_size text,
  tshirt_color text,
  print_location text,
  artwork_path text unique,
  artwork_name text,
  artwork_size integer check (artwork_size between 1 and 10485760),
  artwork_mime text,
  submission_state text not null default 'submitted' check (submission_state in ('pending_artwork','submitted')),
  status text not null default 'new' check (status in ('new','in_progress','completed','cancelled')),
  notification_state text not null default 'pending' check (notification_state in ('pending','sending','sent','failed','uncertain')),
  notification_attempts integer not null default 0,
  notification_claim uuid,
  notification_error text,
  notification_sent_at timestamptz,
  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint artwork_fields_together check ((artwork_path is null and artwork_name is null and artwork_size is null and artwork_mime is null) or (artwork_path is not null and artwork_name is not null and artwork_size is not null and artwork_mime is not null)),
  constraint submission_artwork_match check ((submission_state = 'pending_artwork' and artwork_path is not null and submitted_at is null) or (submission_state = 'submitted' and submitted_at is not null))
);
create index quote_requests_created_idx on public.quote_requests (submitted_at desc) where submission_state = 'submitted';
create index quote_requests_fingerprint_idx on public.quote_requests (fingerprint, created_at desc);
create index quote_requests_ip_idx on public.quote_requests (ip_hash, created_at desc);

create function public.create_quote_request(
  p_id uuid, p_submission_key uuid, p_fingerprint text, p_ip_hash text,
  p_data jsonb, p_artwork_path text default null, p_artwork_name text default null,
  p_artwork_size integer default null, p_artwork_mime text default null
) returns public.quote_requests
language plpgsql security definer set search_path = ''
as $$
declare result public.quote_requests;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_ip_hash, 1));
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_fingerprint, 2));
  select * into result from public.quote_requests where submission_key = p_submission_key;
  if found then return result; end if;
  select * into result from public.quote_requests
    where fingerprint = p_fingerprint and created_at > now() - interval '5 minutes'
    order by created_at desc limit 1;
  if found then return result; end if;
  if (select count(*) from public.quote_requests where ip_hash = p_ip_hash and created_at > now() - interval '1 hour') >= 8 then
    raise exception 'QUOTE_RATE_LIMIT' using errcode = 'P0001';
  end if;
  insert into public.quote_requests (
    id, submission_key, fingerprint, ip_hash, customer_name, email, phone,
    service_category, specific_service, quantity, size, material, deadline,
    additional_requirements, tshirt_size, tshirt_color, print_location,
    artwork_path, artwork_name, artwork_size, artwork_mime, submission_state, submitted_at
  ) values (
    p_id, p_submission_key, p_fingerprint, p_ip_hash,
    p_data->>'customerName', p_data->>'email', p_data->>'phone',
    p_data->>'serviceCategory', p_data->>'specificService', (p_data->>'quantity')::integer,
    nullif(p_data->>'size',''), nullif(p_data->>'material',''), nullif(p_data->>'deadline','')::date,
    nullif(p_data->>'additionalRequirements',''), nullif(p_data->>'tshirtSize',''),
    nullif(p_data->>'tshirtColor',''), nullif(p_data->>'printLocation',''),
    p_artwork_path, p_artwork_name, p_artwork_size, p_artwork_mime,
    case when p_artwork_path is null then 'submitted' else 'pending_artwork' end,
    case when p_artwork_path is null then now() else null end
  ) returning * into result;
  return result;
end;
$$;

create function public.finish_quote_upload(p_id uuid, p_submission_key uuid)
returns public.quote_requests language plpgsql security definer set search_path = ''
as $$
declare result public.quote_requests;
begin
  update public.quote_requests set submission_state = 'submitted', submitted_at = now(), updated_at = now()
    where id = p_id and submission_key = p_submission_key and submission_state = 'pending_artwork'
    returning * into result;
  if found then return result; end if;
  select * into result from public.quote_requests where id = p_id and submission_key = p_submission_key and submission_state = 'submitted';
  return result;
end;
$$;

create function public.claim_quote_notification(p_id uuid)
returns public.quote_requests language plpgsql security definer set search_path = ''
as $$
declare result public.quote_requests;
begin
  update public.quote_requests set notification_state = 'sending', notification_attempts = notification_attempts + 1,
    notification_claim = gen_random_uuid(), notification_error = null, updated_at = now()
    where id = p_id and submission_state = 'submitted' and notification_state in ('pending','failed')
    returning * into result;
  return result;
end;
$$;

create function public.finish_quote_notification(p_id uuid, p_claim uuid, p_state text, p_error text default null)
returns boolean language plpgsql security definer set search_path = ''
as $$
begin
  if p_state not in ('sent','failed','uncertain') then raise exception 'Invalid notification state'; end if;
  update public.quote_requests set notification_state = p_state, notification_claim = null,
    notification_error = left(p_error, 300), notification_sent_at = case when p_state = 'sent' then now() else null end,
    updated_at = now()
    where id = p_id and notification_claim = p_claim and notification_state = 'sending';
  return found;
end;
$$;

revoke all on function public.create_quote_request(uuid,uuid,text,text,jsonb,text,text,integer,text) from public, anon, authenticated;
revoke all on function public.finish_quote_upload(uuid,uuid) from public, anon, authenticated;
revoke all on function public.claim_quote_notification(uuid) from public, anon, authenticated;
revoke all on function public.finish_quote_notification(uuid,uuid,text,text) from public, anon, authenticated;
grant execute on function public.create_quote_request(uuid,uuid,text,text,jsonb,text,text,integer,text) to service_role;
grant execute on function public.finish_quote_upload(uuid,uuid) to service_role;
grant execute on function public.claim_quote_notification(uuid) to service_role;
grant execute on function public.finish_quote_notification(uuid,uuid,text,text) to service_role;

alter table public.staff_members enable row level security;
alter table public.quote_requests enable row level security;
revoke all on public.staff_members, public.quote_requests from anon, authenticated;
grant select on public.staff_members to authenticated;
grant update (last_seen_at) on public.staff_members to authenticated;
grant select on public.quote_requests to authenticated;
grant update (status) on public.quote_requests to authenticated;
create policy staff_read_self on public.staff_members for select to authenticated using (user_id = (select auth.uid()));
create policy staff_update_self on public.staff_members for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy staff_read_quotes on public.quote_requests for select to authenticated using (submission_state = 'submitted' and (select public.is_staff()));
create policy staff_update_quotes on public.quote_requests for update to authenticated using (submission_state = 'submitted' and (select public.is_staff())) with check (submission_state = 'submitted' and (select public.is_staff()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('quote-artwork', 'quote-artwork', false, 10485760,
  array['application/pdf','image/png','image/jpeg','application/postscript','image/vnd.adobe.photoshop'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
create policy staff_read_quote_artwork on storage.objects for select to authenticated
  using (bucket_id = 'quote-artwork' and (select public.is_staff()));

-- Realtime honors the row policies above; anonymous subscribers see no quotes.
alter publication supabase_realtime add table public.quote_requests;
