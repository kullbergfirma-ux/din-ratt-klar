
create table public.site_texts (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text not null,
  updated_at timestamptz default now()
);

alter table public.site_texts enable row level security;

create policy "Anyone can read site texts"
  on public.site_texts for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can insert site texts"
  on public.site_texts for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update site texts"
  on public.site_texts for update
  to authenticated
  using (true)
  with check (true);
