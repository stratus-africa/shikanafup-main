import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import { SiteHeader } from "@/components/site-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { listSettings, upsertSetting, deleteSetting } from "@/lib/admin/settings.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SITE_DEFAULTS } from "@/hooks/use-site-settings";
import { ImagePicker } from "@/components/admin/gallery/image-picker";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

function CampaignPopupCard({
  settings,
  onSave,
  saving,
}: {
  settings: any[];
  onSave: (v: { key: string; value: string }) => void;
  saving: boolean;
}) {
  const valueOf = (key: string) => {
    const row = settings.find((s) => s.key === key);
    if (!row) return (SITE_DEFAULTS as any)[key] ?? "";
    return typeof row.value === "string" ? row.value : String(row.value ?? "");
  };

  const [popupImage, setPopupImage] = useState<string>(valueOf("campaign_popup.image_url"));

  const saveAll = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const updates = [
      ["campaign_popup.enabled", String(fd.get("enabled") === "on")],
      ["campaign_popup.image_url", popupImage],
      ["campaign_popup.title", String(fd.get("title") ?? "")],
      ["campaign_popup.body", String(fd.get("body") ?? "")],
      ["campaign_popup.primary_cta_label", String(fd.get("primary_cta_label") ?? "")],
      ["campaign_popup.primary_cta_url", String(fd.get("primary_cta_url") ?? "")],
      ["campaign_popup.secondary_cta_label", String(fd.get("secondary_cta_label") ?? "")],
      ["campaign_popup.dismiss_hours", String(fd.get("dismiss_hours") ?? "24")],
    ] as const;

    updates.forEach(([key, value]) => onSave({ key, value: String(value) }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Campaign popup</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Update the homepage campaign popup that appears after the page loads.
        </p>

        <form onSubmit={saveAll} className="space-y-4">
          <div className="flex items-center gap-3 rounded-md border p-3">
            <input
              id="campaign-enabled"
              name="enabled"
              type="checkbox"
              defaultChecked={String(valueOf("campaign_popup.enabled")).toLowerCase() === "true"}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="campaign-enabled">Enable popup on the public website</Label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="campaign-image_url">Banner image</Label>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  id="campaign-image_url"
                  name="image_url"
                  value={popupImage}
                  onChange={(e) => setPopupImage(e.target.value)}
                  className="min-w-[240px] flex-1"
                />
                <ImagePicker onSelect={setPopupImage} label="Select from gallery" />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="campaign-title">Popup title</Label>
              <Input id="campaign-title" name="title" defaultValue={valueOf("campaign_popup.title")} />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="campaign-body">Popup description</Label>
              <Textarea id="campaign-body" name="body" rows={3} defaultValue={valueOf("campaign_popup.body")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="campaign-primary_cta_label">Primary CTA label</Label>
              <Input
                id="campaign-primary_cta_label"
                name="primary_cta_label"
                defaultValue={valueOf("campaign_popup.primary_cta_label")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="campaign-primary_cta_url">Primary CTA URL</Label>
              <Input
                id="campaign-primary_cta_url"
                name="primary_cta_url"
                defaultValue={valueOf("campaign_popup.primary_cta_url")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="campaign-secondary_cta_label">Secondary CTA label</Label>
              <Input
                id="campaign-secondary_cta_label"
                name="secondary_cta_label"
                defaultValue={valueOf("campaign_popup.secondary_cta_label")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="campaign-dismiss_hours">Dismiss interval (hours)</Label>
              <Input
                id="campaign-dismiss_hours"
                name="dismiss_hours"
                type="number"
                min={1}
                defaultValue={valueOf("campaign_popup.dismiss_hours")}
              />
            </div>
          </div>

          {popupImage && (
            <div className="rounded-md border bg-slate-50 p-3">
              <img
                src={popupImage}
                alt="Campaign popup preview"
                className="mx-auto max-h-48 rounded-md object-cover"
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" variant="default" disabled={saving}>
              {saving ? "Saving…" : "Save popup settings"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const SITE_FIELDS: { key: keyof typeof SITE_DEFAULTS; label: string }[] = [
  { key: "site.logo_url", label: "Website logo URL" },
  { key: "site.site_name", label: "Website name" },
  { key: "site.tagline", label: "Tagline" },
  { key: "site.contact_email", label: "Primary email" },
  { key: "site.contact_email_alt", label: "Secondary email" },
  { key: "site.contact_phone", label: "Phone number" },
  { key: "site.postal_address", label: "Postal address" },
  { key: "site.physical_address", label: "Physical address" },
  { key: "site.physical_address_line2", label: "Physical address (line 2)" },
  { key: "site.facebook_url", label: "Facebook URL" },
  { key: "site.twitter_url", label: "Twitter / X URL" },
  { key: "site.instagram_url", label: "Instagram URL" },
  { key: "site.youtube_url", label: "YouTube URL" },
];

function SiteBrandingCard({
  settings,
  onSave,
  saving,
}: {
  settings: any[];
  onSave: (v: { key: string; value: string }) => void;
  saving: boolean;
}) {
  const valueOf = (key: string) => {
    const row = settings.find((s) => s.key === key);
    if (!row) return (SITE_DEFAULTS as any)[key] ?? "";
    return typeof row.value === "string" ? row.value : String(row.value ?? "");
  };
  const [logoUrl, setLogoUrl] = useState<string>(valueOf("site.logo_url"));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Website logo &amp; contact details</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">These values appear in the website header and footer.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SITE_FIELDS.map((f) =>
            f.key === "site.logo_url" ? (
              <form
                key={f.key}
                className="space-y-1.5 sm:col-span-2 lg:col-span-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSave({ key: f.key, value: logoUrl });
                }}
              >
                <Label htmlFor={f.key}>{f.label}</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    id={f.key}
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="min-w-[240px] flex-1"
                  />
                  <ImagePicker onSelect={setLogoUrl} label="Select from gallery" />
                  <Button type="submit" variant="outline" size="sm" disabled={saving}>
                    Save
                  </Button>
                </div>
              </form>
            ) : (
            <form
              key={f.key}
              className="space-y-1.5"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                onSave({ key: f.key, value: String(fd.get("value") ?? "") });
              }}
            >
              <Label htmlFor={f.key}>{f.label}</Label>
              <div className="flex gap-2">
                <Input id={f.key} name="value" defaultValue={valueOf(f.key)} />
                <Button type="submit" variant="outline" size="sm" disabled={saving}>
                  Save
                </Button>
              </div>
            </form>
            ),
          )}
        </div>
        {logoUrl && (
          <div className="mt-6 flex items-center gap-3 rounded-md border p-3">
            <img src={logoUrl} alt="Current website logo" className="h-12 w-12 object-contain" />
            <span className="text-xs text-muted-foreground">Current logo preview</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const Route = createFileRoute("/_authenticated/admin/ui/settings")({
  component: Page,
});

function Page() {
  const qc = useQueryClient();
  const list = useServerFn(listSettings);
  const upsert = useServerFn(upsertSetting);
  const del = useServerFn(deleteSetting);
  const [open, setOpen] = useState(false);

  const { data = [], isLoading } = useQuery({ queryKey: ["admin", "settings"], queryFn: () => list() });
  const inv = () => qc.invalidateQueries({ queryKey: ["admin", "settings"] });
  const upsertMut = useMutation({
    mutationFn: (v: any) => upsert({ data: v }),
    onSuccess: () => {
      inv();
      toast.success("Saved");
      setOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });
  const delMut = useMutation({
    mutationFn: (key: string) => del({ data: { key } }),
    onSuccess: () => {
      inv();
      toast.success("Deleted");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <>
      <SiteHeader title="Settings" />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <SiteBrandingCard settings={data as any[]} onSave={(v) => upsertMut.mutate(v)} saving={upsertMut.isPending} />

        <CampaignPopupCard settings={data as any[]} onSave={(v) => upsertMut.mutate(v)} saving={upsertMut.isPending} />

        <Collapsible open={kvOpen} onOpenChange={setKvOpen} className="rounded-md border">
        <div className="flex justify-between items-center gap-3 p-3">
          <CollapsibleTrigger asChild>
            <button type="button" className="flex items-center gap-2 text-sm font-medium">
              <ChevronDown className={`h-4 w-4 transition-transform ${kvOpen ? "" : "-rotate-90"}`} />
              Key-value site configuration
              <span className="text-xs font-normal text-muted-foreground">({(data as any[]).length})</span>
            </button>
          </CollapsibleTrigger>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Setting
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New / Update Setting</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  let parsed: any;
                  try {
                    parsed = JSON.parse(String(fd.get("value")));
                  } catch {
                    parsed = fd.get("value");
                  }
                  upsertMut.mutate({ key: fd.get("key"), value: parsed });
                }}
                className="space-y-3"
              >
                <div>
                  <Label>Key</Label>
                  <Input name="key" required />
                </div>
                <div>
                  <Label>Value (JSON or text)</Label>
                  <Textarea name="value" rows={6} required />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={upsertMut.isPending}>
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <CollapsibleContent className="border-t">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ) : (data as any[]).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    No settings yet.
                  </TableCell>
                </TableRow>
              ) : (
                (data as any[]).map((s) => (
                  <TableRow key={s.key}>
                    <TableCell className="font-mono text-xs">{s.key}</TableCell>
                    <TableCell className="font-mono text-xs max-w-md truncate">
                      {typeof s.value === "string" ? s.value : JSON.stringify(s.value)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {s.updated_at ? new Date(s.updated_at).toLocaleString() : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" onClick={() => delMut.mutate(s.key)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
}
