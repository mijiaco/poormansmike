-- trades table
create table if not exists public.trades (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  ticker text not null,
  long_call_expiry date not null,
  long_call_strike numeric not null,
  long_call_price numeric not null,
  short_call_expiry date not null,
  short_call_strike numeric not null,
  short_call_price numeric not null,
  contracts integer not null default 1,
  created_at timestamp with time zone not null default now()
);

-- candidates table (shared, refreshed by scheduled job)
create table if not exists public.candidates (
  id uuid primary key default uuid_generate_v4(),
  ticker text not null,
  underlying_price numeric,
  long_call_expiry date,
  long_call_strike numeric,
  long_call_price numeric not null,
  short_call_expiry date,
  short_call_strike numeric,
  short_call_price numeric not null,
  monthly_yield numeric not null,
  annual_simple numeric,
  annual_compound numeric,
  score numeric not null default 0,
  last_updated timestamp with time zone not null default now()
);

alter table public.trades enable row level security;
alter table public.candidates enable row level security;


