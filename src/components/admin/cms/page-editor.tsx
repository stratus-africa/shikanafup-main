import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import { ExternalLink, RotateCcw, Save } from "lucide-react";
import { listSettings, upsertSetting } from "@/lib/admin/settings.functions";
import type { PageDefinition } from "@/lib/cms/page-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PageEditor({ page }: { page: PageDefinition }) {
  const qc = useQueryClient();
  const load = useServerFn(listSettings);
  const save = useServerFn(upsertSetting);

  const settings = useQuery({ queryKey: ["admin-settings"], queryFn: () => load() });

  const saved = useMemo(() => {
    const map: Record<string, string> = {};
    for (const row of (settings.data ?? []) as any[]) {
      const v = row.value;
      map[row.key] = typeof v === "string" ? v : v == null ? "" : String(v);
    }
    return map;
  }, [settings.data]);

  const fields = useMemo(
    () => page.sections.flatMap((s) => s.fields),
    [page],
  );

  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};
    for (const f of fields) next[f.key] = saved[f.key] ?? f.default;
    setForm(next);
  }, [fields, saved]);

  const persist = useMutation({
    mutationFn: async () => {
      const changed = fields.filter((f) => (form[f.key] ?? "") !== (saved[f.key] ?? f.default));
      for (const f of changed) {
        await save({ data: { key: f.key, value: form[f.key] ?? "" } });
      }
      return changed.length;
    },
    onSuccess: (n) => {
      toast.success(n ? `${page.title} updated` : "No changes to save");
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      qc.invalidateQueries({ queryKey: ["public", "site-settings"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not save content"),
  });

  const resetDefaults = () => {
    const next: Record<string, string> = {};
    for (const f of fields) next[f.key] = f.default;
    setForm(next);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{page.title}</h1>
          <p className="text-sm text-muted-foreground">{page.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href={page.path} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-1 size-4" /> View page
            </a>
          </Button>
          <Button variant="outline" size="sm" onClick={resetDefaults}>
            <RotateCcw className="mr-1 size-4" /> Restore defaults
          </Button>
          <Button size="sm" disabled={persist.isPending} onClick={() => persist.mutate()}>
            <Save className="mr-1 size-4" />
            {persist.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {page.sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="text-base">{section.title}</CardTitle>
              {section.description && <CardDescription>{section.description}</CardDescription>}
            </CardHeader>
            <CardContent className="grid gap-4">
              {section.fields.map((f) => (
                <div key={f.key} className="grid gap-2">
                  <Label htmlFor={f.key}>{f.label}</Label>
                  {f.kind === "textarea" ? (
                    <Textarea
                      id={f.key}
                      rows={4}
                      value={form[f.key] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  ) : (
                    <Input
                      id={f.key}
                      value={form[f.key] ?? ""}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    />
                  )}
                  {f.kind === "image" && (form[f.key] ?? "").trim() && (
                    <img
                      src={form[f.key]}
                      alt={`${f.label} preview`}
                      className="h-24 w-full max-w-xs rounded-md border object-cover"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
