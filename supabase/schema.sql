-- ═══════════════════════════════════════════════════════════════
--  ScaleForge Employee & Admin Portal — Supabase SQL Schema
--  Run this in Supabase → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1. PROFILES (extends auth.users)
create table public.profiles (
  id          uuid        references auth.users(id) on delete cascade primary key,
  email       text        not null,
  full_name   text,
  role        text        not null default 'employee'
                          check (role in ('admin', 'employee')),
  avatar_url  text,
  department        text,
  position          text,
  expected_time_in  text,
  expected_time_out text,
  created_at        timestamptz default now()
);

-- 2. TEAMS
create table public.teams (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  department  text,
  lead_id     uuid        references public.profiles(id),
  created_at  timestamptz default now()
);

-- 3. TEAM MEMBERS
create table public.team_members (
  id          uuid        primary key default gen_random_uuid(),
  team_id     uuid        references public.teams(id) on delete cascade,
  profile_id  uuid        references public.profiles(id) on delete cascade,
  joined_at   timestamptz default now(),
  unique(team_id, profile_id)
);

-- 4. TASKS
create table public.tasks (
  id            uuid        primary key default gen_random_uuid(),
  title         text        not null,
  description   text,
  status        text        not null default 'todo'
                            check (status in ('todo', 'in_progress', 'review', 'done')),
  priority      text        not null default 'medium'
                            check (priority in ('low', 'medium', 'high', 'urgent')),
  assigned_to   uuid        references public.profiles(id),
  assigned_team uuid        references public.teams(id),
  created_by    uuid        references public.profiles(id),
  deadline      timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 5. ATTENDANCE LOGS
create table public.attendance_logs (
  id          uuid        primary key default gen_random_uuid(),
  profile_id  uuid        references public.profiles(id) on delete cascade,
  event_type  text        not null
              check (event_type in ('time_in', 'break_start', 'break_end', 'time_out', 'absent')),
  timestamp   timestamptz default now(),
  date        date        default current_date,
  notes       text
);

-- 6. MEETINGS / CALENDAR EVENTS
create table public.meetings (
  id          uuid        primary key default gen_random_uuid(),
  title       text        not null,
  description text,
  start_time  timestamptz not null,
  end_time    timestamptz not null,
  created_by  uuid        references public.profiles(id),
  attendees   uuid[]      default '{}',
  color       text        default 'orange',
  created_at  timestamptz default now()
);

-- ═══════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

alter table public.profiles       enable row level security;
alter table public.teams          enable row level security;
alter table public.team_members   enable row level security;
alter table public.tasks          enable row level security;
alter table public.attendance_logs enable row level security;
alter table public.meetings       enable row level security;

-- PROFILES policies
create policy "Authenticated users can view all profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can insert profiles"
  on public.profiles for insert
  with check (true);

create policy "Admins can update profiles"
  on public.profiles for update
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

create policy "Admins can delete profiles"
  on public.profiles for delete
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- TEAMS policies
create policy "Authenticated users can view teams"
  on public.teams for select
  using (auth.role() = 'authenticated');

create policy "Admins can manage teams"
  on public.teams for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- TEAM MEMBERS policies
create policy "Authenticated users can view team members"
  on public.team_members for select
  using (auth.role() = 'authenticated');

create policy "Admins can manage team members"
  on public.team_members for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- TASKS policies
create policy "Authenticated users can view tasks"
  on public.tasks for select
  using (auth.role() = 'authenticated');

create policy "Admins can manage all tasks"
  on public.tasks for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

create policy "Employees can update their assigned tasks"
  on public.tasks for update
  using (assigned_to = auth.uid());

-- ATTENDANCE LOGS policies
create policy "Users can view own attendance"
  on public.attendance_logs for select
  using (profile_id = auth.uid());

create policy "Admins can view all attendance"
  on public.attendance_logs for select
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

create policy "Users can insert own attendance"
  on public.attendance_logs for insert
  with check (profile_id = auth.uid());

-- MEETINGS policies
create policy "Authenticated users can view meetings"
  on public.meetings for select
  using (auth.role() = 'authenticated');

create policy "Admins can manage meetings"
  on public.meetings for all
  using (exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  ));

-- ═══════════════════════════════════════════════════════════════
--  TRIGGER: Auto-create profile on auth.users insert
-- ═══════════════════════════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'employee')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════
--  TRIGGER: Auto-update updated_at on tasks
-- ═══════════════════════════════════════════════════════════════

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_task_updated
  before update on public.tasks
  for each row execute function public.handle_updated_at();

-- ═══════════════════════════════════════════════════════════════
--  SEED: Insert a default admin user record
--  (replace 'your-admin-uuid' with the UUID from auth.users)
-- ═══════════════════════════════════════════════════════════════
-- insert into public.profiles (id, email, full_name, role)
-- values ('your-admin-uuid', 'admin@scaleforge.com', 'Scale Forge Admin', 'admin');
