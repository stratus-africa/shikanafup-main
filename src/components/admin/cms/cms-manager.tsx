import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import { Plus, Trash2, Pencil } from "lucide-react";
import { listFaqs, createFaq, updateFaq, deleteFaq } from "@/lib/admin/faqs.functions";
import {
  listPublications,
  createPublication,
  updatePublication,
  deletePublication,
} from "@/lib/admin/publications.functions";
import { listSettings, upsertSetting } from "@/lib/admin/settings.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SITE_KEYS = [
  { key: "site.tagline", label: "Homepage tagline" },
  { key: "site.hero_headline", label: "Hero headline" },
  { key: "site.hero_subtext", label: "Hero subtext" },
  { key: "site.about_summary", label: "About summary" },
  { key: "site.contact_email", label: "Contact email" },
  { key: "site.contact_phone", label: "Contact phone" },
  { key: "site.address", label: "Office address" },
];

/* ------------------------------- FAQs -------------------------------- */

function FaqsPanel() {
  const qc = useQueryClient();
  const list = useServerFn(listFaqs);
  const create = useServerFn(createFaq);
  const update = useServerFn(updateFaq);
  const remove = useServerFn(deleteFaq);

  const faqs = useQuery({ queryKey: ["cms-faqs"], queryFn: () => list() });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "",
    sort_order: 0,
    is_published: true,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["cms-faqs"] });

  const save = useMutation({
    mutationFn: () =>
      editing
        ? update({ data: { id: editing.id, ...form, category: form.category || null } })
        : create({ data: { ...form, category: form.category || null } }),
    onSuccess: () => {
      toast.success(editing ? "FAQ updated" : "FAQ created");
      setOpen(false);
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not save FAQ"),
  });

  const del = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("FAQ deleted");
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not delete FAQ"),
  });

  const openNew = () => {
    setEditing(null);
    setForm({ question: "", answer: "", category: "", sort_order: 0, is_published: true });
    setOpen(true);
  };
  const openEdit = (f: any) => {
    setEditing(f);
    setForm({
      question: f.question ?? "",
      answer: f.answer ?? "",
      category: f.category ?? "",
      sort_order: f.sort_order ?? 0,
      is_published: !!f.is_published,
    });
    setOpen(true);
  };

  return (
    <Card>
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <CardTitle>FAQs</CardTitle>
        <Button size="sm" onClick={openNew}>
          <Plus className="mr-1 size-4" /> New FAQ
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(faqs.data ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-sm text-muted-foreground">
                  No FAQs yet.
                </TableCell>
              </TableRow>
            )}
            {(faqs.data ?? []).map((f: any) => (
              <TableRow key={f.id}>
                <TableCell className="max-w-[420px] truncate font-medium">{f.question}</TableCell>
                <TableCell className="hidden md:table-cell">{f.category ?? "—"}</TableCell>
                <TableCell>{f.sort_order}</TableCell>
                <TableCell>
                  <Badge variant={f.is_published ? "default" : "secondary"}>
                    {f.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(f)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => del.mutate(f.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit FAQ" : "New FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Question</Label>
              <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Answer</Label>
              <Textarea rows={5} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Sort order</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} />
              <Label>Published on the website</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!form.question || !form.answer || save.isPending} onClick={() => save.mutate()}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* --------------------------- Publications ---------------------------- */

function PublicationsPanel() {
  const qc = useQueryClient();
  const list = useServerFn(listPublications);
  const create = useServerFn(createPublication);
  const update = useServerFn(updatePublication);
  const remove = useServerFn(deletePublication);

  const pubs = useQuery({ queryKey: ["cms-publications"], queryFn: () => list() });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    file_url: "",
    cover_url: "",
    is_published: true,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["cms-publications"] });

  const save = useMutation({
    mutationFn: () => {
      const payload = {
        title: form.title,
        description: form.description || null,
        file_url: form.file_url,
        cover_url: form.cover_url || null,
        is_published: form.is_published,
      };
      return editing ? update({ data: { id: editing.id, ...payload } }) : create({ data: payload });
    },
    onSuccess: () => {
      toast.success(editing ? "Publication updated" : "Publication created");
      setOpen(false);
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not save publication"),
  });

  const del = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Publication deleted");
      invalidate();
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not delete publication"),
  });

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", description: "", file_url: "", cover_url: "", is_published: true });
    setOpen(true);
  };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      title: p.title ?? "",
      description: p.description ?? "",
      file_url: p.file_url ?? "",
      cover_url: p.cover_url ?? "",
      is_published: !!p.is_published,
    });
    setOpen(true);
  };

  return (
    <Card>
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <CardTitle>Publications</CardTitle>
        <Button size="sm" onClick={openNew}>
          <Plus className="mr-1 size-4" /> New publication
        </Button>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">File</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(pubs.data ?? []).length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-sm text-muted-foreground">
                  No publications yet.
                </TableCell>
              </TableRow>
            )}
            {(pubs.data ?? []).map((p: any) => (
              <TableRow key={p.id}>
                <TableCell className="max-w-[360px] truncate font-medium">{p.title}</TableCell>
                <TableCell className="hidden max-w-[320px] truncate md:table-cell">{p.file_url}</TableCell>
                <TableCell>
                  <Badge variant={p.is_published ? "default" : "secondary"}>
                    {p.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => del.mutate(p.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit publication" : "New publication"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>File URL</Label>
                <Input
                  value={form.file_url}
                  onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                  placeholder="https://…/document.pdf"
                />
              </div>
              <div className="grid gap-2">
                <Label>Cover image URL</Label>
                <Input
                  value={form.cover_url}
                  onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
                  placeholder="https://…/cover.jpg"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} />
              <Label>Published on the website</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!form.title || !form.file_url || save.isPending} onClick={() => save.mutate()}>
              {save.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

/* --------------------------- Site content ---------------------------- */

function SiteContentPanel() {
  const qc = useQueryClient();
  const list = useServerFn(listSettings);
  const upsert = useServerFn(upsertSetting);
  const settings = useQuery({ queryKey: ["cms-settings"], queryFn: () => list() });
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const valueOf = (key: string) => {
    if (drafts[key] !== undefined) return drafts[key];
    const row = (settings.data ?? []).find((s: any) => s.key === key);
    const v = row?.value;
    return typeof v === "string" ? v : v == null ? "" : String(v);
  };

  const save = useMutation({
    mutationFn: (key: string) => upsert({ data: { key, value: valueOf(key) } }),
    onSuccess: () => {
      toast.success("Content saved");
      qc.invalidateQueries({ queryKey: ["cms-settings"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not save content"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website content</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-2">
        {SITE_KEYS.map((s) => (
          <div key={s.key} className="grid gap-2">
            <Label>{s.label}</Label>
            <Textarea
              rows={2}
              value={valueOf(s.key)}
              onChange={(e) => setDrafts({ ...drafts, [s.key]: e.target.value })}
            />
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={() => save.mutate(s.key)}>
                Save
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function CmsManager() {
  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Content management</h1>
        <p className="text-sm text-muted-foreground">Manage the content that appears on the public website.</p>
      </div>
      <Tabs defaultValue="faqs">
        <TabsList>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        <TabsContent value="faqs" className="mt-4">
          <FaqsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
