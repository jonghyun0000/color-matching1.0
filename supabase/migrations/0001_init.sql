create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  name text not null,
  gender text not null check (gender in ('male','female')),
  school text not null check (school in ('강원대','한림대','성심대')),
  contact_type text not null check (contact_type in ('kakao','instagram')),
  contact_id text not null,
  student_id_image_path text,
  is_verified boolean not null default false,
  verification_status text not null default 'pending' check (verification_status in ('pending','approved','rejected')),
  role text not null default 'user' check (role in ('user','admin')),
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now()
);
create table public.teams (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  gender text not null check (gender in ('male','female')),
  intro text not null,
  status text not null default 'active' check (status in ('active','hidden','matched')),
  matched_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index one_active_team_per_owner on public.teams(owner_id) where status='active';
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  member_order int not null check(member_order between 1 and 3),
  school text not null check (school in ('강원대','한림대','성심대')),
  department text not null,
  student_number text not null,
  nickname text not null,
  smoking boolean not null,
  contact_type text not null check (contact_type in ('kakao','instagram')),
  contact_id text not null,
  created_at timestamptz not null default now(),
  unique(team_id, member_order)
);
create table public.match_requests (
  id uuid primary key default gen_random_uuid(),
  from_team_id uuid not null references public.teams(id) on delete cascade,
  to_team_id uuid not null references public.teams(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  unique(from_team_id,to_team_id)
);
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  nickname text not null,
  school text not null check (school in ('강원대','한림대','성심대')),
  rating int not null check(rating between 1 and 5),
  content text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.match_requests enable row level security;
alter table public.reviews enable row level security;

create function public.is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role='admin');
$$;

create policy "profiles self or admin" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles update self or admin" on public.profiles for update using (id=auth.uid() or public.is_admin());
create policy "profiles insert self" on public.profiles for insert with check (id=auth.uid());

create policy "teams visible opposite" on public.teams for select using (
  public.is_admin() or owner_id = auth.uid() or (
    status='active' and gender <> (select p.gender from public.profiles p where p.id=auth.uid())
  )
);
create policy "teams owner insert" on public.teams for insert with check (owner_id = auth.uid());
create policy "teams owner update" on public.teams for update using (owner_id = auth.uid() or public.is_admin());

create policy "team members owner/admin/matched" on public.team_members for select using (
  public.is_admin() or exists(select 1 from public.teams t where t.id=team_id and t.owner_id=auth.uid())
);
create policy "team members owner write" on public.team_members for all using (
  exists(select 1 from public.teams t where t.id=team_id and t.owner_id=auth.uid()) or public.is_admin()
) with check (
  exists(select 1 from public.teams t where t.id=team_id and t.owner_id=auth.uid()) or public.is_admin()
);

create policy "match request related" on public.match_requests for select using (
  public.is_admin() or exists(select 1 from public.teams t where t.id=from_team_id and t.owner_id=auth.uid()) or exists(select 1 from public.teams t where t.id=to_team_id and t.owner_id=auth.uid())
);
create policy "match request create" on public.match_requests for insert with check (
  exists(select 1 from public.teams t where t.id=from_team_id and t.owner_id=auth.uid()) and from_team_id<>to_team_id
);
create policy "match request respond" on public.match_requests for update using (
  exists(select 1 from public.teams t where t.id=to_team_id and t.owner_id=auth.uid()) or public.is_admin()
);

create policy "reviews approved public" on public.reviews for select using (status='approved' or user_id=auth.uid() or public.is_admin());
create policy "reviews own insert" on public.reviews for insert with check (user_id=auth.uid());
create policy "reviews own update" on public.reviews for update using (user_id=auth.uid() or public.is_admin());
