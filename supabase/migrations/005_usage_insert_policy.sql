-- Allow users to log their own usage events (API uses user JWT, not service role)
create policy "own usage insert"
  on public.usage_events
  for insert
  with check (auth.uid() = user_id);
