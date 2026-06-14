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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DataToolbar } from "@/components/admin/_shared/data-toolbar";
import { listMerchandise, createMerchandise, updateMerchandise, deleteMerchandise } from "@/lib/admin/merchandise.functions";

const KEY = ["admin", "merchandise"];

function MerchForm({ initial, onSubmit, pending }: any) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const imgs = String(fd.get("images") || "").split(",").map((s) => s.trim()).filter(Boolean); onSubmit({
      ...(initial?.id ? { id: initial.id } : {}),
      name: fd.get("name"),
      slug: fd.get("slug") || undefined,
      description: fd.get("description") || null,
      price_cents: Math.round(Number(fd.get("price") || 0) * 100),
      currency: (fd.get("currency") || "KES") as string,
      stock: Number(fd.get("stock") || 0),
      images: imgs,
    }); }} className="space-y-3">
      <div><Label>Name</Label><Input name="name" required defaultValue={initial?.name ?? ""} /></div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label>Price</Label><Input type="number" step="0.01" name="price" required defaultValue={initial ? (initial.price_cents/100).toString() : ""} /></div>
        <div><Label>Currency</Label><Input name="currency" defaultValue={initial?.currency ?? "KES"} /></div>
        <div><Label>Stock</Label><Input type="number" name="stock" defaultValue={initial?.stock ?? 0} /></div>
      </div>
      <div><Label>Image URLs (comma-separated)</Label><Input name="images" defaultValue={(initial?.images ?? []).join(", ")} /></div>
      <div><Label>Description</Label><Textarea name="description" rows={5} defaultValue={initial?.description ?? ""} /></div>
      <DialogFooter><Button type="submit" disabled={pending}>Save</Button></DialogFooter>
    </form>
  );
}

export function MerchandiseTable() {
  const qc = useQueryClient();
  const list = useServerFn(listMerchandise);
  const create = useServerFn(createMerchandise);
  const update = useServerFn(updateMerchandise);
  const del = useServerFn(deleteMerchandise);

  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDel, setConfirmDel] = useState<any | null>(null);

  const { data = [], isLoading, error } = useQuery({ queryKey: KEY, queryFn: () => list() });
  const inv = () => qc.invalidateQueries({ queryKey: KEY });
  const createMut = useMutation({ mutationFn: (v: any) => create({ data: v }), onSuccess: () => { inv(); toast.success("Added"); setAdding(false); }, onError: (e: any) => toast.error(e.message) });
  const updateMut = useMutation({ mutationFn: (v: any) => update({ data: v }), onSuccess: () => { inv(); toast.success("Updated"); setEditing(null); }, onError: (e: any) => toast.error(e.message) });
  const deleteMut = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: () => { inv(); toast.success("Deleted"); setConfirmDel(null); }, onError: (e: any) => toast.error(e.message) });

  const rows = (data as any[]).filter((r) => {
    const q = search.toLowerCase();
    return !q || r.name?.toLowerCase().includes(q);
  });

  if (error) return <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">Failed to load: {(error as Error).message}</div>;

  return (
    <div className="space-y-4">
      <DataToolbar search={search} onSearch={setSearch} placeholder="Search merchandise…" count={rows.length}>
        <Dialog open={adding} onOpenChange={setAdding}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />New Item</Button></DialogTrigger>
          <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>New Item</DialogTitle></DialogHeader>
            <MerchForm onSubmit={(v: any) => createMut.mutate(v)} pending={createMut.isPending} />
          </DialogContent>
        </Dialog>
      </DataToolbar>

      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Active</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-6 w-full" /></TableCell></TableRow>)
              : rows.length === 0 ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No merchandise yet.</TableCell></TableRow>
              : rows.map((m: any) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {m.images?.[0] && <img src={m.images[0]} alt="" className="h-10 w-10 rounded object-cover" />}
                    {m.name}
                  </TableCell>
                  <TableCell>{m.currency} {(m.price_cents/100).toFixed(2)}</TableCell>
                  <TableCell>{m.stock}</TableCell>
                  <TableCell><Badge variant={m.is_active === false ? "outline" : "default"}>{m.is_active === false ? "Off" : "On"}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(m)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmDel(m)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>Edit Item</DialogTitle></DialogHeader>
          {editing && <MerchForm initial={editing} onSubmit={(v: any) => updateMut.mutate(v)} pending={updateMut.isPending} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete "{confirmDel?.name}"?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => confirmDel && deleteMut.mutate(confirmDel.id)}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
