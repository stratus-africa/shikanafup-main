import { useRef, useState } from "react";
import { Copy, Grid3x3, List, Upload, Loader2, Image as ImageIcon, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DEFAULT_IMAGES = [
  { name: "unity-img.jpg", url: "/unity-img.jpg" },
  { name: "Sfu-login-bg.avif", url: "/Sfu-login-bg.avif" },
  { name: "sfu-image.jfif", url: "/sfu-image.jfif" },
  { name: "about-image.jpg", url: "/about-image.jpg" },
  { name: "about-img.jpeg", url: "/about-img.jpeg" },
  { name: "teamwork.jpg.jpeg", url: "/teamwork.jpg.jpeg" },
  { name: "nairobiPicture.jpg", url: "/nairobiPicture.jpg" },
  { name: "Servant.jpeg", url: "/Servant.jpeg" },
  { name: "Harvest.jpg.jpeg", url: "/Harvest.jpg.jpeg" },
  { name: "deer.gif", url: "/deer.gif" },
];

export type GalleryImage = { name: string; url: string; disabled?: boolean };

interface ImagePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

export function ImagePickerDialog({ open, onOpenChange, onSelect }: ImagePickerDialogProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [images, setImages] = useState<GalleryImage[]>(DEFAULT_IMAGES);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      const newImages = data.urls.map((url: string) => ({
        name: url.split("/").pop() || "image",
        url,
      }));

      setImages((prev: GalleryImage[]) => [...newImages, ...prev]);
      toast.success(`${newImages.length} image${newImages.length > 1 ? "s" : ""} uploaded`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSelectImage = (url: string) => {
    onSelect(url);
    onOpenChange(false);
  };

  const filteredImages = images.filter((image) =>
    image.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Image</DialogTitle>
          <DialogDescription>
            Choose an image from your gallery or upload new ones.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload and Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              size="sm"
              className="gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload
                </>
              )}
            </Button>

            {/* View Toggle */}
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Search */}
            <Input
              placeholder="Search images…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px]"
            />
          </div>

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid gap-3 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {filteredImages.map((image) => (
                <button
                  key={image.url}
                  onClick={() => handleSelectImage(image.url)}
                  className="group relative overflow-hidden rounded-lg border-2 border-transparent hover:border-primary transition-all"
                  title={image.name}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="h-24 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="rounded-full bg-primary text-white p-2">
                        <span className="text-sm font-semibold">Select</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="space-y-2 border rounded-lg divide-y max-h-[400px] overflow-y-auto">
              {filteredImages.map((image) => (
                <button
                  key={image.url}
                  onClick={() => handleSelectImage(image.url)}
                  className="w-full flex items-center gap-4 p-3 hover:bg-primary/10 transition-colors text-left"
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    className="h-12 w-12 object-cover rounded border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{image.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{image.url}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    Select
                  </Button>
                </button>
              ))}
            </div>
          )}

          {filteredImages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-4 opacity-40" />
              <p>No images found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
