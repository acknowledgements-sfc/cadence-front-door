-- Permanent waitlist storage (slice 24 front door).
-- HELD for Claude/Cowork apply on cadence-app — do not apply until live-proved.

create table if not exists waitlist (
  id           uuid primary key default gen_random_uuid(),
  answer_text  text not null,
  email        text,
  source       text not null default 'front-door',
  user_agent   text,
  created_at   timestamptz not null default now()
);

alter table waitlist enable row level security;

-- Anon may not read, update, or delete waitlist rows.

create or replace function waitlist_submit(
  p_answer_text text,
  p_user_agent text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  trimmed text;
  new_id uuid;
begin
  trimmed := trim(p_answer_text);

  if trimmed is null or trimmed = '' then
    raise exception 'answer required';
  end if;

  if char_length(trimmed) > 2000 then
    raise exception 'answer too long';
  end if;

  insert into waitlist (answer_text, user_agent)
  values (trimmed, left(p_user_agent, 512))
  returning id into new_id;

  return new_id;
end;
$$;

grant execute on function waitlist_submit(text, text) to anon;
