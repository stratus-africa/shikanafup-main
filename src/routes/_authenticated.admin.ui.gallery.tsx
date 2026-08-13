import { createFileRoute } from "@tanstack/react-router";
import { ImageGalleryManager } from "@/components/admin/gallery/image-gallery-manager";

export const Route = createFileRoute("/_authenticated/admin/ui/gallery")({
  ssr: false,
  component: ImageGalleryManager,
  head: () => ({
    meta: [
      { title: "Image Gallery | SFUP Admin" },
      { name: "description", content: "Browse and copy local image URLs for the public website." },
    ],
  }),
});
