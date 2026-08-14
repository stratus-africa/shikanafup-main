import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Grid3x3, List, Upload, Loader2, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  type GalleryImage,
  deleteGalleryImage,
  listGalleryImages,
  uploadGalleryImages,
} from "@/lib/gallery";

export type { GalleryImage };

export function useGalleryImages() {
  return useQuery({ queryKey: ["admin", "gallery"], queryFn: listGalleryImages });
}

export function ImageGalleryManager() {
  const qc = useQueryClient();
  const [copied, setCopied] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: images = [], isLoading } = useGalleryImages();

  const uploadMut = useMutation({
    mutationFn: (files: File[]) => uploadGalleryImages(files),
    onSuccess: (added) => {
      qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
      toast.success(`${added.length} image${added.length > 1 ? "s" : ""} uploaded`);
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to upload images"),
    onSettled: () => {
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  const deleteMut = useMutation({
    mutationFn: (name: string) => deleteGalleryImage(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "gallery"] });
      toast.success("Image deleted");
      setDeleteTarget(null);
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to delete image"),
  });

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      toast.success("Image URL copied");
      window.setTimeout(() => setCopied((prev) => (prev === url ? null : prev)), 1500);
    } catch {
      toast.error("Clipboard is unavailable in this browser");
    }
  };

  const onFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) uploadMut.mutate(files);
  };

  const uploading = uploadMut.isPending;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Image Gallery</h1>
        <p className="text-sm text-muted-foreground">Upload, copy and delete image assets for your website.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={onFiles}
          disabled={uploading}
          className="hidden"
        />
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-2">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Upload Images"}
        </Button>

        <div className="flex items-center gap-1 rounded-md border p-1">
          <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4" />
          </Button>
        </div>

        <div className="ml-auto text-sm text-muted-foreground">
          {isLoading ? "Loading…" : `${images.length} image${images.length !== 1 ? "s" : ""}`}
        </div>
      </div>

      {viewMode === "grid" && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {images.map((image) => (
            <Card key={image.url} className="group relative overflow-hidden transition-shadow hover:shadow-lg">
              <CardHeader className="relative p-0">
                <img
                  src={image.url}
                  alt={image.name}
                  className="h-32 w-full cursor-pointer object-cover transition-opacity hover:opacity-80"
                  onClick={() => copyUrl(image.url)}
                  title="Click to copy URL"
                />
                {!image.builtin && (
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(image)}
                    className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                    title="Delete image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </CardHeader>
              <CardContent className="space-y-2 p-3">
                <div className="flex min-h-[40px] items-start gap-2">
                  <ImageIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="truncate break-words text-xs font-medium">{image.name}</span>
                </div>
                <Button variant="outline" size="sm" className="h-7 w-full text-xs" onClick={() => copyUrl(image.url)}>
                  <Copy className="mr-1 h-3 w-3" />
                  {copied === image.url ? "Copied" : "Copy"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewMode === "list" && (
        <div className="divide-y rounded-lg border">
          {images.map((image) => (
            <div key={image.url} className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50">
              <img
                src={image.url}
                alt={image.name}
                className="h-16 w-16 flex-shrink-0 cursor-pointer rounded border object-cover"
                onClick={() => copyUrl(image.url)}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{image.name}</p>
                <p className="mt-1 truncate break-all text-xs text-muted-foreground">{image.url}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => copyUrl(image.url)}>
                <Copy className="h-4 w-4" />
                {copied === image.url ? "Copied" : "Copy"}
              </Button>
              {!image.builtin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(image)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete image</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.name} will be permanently removed from the gallery. Pages still using it will show a
              broken image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMut.mutate(deleteTarget.name)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMut.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
