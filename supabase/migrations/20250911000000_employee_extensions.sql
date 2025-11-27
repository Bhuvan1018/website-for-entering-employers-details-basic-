/*
  Employee extensions: passes, health, family members, duties
*/

create extension if not exists pgcrypto;

-- Passes
create table if not exists employee_passes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  pass_type text not null, -- e.g., Privilege, School, PTO
  train_type text not null, -- e.g., Local, Express, Mail, Rajdhani, Shatabdi
  origin text not null,
  destination text not null,
  issue_date date not null default (now() at time zone 'utc'),
  expiry_date date not null,
  status text not null default 'active', -- active | expired | revoked
  remarks text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table employee_passes enable row level security;

create policy "Users can view their own passes"
  on employee_passes for select
  to authenticated using (auth.uid() = user_id);

create policy "Users can insert their own passes"
  on employee_passes for insert
  to authenticated with check (auth.uid() = user_id);

create policy "Users can update their own passes"
  on employee_passes for update
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_employee_passes_user_id on employee_passes(user_id);
create index if not exists idx_employee_passes_expiry_date on employee_passes(expiry_date);

-- Health records
create table if not exists health_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  blood_group text,
  allergies text,
  chronic_conditions text,
  last_medical_check date,
  next_medical_due date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table health_records enable row level security;

create policy "Users can manage their own health records"
  on health_records for all
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_health_records_user_id on health_records(user_id);

-- Family members
create table if not exists family_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  full_name text not null,
  relation text not null, -- spouse, son, daughter, father, mother, other
  date_of_birth date,
  profile_image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table family_members enable row level security;

create policy "Users can manage their own family members"
  on family_members for all
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_family_members_user_id on family_members(user_id);

-- Storage bucket for family images
insert into storage.buckets (id, name, public)
values ('family-profiles', 'family-profiles', true)
on conflict (id) do nothing;

-- Storage policies for family images
create policy "Users can upload their family images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'family-profiles' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view family images"
  on storage.objects for select to authenticated
  using (bucket_id = 'family-profiles');

create policy "Users can update their family images"
  on storage.objects for update to authenticated
  using (bucket_id = 'family-profiles' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete their family images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'family-profiles' and auth.uid()::text = (storage.foldername(name))[1]);

-- Duty assignments
create table if not exists duty_assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null, -- e.g., Goods Guard, Station Master Duty
  location text,
  duty_date date not null,
  shift text, -- Morning / Evening / Night
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table duty_assignments enable row level security;

create policy "Users can view their own duty assignments"
  on duty_assignments for select to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert/update their own duty assignments"
  on duty_assignments for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update their own duty assignments"
  on duty_assignments for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_duty_assignments_user_id on duty_assignments(user_id);
create index if not exists idx_duty_assignments_date on duty_assignments(duty_date);


