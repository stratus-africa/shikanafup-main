import { supabase } from "@/integrations/supabase/client";

export const GALLERY_BUCKET = "gallery";
export const GALLERY_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
export const GALLERY_ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"] as const;
export const GALLERY_UPLOAD_ACCEPT = GALLERY_ACCEPTED_TYPES.join(",");

export type GalleryImage = { name: string; url: string; builtin?: boolean };

const extensionForType: Record<(typeof GALLERY_ACCEPTED_TYPES)[number], string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/gif": ["gif"],
  "image/avif": ["avif"],
};

/** Throws a helpful error before an unsupported or over-size upload reaches storage. */
export function validateGalleryFiles(files: File[]): File[] {
  if (!files.length) throw new Error("Choose at least one image to upload.");

  const errors = files.flatMap((file) => {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    const allowedType = GALLERY_ACCEPTED_TYPES.includes(file.type as (typeof GALLERY_ACCEPTED_TYPES)[number]);
    const extensionMatches =
      allowedType && extensionForType[file.type as (typeof GALLERY_ACCEPTED_TYPES)[number]].includes(extension);
    if (!allowedType || !extensionMatches) {
      return [`${file.name}: use a JPG, PNG, WebP, GIF, or AVIF image.`];
    }
    if (file.size > GALLERY_MAX_FILE_SIZE_BYTES) {
      return [`${file.name}: images must be 10 MB or smaller.`];
    }
    return [];
  });

  if (errors.length) throw new Error(errors.join(" "));
  return files;
}

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
  const uploaded = (data ?? []).filter((f) => f.id).map((f) => ({ name: f.name, url: galleryUrl(f.name) }));
  return [...uploaded, ...BUILTIN_IMAGES];
}

export async function uploadGalleryImages(files: File[]): Promise<GalleryImage[]> {
  validateGalleryFiles(files);
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
