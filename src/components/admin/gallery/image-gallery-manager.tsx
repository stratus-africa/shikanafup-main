import { useState } from "react";
import { Copy, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const LOCAL_IMAGES = [
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

export function ImageGalleryManager() {
  const [copied, setCopied] = useState<string | null>(null);

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

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Image Gallery</h1>
          <p className="text-sm text-muted-foreground">Manage local image assets stored in the public folder.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {LOCAL_IMAGES.filter((image) => !image.disabled).map((image) => (
          <Card key={image.url} className="overflow-hidden">
            <CardHeader className="p-0">
              <img src={image.url} alt={image.name} className="h-48 w-full object-cover" />
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ImageIcon className="h-4 w-4 text-primary" />
                <span className="truncate">{image.name}</span>
              </div>
              <div className="rounded-md border bg-muted/40 p-2 text-xs text-muted-foreground break-all">{image.url}</div>
              <Button variant="outline" size="sm" className="w-full" onClick={() => copyUrl(image.url)}>
                <Copy className="mr-2 h-4 w-4" />
                {copied === image.url ? "Copied" : "Copy URL"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
