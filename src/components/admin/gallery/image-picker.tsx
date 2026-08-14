import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { listGalleryImages } from "@/lib/gallery";
import { useQuery } from "@tanstack/react-query";

export function ImagePicker({
  onSelect,
  label = "Choose from gallery",
}: {
  onSelect: (url: string) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const { data: images = [], isLoading } = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: listGalleryImages,
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-2">
          <ImageIcon className="h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select an image</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading gallery…</p>
        ) : (
          <div className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto p-1 sm:grid-cols-4">
            {images.map((image) => (
              <button
                key={image.url}
                type="button"
                onClick={() => {
                  onSelect(image.url);
                  setOpen(false);
                }}
                className="overflow-hidden rounded-md border text-left transition hover:ring-2 hover:ring-primary"
              >
                <img src={image.url} alt={image.name} className="h-24 w-full object-cover" />
                <span className="block truncate p-2 text-xs">{image.name}</span>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
