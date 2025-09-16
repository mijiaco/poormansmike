-- RLS policies
drop policy if exists "trades_owner_access" on public.trades;
create policy "trades_owner_access"
  on public.trades for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- candidates are read-only to all authenticated users
drop policy if exists "candidates_read" on public.candidates;
create policy "candidates_read"
  on public.candidates for select
  to authenticated
  using (true);



