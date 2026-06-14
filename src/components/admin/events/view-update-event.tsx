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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { DataToolbar } from "@/components/admin/_shared/data-toolbar";
import {
  listEvents, listEventCategories,
  createEvent, updateEvent, deleteEvent, createEventCategory,
} from "@/lib/admin/events.functions";

const KEY = ["admin", "events"];
const CAT_KEY = ["admin", "event-categories"];

function EventForm({ initial, categories, onSubmit, pending }: any) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const capRaw = String(fd.get("capacity") || "");
        onSubmit({
          ...(initial?.id ? { id: initial.id } : {}),
          title: fd.get("title"),
          slug: fd.get("slug") || undefined,
          category_id: fd.get("category_id") || null,
          description: fd.get("description") || null,
          location: fd.get("location") || null,
          starts_at: fd.get("starts_at"),
          ends_at: fd.get("ends_at") || null,
          cover_url: fd.get("cover_url") || null,
          capacity: capRaw ? Number(capRaw) : null,
        });
      }}
      className="space-y-3"
    >
      <div><Label>Title</Label><Input name="title" required defaultValue={initial?.title ?? ""} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Starts at</Label><Input type="datetime-local" name="starts_at" required defaultValue={initial?.starts_at?.slice(0,16) ?? ""} /></div>
        <div><Label>Ends at</Label><Input type="datetime-local" name="ends_at" defaultValue={initial?.ends_at?.slice(0,16) ?? ""} /></div>
      </div>
      <div><Label>Location</Label><Input name="location" defaultValue={initial?.location ?? ""} /></div>
      <div>
        <Label>Category</Label>
        <Select name="category_id" defaultValue={initial?.category_id ?? ""}>
          <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
          <SelectContent>{(categories ?? []).map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Capacity</Label><Input type="number" name="capacity" defaultValue={initial?.capacity ?? ""} /></div>
        <div><Label>Cover URL</Label><Input name="cover_url" defaultValue={initial?.cover_url ?? ""} /></div>
      </div>
      <div><Label>Description</Label><Textarea name="description" rows={5} defaultValue={initial?.description ?? ""} /></div>
      <DialogFooter><Button type="submit" disabled={pending}>Save</Button></DialogFooter>
    </form>
  );
}

export function EventsTable() {
  const qc = useQueryClient();
  const list = useServerFn(listEvents);
  const listCats = useServerFn(listEventCategories);
  const create = useServerFn(createEvent);
  const update = useServerFn(updateEvent);
  const del = useServerFn(deleteEvent);
  const createCat = useServerFn(createEventCategory);

  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDel, setConfirmDel] = useState<any | null>(null);
  const [catOpen, setCatOpen] = useState(false);

  const { data = [], isLoading, error } = useQuery({ queryKey: KEY, queryFn: () => list() });
  const { data: cats = [] } = useQuery({ queryKey: CAT_KEY, queryFn: () => listCats() });

  const inv = () => qc.invalidateQueries({ queryKey: KEY });
  const invCat = () => qc.invalidateQueries({ queryKey: CAT_KEY });

  const createMut = useMutation({ mutationFn: (v: any) => create({ data: v }), onSuccess: () => { inv(); toast.success("Event created"); setAdding(false); }, onError: (e: any) => toast.error(e.message) });
  const updateMut = useMutation({ mutationFn: (v: any) => update({ data: v }), onSuccess: () => { inv(); toast.success("Updated"); setEditing(null); }, onError: (e: any) => toast.error(e.message) });
  const deleteMut = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: () => { inv(); toast.success("Deleted"); setConfirmDel(null); }, onError: (e: any) => toast.error(e.message) });
  const createCatMut = useMutation({ mutationFn: (v: any) => createCat({ data: v }), onSuccess: () => { invCat(); toast.success("Category added"); setCatOpen(false); }, onError: (e: any) => toast.error(e.message) });

  const rows = (data as any[]).filter((r) => {
    const q = search.toLowerCase();
    return !q || r.title?.toLowerCase().includes(q) || r.location?.toLowerCase().includes(q);
  });

  if (error) return <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">Failed to load events: {(error as Error).message}</div>;

  return (
    <div className="space-y-4">
      <DataToolbar search={search} onSearch={setSearch} placeholder="Search events…" count={rows.length}>
        <Dialog open={catOpen} onOpenChange={setCatOpen}>
          <DialogTrigger asChild><Button variant="outline"><Tag className="mr-2 h-4 w-4" />New Category</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Category</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); createCatMut.mutate({ name: fd.get("name"), color: fd.get("color") || undefined }); }} className="space-y-3">
              <div><Label>Name</Label><Input name="name" required /></div>
              <div><Label>Color</Label><Input name="color" placeholder="#b81d22" /></div>
              <DialogFooter><Button type="submit" disabled={createCatMut.isPending}>Save</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={adding} onOpenChange={setAdding}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />New Event</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>New Event</DialogTitle></DialogHeader>
            <EventForm categories={cats} onSubmit={(v: any) => createMut.mutate(v)} pending={createMut.isPending} />
          </DialogContent>
        </Dialog>
      </DataToolbar>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Starts</TableHead><TableHead>Location</TableHead><TableHead>Capacity</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-6 w-full" /></TableCell></TableRow>)
              : rows.length === 0 ? <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No events yet.</TableCell></TableRow>
              : rows.map((e: any) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.title}</TableCell>
                  <TableCell>{e.category?.name ? <Badge variant="outline" style={{ borderColor: e.category.color }}>{e.category.name}</Badge> : "—"}</TableCell>
                  <TableCell className="text-xs">{new Date(e.starts_at).toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{e.location ?? "—"}</TableCell>
                  <TableCell>{e.capacity ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(e)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmDel(e)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Event</DialogTitle></DialogHeader>
          {editing && <EventForm initial={editing} categories={cats} onSubmit={(v: any) => updateMut.mutate(v)} pending={updateMut.isPending} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete "{confirmDel?.title}"?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDel && deleteMut.mutate(confirmDel.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
