-- Fix signup 500: "Database error saving new user"
-- Cause: RLS policy "for all" blocked trigger insert when auth.uid() is null during signup.

drop policy if exists "own profile" on public.profiles;

create policy "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Recreate trigger function owned by postgres so SECURITY DEFINER bypasses RLS
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update set
    display_name = excluded.display_name,
    updated_at = now();
  return new;
exception
  when others then
    raise log 'handle_new_user failed for %: %', new.id, sqlerrm;
    raise;
end;
$$;

alter function public.handle_new_user() owner to postgres;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
