CREATE POLICY "gallery read authenticated" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'gallery');
CREATE POLICY "gallery insert authenticated" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "gallery update authenticated" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery') WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "gallery delete authenticated" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery');