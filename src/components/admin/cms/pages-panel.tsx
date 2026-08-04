import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import { Save } from "lucide-react";
import { listSettings, upsertSetting } from "@/lib/admin/settings.functions";
import { CMS_PAGES } from "@/lib/cms-pages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PagesPanel() {
  const qc = useQueryClient();
  const list = useServerFn(listSettings);
  const save = useServerFn(upsertSetting);

  const settings = useQuery({ queryKey: ["cms-settings"], queryFn: () => list() });
  const [pageKey, setPageKey] = useState(CMS_PAGES[0]!.key);
  const page = useMemo(() => CMS_PAGES.find((p) => p.key === pageKey)!, [pageKey]);

  const stored = useMemo(() => {
    const map: Record<string, string> = {};
    for (const row of (settings.data as any[]) ?? []) {
      const v = (row as any).value;
      map[(row as any).key] = typeof v === "string" ? v : v == null ? "" : String(v);
    }
    return map;
  }, [settings.data]);

  const [draft, setDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const f of page.fields) {
      next[`page.${page.key}.${f.key}`] = stored[`page.${page.key}.${f.key}`] ?? f.default;
    }
    next[`seo.${page.key}.title`] = stored[`seo.${page.key}.title`] ?? page.seo.title;
    next[`seo.${page.key}.description`] =
      stored[`seo.${page.key}.description`] ?? page.seo.description;
    next[`seo.${page.key}.image`] = stored[`seo.${page.key}.image`] ?? page.seo.image ?? "";
    setDraft(next);
  }, [page, stored]);

  const set = (key: string, value: string) => setDraft((d) => ({ ...d, [key]: value }));

  const mutation = useMutation({
    mutationFn: async () => {
      for (const [key, value] of Object.entries(draft)) {
        await save({ data: { key, value } });
      }
    },
    onSuccess: () => {
      toast.success(`${page.label} page saved`);
      qc.invalidateQueries({ queryKey: ["cms-settings"] });
      qc.invalidateQueries({ queryKey: ["public", "page-content"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not save page"),
  });

  const titleLen = (draft[`seo.${page.key}.title`] ?? "").length;
  const descLen = (draft[`seo.${page.key}.description`] ?? "").length;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <CardTitle>Page editor</CardTitle>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              Editing <span className="font-medium">{page.label}</span> — {page.path}
            </p>
          </div>
          <Button size="sm" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            <Save className="mr-1 size-4" />
            {mutation.isPending ? "Saving…" : "Save page"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="max-w-sm">
            <Label htmlFor="cms-page-select">Page</Label>
            <Select value={pageKey} onValueChange={setPageKey}>
              <SelectTrigger id="cms-page-select" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CMS_PAGES.map((p) => (
                  <SelectItem key={p.key} value={p.key}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Page content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {page.fields.map((f) => {
              const key = `page.${page.key}.${f.key}`;
              return (
                <div key={key}>
                  <Label htmlFor={key}>{f.label}</Label>
                  {f.type === "textarea" ? (
                    <Textarea
                      id={key}
                      className="mt-1"
                      rows={3}
                      value={draft[key] ?? ""}
                      onChange={(e) => set(key, e.target.value)}
                    />
                  ) : (
                    <Input
                      id={key}
                      className="mt-1"
                      value={draft[key] ?? ""}
                      onChange={(e) => set(key, e.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search & social (SEO)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor={`seo-title-${page.key}`}>
                Meta title{" "}
                <span
                  className={
                    titleLen > 60 ? "text-destructive" : "text-muted-foreground"
                  }
                >
                  ({titleLen}/60)
                </span>
              </Label>
              <Input
                id={`seo-title-${page.key}`}
                className="mt-1"
                value={draft[`seo.${page.key}.title`] ?? ""}
                onChange={(e) => set(`seo.${page.key}.title`, e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`seo-desc-${page.key}`}>
                Meta description{" "}
                <span
                  className={descLen > 160 ? "text-destructive" : "text-muted-foreground"}
                >
                  ({descLen}/160)
                </span>
              </Label>
              <Textarea
                id={`seo-desc-${page.key}`}
                className="mt-1"
                rows={3}
                value={draft[`seo.${page.key}.description`] ?? ""}
                onChange={(e) => set(`seo.${page.key}.description`, e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`seo-img-${page.key}`}>Social share image URL</Label>
              <Input
                id={`seo-img-${page.key}`}
                className="mt-1"
                placeholder="/unity-img.jpg"
                value={draft[`seo.${page.key}.image`] ?? ""}
                onChange={(e) => set(`seo.${page.key}.image`, e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Used for Open Graph and Twitter cards. Schema type:{" "}
                <span className="font-medium">{page.schema}</span>.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Google preview
              </p>
              <p className="mt-2 truncate text-sm text-primary">
                {draft[`seo.${page.key}.title`]}
              </p>
              <p className="text-xs text-green-700">
                shikana.co.ke{page.path === "/" ? "" : page.path}
              </p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {draft[`seo.${page.key}.description`]}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
