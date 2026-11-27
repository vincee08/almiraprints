-- Contact messages are separate from quote requests. Public customers can only
-- submit through the validated server endpoint; only staff can read rows.
create table public.contact_messages (
  id uuid primary key,
  reference text not null unique default ('AP-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  submission_key uuid not null unique,
  fingerprint text not null,
  ip_hash text not null,
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) <= 30),
  service_type text not null,
  message text not null check (char_length(message) between 10 and 2000),
  created_at timestamptz not null default now()
);

create index contact_messages_created_idx on public.contact_messages (created_at desc);
create index contact_messages_fingerprint_idx on public.contact_messages (fingerprint, created_at desc);
create index contact_messages_ip_idx on public.contact_messages (ip_hash, created_at desc);

create function public.create_contact_message(
  p_id uuid, p_submission_key uuid, p_fingerprint text, p_ip_hash text, p_data jsonb
) returns public.contact_messages
language plpgsql security definer set search_path = ''
as $$
declare result public.contact_messages;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_ip_hash, 3));
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_fingerprint, 4));
  select * into result from public.contact_messages where submission_key = p_submission_key;
  if found then return result; end if;
  select * into result from public.contact_messages
    where fingerprint = p_fingerprint and created_at > now() - interval '5 minutes'
    order by created_at desc limit 1;
  if found then return result; end if;
  if (select count(*) from public.contact_messages where ip_hash = p_ip_hash and created_at > now() - interval '1 hour') >= 8 then
    raise exception 'CONTACT_RATE_LIMIT' using errcode = 'P0001';
  end if;
  insert into public.contact_messages (
    id, submission_key, fingerprint, ip_hash, full_name, email, phone, service_type, message
  ) values (
    p_id, p_submission_key, p_fingerprint, p_ip_hash,
    p_data->>'fullName', p_data->>'email', p_data->>'phone',
    p_data->>'serviceType', p_data->>'message'
  ) returning * into result;
  return result;
end;
$$;

revoke all on function public.create_contact_message(uuid,uuid,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.create_contact_message(uuid,uuid,text,text,jsonb) to service_role;

alter table public.contact_messages enable row level security;
revoke all on public.contact_messages from anon, authenticated;
grant select on public.contact_messages to authenticated;
create policy staff_read_contacts on public.contact_messages for select to authenticated
  using ((select public.is_staff()));
