-- Alagu Vacations: initial schema
-- Tables: admin_users, site_settings, vehicles, packages, gallery_items, enquiries
-- Public visitors can only READ active content and SUBMIT enquiries (via submit_enquiry()).
-- Everything else requires an authenticated user listed in admin_users.


-- ---------------------------------------------------------------------------
-- Admin membership
-- ---------------------------------------------------------------------------
create table public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  role       text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create policy "admins can read admin list" on public.admin_users
  for select to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Site settings (single row)
-- ---------------------------------------------------------------------------
create table public.site_settings (
  id             int primary key default 1 check (id = 1),
  business_name  text not null default 'Alagu Vacations',
  tagline        text,
  phone          text,
  whatsapp       text,
  email          text,
  address        text,
  city           text,
  instagram_url  text,
  about_text     text,
  since_text     text,
  map_query      text,
  updated_at     timestamptz not null default now()
);
create trigger site_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();
alter table public.site_settings enable row level security;
create policy "anyone can read settings" on public.site_settings
  for select to anon, authenticated using (true);
create policy "admins manage settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Vehicles
-- ---------------------------------------------------------------------------
create table public.vehicles (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 120),
  model       text,
  seats       int check (seats is null or seats between 1 and 80),
  facilities  text[] not null default '{}',
  trip_types  text[] not null default '{}',
  description text,
  image_url   text,
  photos      text[] not null default '{}',
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger vehicles_updated before update on public.vehicles
  for each row execute function public.set_updated_at();
alter table public.vehicles enable row level security;
create policy "anyone can read active vehicles" on public.vehicles
  for select to anon, authenticated using (is_active or public.is_admin());
create policy "admins manage vehicles" on public.vehicles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Travel packages (none published yet: business adds them from the dashboard)
-- ---------------------------------------------------------------------------
create table public.packages (
  id          uuid primary key default gen_random_uuid(),
  title       text not null check (char_length(title) between 2 and 160),
  destination text,
  duration    text,
  highlights  text[] not null default '{}',
  price       numeric(10,2) check (price is null or price >= 0),
  price_note  text,
  image_url   text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger packages_updated before update on public.packages
  for each row execute function public.set_updated_at();
alter table public.packages enable row level security;
create policy "anyone can read active packages" on public.packages
  for select to anon, authenticated using (is_active or public.is_admin());
create policy "admins manage packages" on public.packages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Gallery
-- ---------------------------------------------------------------------------
create table public.gallery_items (
  id           uuid primary key default gen_random_uuid(),
  image_url    text not null,
  storage_path text,
  caption      text,
  sort_order   int not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);
alter table public.gallery_items enable row level security;
create policy "anyone can read active gallery" on public.gallery_items
  for select to anon, authenticated using (is_active or public.is_admin());
create policy "admins manage gallery" on public.gallery_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Booking enquiries
-- ---------------------------------------------------------------------------
create table public.enquiries (
  id                 uuid primary key default gen_random_uuid(),
  reference          text not null unique,
  full_name          text not null check (char_length(full_name) between 2 and 100),
  mobile             text not null check (mobile ~ '^[6-9][0-9]{9}$'),
  email              text check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  pickup_location    text not null check (char_length(pickup_location) between 2 and 160),
  destination        text not null check (char_length(destination) between 2 and 160),
  pickup_date        date not null,
  return_date        date,
  passengers         int not null check (passengers between 1 and 80),
  vehicle_preference text,
  trip_type          text,
  notes              text check (notes is null or char_length(notes) <= 1500),
  status             text not null default 'pending'
                       check (status in ('pending', 'contacted', 'confirmed', 'cancelled')),
  admin_notes        text,
  consent_at         timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint return_after_pickup check (return_date is null or return_date >= pickup_date)
);
create index enquiries_created_idx on public.enquiries (created_at desc);
create index enquiries_status_idx on public.enquiries (status);
create index enquiries_mobile_idx on public.enquiries (mobile, created_at);
create trigger enquiries_updated before update on public.enquiries
  for each row execute function public.set_updated_at();
alter table public.enquiries enable row level security;
-- No anon policies: the public can never read enquiries.
create policy "admins read enquiries" on public.enquiries
  for select to authenticated using (public.is_admin());
create policy "admins update enquiries" on public.enquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete enquiries" on public.enquiries
  for delete to authenticated using (public.is_admin());

-- Public submission path: validates, rate-limits per mobile, generates a reference.
create or replace function public.submit_enquiry(
  p_full_name text,
  p_mobile text,
  p_email text,
  p_pickup_location text,
  p_destination text,
  p_pickup_date date,
  p_return_date date,
  p_passengers int,
  p_vehicle_preference text,
  p_trip_type text,
  p_notes text
) returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ref text;
  v_recent int;
  v_today date := (now() at time zone 'Asia/Kolkata')::date;
begin
  if p_pickup_date < v_today then
    raise exception 'Pickup date cannot be in the past' using errcode = '22023';
  end if;
  if p_pickup_date > v_today + 730 then
    raise exception 'Pickup date is too far ahead' using errcode = '22023';
  end if;

  select count(*) into v_recent from public.enquiries
   where mobile = p_mobile and created_at > now() - interval '1 hour';
  if v_recent >= 5 then
    raise exception 'Too many enquiries from this number. Please call us instead.' using errcode = 'P0001';
  end if;

  loop
    v_ref := 'AV-' || to_char(now() at time zone 'Asia/Kolkata', 'YYMMDD') || '-'
             || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 5));
    exit when not exists (select 1 from public.enquiries where reference = v_ref);
  end loop;

  insert into public.enquiries (
    reference, full_name, mobile, email, pickup_location, destination,
    pickup_date, return_date, passengers, vehicle_preference, trip_type, notes
  ) values (
    v_ref, trim(p_full_name), p_mobile, nullif(trim(p_email), ''), trim(p_pickup_location), trim(p_destination),
    p_pickup_date, p_return_date, p_passengers, nullif(p_vehicle_preference, ''), nullif(p_trip_type, ''),
    nullif(trim(p_notes), '')
  );
  return v_ref;
end;
$$;
revoke all on function public.submit_enquiry(text, text, text, text, text, date, date, int, text, text, text) from public;
grant execute on function public.submit_enquiry(text, text, text, text, text, date, date, int, text, text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage bucket for admin uploads (public read, admin write)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "public read media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');
create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
