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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Website logo &amp; contact details</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          These values appear in the website header and footer.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SITE_FIELDS.map((f) => (
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
          ))}
        </div>
        {valueOf("site.logo_url") && (
          <div className="mt-6 flex items-center gap-3 rounded-md border p-3">
            <img
              src={valueOf("site.logo_url")}
              alt="Current website logo"
              className="h-12 w-12 object-contain"
            />
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

  const { data = [], isLoading } = useQuery({ queryKey: ["admin","settings"], queryFn: () => list() });
  const inv = () => qc.invalidateQueries({ queryKey: ["admin","settings"] });
  const upsertMut = useMutation({ mutationFn: (v: any) => upsert({ data: v }), onSuccess: () => { inv(); toast.success("Saved"); setOpen(false); }, onError: (e: any) => toast.error(e.message) });
  const delMut = useMutation({ mutationFn: (key: string) => del({ data: { key } }), onSuccess: () => { inv(); toast.success("Deleted"); }, onError: (e: any) => toast.error(e.message) });

  return (
    <>
      <SiteHeader title="Settings" />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <SiteBrandingCard
          settings={data as any[]}
          onSave={(v) => upsertMut.mutate(v)}
          saving={upsertMut.isPending}
        />

        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">Key-value site configuration.</p>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />New Setting</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New / Update Setting</DialogTitle></DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                let parsed: any;
                try { parsed = JSON.parse(String(fd.get("value"))); } catch { parsed = fd.get("value"); }
                upsertMut.mutate({ key: fd.get("key"), value: parsed });
              }} className="space-y-3">
                <div><Label>Key</Label><Input name="key" required /></div>
                <div><Label>Value (JSON or text)</Label><Textarea name="value" rows={6} required /></div>
                <DialogFooter><Button type="submit" disabled={upsertMut.isPending}>Save</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader><TableRow><TableHead>Key</TableHead><TableHead>Value</TableHead><TableHead>Updated</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {isLoading ? <TableRow><TableCell colSpan={4}><Skeleton className="h-6 w-full" /></TableCell></TableRow>
                : (data as any[]).length === 0 ? <TableRow><TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">No settings yet.</TableCell></TableRow>
                : (data as any[]).map((s) => (
                  <TableRow key={s.key}>
                    <TableCell className="font-mono text-xs">{s.key}</TableCell>
                    <TableCell className="font-mono text-xs max-w-md truncate">{typeof s.value === "string" ? s.value : JSON.stringify(s.value)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{s.updated_at ? new Date(s.updated_at).toLocaleString() : "—"}</TableCell>
                    <TableCell className="text-right"><Button size="icon" variant="ghost" onClick={() => delMut.mutate(s.key)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
