import { useRef, useState } from "react";
import { Copy, Grid3x3, List, Upload, Loader2, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

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
  { name: "campaign-bg.jpg", url: "/campaign-bg.jpg", disabled: true },
];

export type GalleryImage = { name: string; url: string; disabled?: boolean };

export function ImageGalleryManager() {
  const [copied, setCopied] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [images, setImages] = useState<GalleryImage[]>(DEFAULT_IMAGES);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      toast.success("Image URL copied");
      window.setTimeout(() => setCopied((prev: string | null) => (prev === url ? null : prev)), 1500);
    } catch {
      toast.error("Clipboard is unavailable in this browser");
    }
  };

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

  const visibleImages = images.filter((image) => !image.disabled);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Image Gallery</h1>
          <p className="text-sm text-muted-foreground">Manage and upload image assets for your website.</p>
        </div>
      </div>

      {/* Controls */}
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
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-2">
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Images
            </>
          )}
        </Button>

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

        <div className="text-sm text-muted-foreground ml-auto">
          {visibleImages.length} image{visibleImages.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {visibleImages.map((image) => (
            <Card key={image.url} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <img
                  src={image.url}
                  alt={image.name}
                  className="h-32 w-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => copyUrl(image.url)}
                  title="Click to copy URL"
                />
              </CardHeader>
              <CardContent className="space-y-2 p-3">
                <div className="flex items-start gap-2 min-h-[40px]">
                  <ImageIcon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-foreground truncate break-words">{image.name}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs h-7" onClick={() => copyUrl(image.url)}>
                  <Copy className="mr-1 h-3 w-3" />
                  {copied === image.url ? "Copied" : "Copy"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-2 border rounded-lg divide-y">
          {visibleImages.map((image) => (
            <div key={image.url} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
              <img
                src={image.url}
                alt={image.name}
                className="h-16 w-16 object-cover rounded border flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => copyUrl(image.url)}
                title="Click to copy URL"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{image.name}</p>
                <p className="text-xs text-muted-foreground truncate break-all mt-1">{image.url}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyUrl(image.url)} className="flex-shrink-0">
                <Copy className="h-4 w-4" />
                {copied === image.url ? "Copied" : "Copy"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
