import { supabase } from "@/integrations/supabase/client";

export const GALLERY_BUCKET = "gallery";

export type GalleryImage = { name: string; url: string; builtin?: boolean };

/** Images that ship with the site and cannot be deleted. */
export const BUILTIN_IMAGES: GalleryImage[] = [
  { name: "unity-img.jpg", url: "/unity-img.jpg", builtin: true },
  { name: "Sfu-login-bg.avif", url: "/Sfu-login-bg.avif", builtin: true },
  { name: "sfu-image.jfif", url: "/sfu-image.jfif", builtin: true },
  { name: "about-image.jpg", url: "/about-image.jpg", builtin: true },
  { name: "about-img.jpeg", url: "/about-img.jpeg", builtin: true },
  { name: "teamwork.jpg.jpeg", url: "/teamwork.jpg.jpeg", builtin: true },
  { name: "nairobiPicture.jpg", url: "/nairobiPicture.jpg", builtin: true },
  { name: "Servant.jpeg", url: "/Servant.jpeg", builtin: true },
  { name: "Harvest.jpg.jpeg", url: "/Harvest.jpg.jpeg", builtin: true },
  { name: "deer.gif", url: "/deer.gif", builtin: true },
  { name: "SFU-LOGO.png", url: "/SFU-LOGO.png", builtin: true },
];

export const galleryUrl = (path: string) => `/api/public/gallery/${path}`;

export async function listGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase.storage
    .from(GALLERY_BUCKET)
    .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
  if (error) throw new Error(error.message);
  const uploaded = (data ?? [])
    .filter((f) => f.id)
    .map((f) => ({ name: f.name, url: galleryUrl(f.name) }));
  return [...uploaded, ...BUILTIN_IMAGES];
}

export async function uploadGalleryImages(files: File[]): Promise<GalleryImage[]> {
  const out: GalleryImage[] = [];
  for (const file of files) {
    const safe = file.name.replace(/[^a-zA-Z0-9.-]/g, "_").toLowerCase();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
    const { error } = await supabase.storage.from(GALLERY_BUCKET).upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (error) throw new Error(error.message);
    out.push({ name: path, url: galleryUrl(path) });
  }
  return out;
}

export async function deleteGalleryImage(name: string) {
  const { error } = await supabase.storage.from(GALLERY_BUCKET).remove([name]);
  if (error) throw new Error(error.message);
}
