import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DataToolbar } from "@/components/admin/_shared/data-toolbar";
import { listBlogs, createBlog, updateBlog, deleteBlog } from "@/lib/admin/blogs.functions";

const KEY = ["admin", "blogs"];
const STATUSES = ["draft", "published", "archived"] as const;

function BlogForm({ initial, onSubmit, pending }: { initial?: any; onSubmit: (v: any) => void; pending: boolean }) {
  const [status, setStatus] = useState(initial?.status ?? "draft");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const tags = String(fd.get("tags") || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
        onSubmit({
          ...(initial?.id ? { id: initial.id } : {}),
          title: fd.get("title"),
          slug: fd.get("slug") || undefined,
          excerpt: fd.get("excerpt") || null,
          body: fd.get("body") || null,
          cover_url: fd.get("cover_url") || null,
          tags,
          status,
        });
      }}
      className="space-y-3"
    >
      <div>
        <Label>Title</Label>
        <Input name="title" required defaultValue={initial?.title ?? ""} />
      </div>
      <div>
        <Label>Slug</Label>
        <Input name="slug" defaultValue={initial?.slug ?? ""} placeholder="auto" />
      </div>
      <div>
        <Label>Cover URL</Label>
        <Input name="cover_url" defaultValue={initial?.cover_url ?? ""} />
      </div>
      <div>
        <Label>Excerpt</Label>
        <Textarea name="excerpt" rows={2} defaultValue={initial?.excerpt ?? ""} />
      </div>
      <div>
        <Label>Body</Label>
        <Textarea name="body" rows={8} defaultValue={initial?.body ?? ""} />
      </div>
      <div>
        <Label>Tags (comma-separated)</Label>
        <Input name="tags" defaultValue={(initial?.tags ?? []).join(", ")} />
      </div>
      <div>
        <Label>Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={pending}>
          Save
        </Button>
      </DialogFooter>
    </form>
  );
}

export function BlogsTable() {
  const qc = useQueryClient();
  const list = useServerFn(listBlogs);
  const create = useServerFn(createBlog);
  const update = useServerFn(updateBlog);
  const del = useServerFn(deleteBlog);

  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDel, setConfirmDel] = useState<any | null>(null);

  const { data = [], isLoading, error } = useQuery({ queryKey: KEY, queryFn: () => list() });

  const invalidate = () => qc.invalidateQueries({ queryKey: KEY });

  const createMut = useMutation({
    mutationFn: (v: any) => create({ data: v }),
    onSuccess: () => {
      invalidate();
      toast.success("Blog created");
      setAdding(false);
    },
    onError: (e: any) => toast.error(e.message),
  });
  const updateMut = useMutation({
    mutationFn: (v: any) => update({ data: v }),
    onSuccess: () => {
      invalidate();
      toast.success("Blog updated");
      setEditing(null);
    },
    onError: (e: any) => toast.error(e.message),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      invalidate();
      toast.success("Deleted");
      setConfirmDel(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const rows = (data as any[]).filter((r) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return r.title?.toLowerCase().includes(q) || r.slug?.toLowerCase().includes(q);
  });

  if (error)
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load blogs: {(error as Error).message}
      </div>
    );

  return (
    <div className="space-y-4">
      <DataToolbar search={search} onSearch={setSearch} placeholder="Search blogs…" count={rows.length}>
        <Dialog open={adding} onOpenChange={setAdding}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Blog Post</DialogTitle>
            </DialogHeader>
            <BlogForm onSubmit={(v) => createMut.mutate(v)} pending={createMut.isPending} />
          </DialogContent>
        </Dialog>
      </DataToolbar>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  No blog posts yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{b.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{(b.tags ?? []).join(", ") || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(b.updated_at ?? b.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(b)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmDel(b)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          {editing && (
            <BlogForm initial={editing} onSubmit={(v) => updateMut.mutate(v)} pending={updateMut.isPending} />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{confirmDel?.title}"?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDel && deleteMut.mutate(confirmDel.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
