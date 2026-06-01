-- Run in Supabase SQL editor after creating buckets in Dashboard:
-- Storage → New bucket: generated-pdfs (private)
-- Storage → New bucket: cv-uploads (private)

insert into storage.buckets (id, name, public)
values ('generated-pdfs', 'generated-pdfs', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('cv-uploads', 'cv-uploads', false)
on conflict (id) do nothing;

create policy "Users read own pdfs"
on storage.objects for select
using (
  bucket_id = 'generated-pdfs'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users upload own pdfs"
on storage.objects for insert
with check (
  bucket_id = 'generated-pdfs'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users update own pdfs"
on storage.objects for update
using (
  bucket_id = 'generated-pdfs'
  and auth.uid()::text = (storage.foldername(name))[1]
);
