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
import { listLocalGroups, createLocalGroup, updateLocalGroup, deleteLocalGroup } from "@/lib/admin/local-groups.functions";

const KEY = ["admin", "local-groups"];

function GroupForm({ initial, onSubmit, pending }: any) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onSubmit({
      ...(initial?.id ? { id: initial.id } : {}),
      name: fd.get("name"),
      county: fd.get("county") || null,
      constituency: fd.get("constituency") || null,
      ward: fd.get("ward") || null,
      description: fd.get("description") || null,
    }); }} className="space-y-3">
      <div><Label>Name</Label><Input name="name" required defaultValue={initial?.name ?? ""} /></div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label>County</Label><Input name="county" defaultValue={initial?.county ?? ""} /></div>
        <div><Label>Constituency</Label><Input name="constituency" defaultValue={initial?.constituency ?? ""} /></div>
        <div><Label>Ward</Label><Input name="ward" defaultValue={initial?.ward ?? ""} /></div>
      </div>
      <div><Label>Description</Label><Textarea name="description" rows={4} defaultValue={initial?.description ?? ""} /></div>
      <DialogFooter><Button type="submit" disabled={pending}>Save</Button></DialogFooter>
    </form>
  );
}

export function LocalGroupTable() {
  const qc = useQueryClient();
  const list = useServerFn(listLocalGroups);
  const create = useServerFn(createLocalGroup);
  const update = useServerFn(updateLocalGroup);
  const del = useServerFn(deleteLocalGroup);

  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDel, setConfirmDel] = useState<any | null>(null);

  const { data = [], isLoading, error } = useQuery({ queryKey: KEY, queryFn: () => list() });
  const inv = () => qc.invalidateQueries({ queryKey: KEY });

  const createMut = useMutation({ mutationFn: (v: any) => create({ data: v }), onSuccess: () => { inv(); toast.success("Created"); setAdding(false); }, onError: (e: any) => toast.error(e.message) });
  const updateMut = useMutation({ mutationFn: (v: any) => update({ data: v }), onSuccess: () => { inv(); toast.success("Updated"); setEditing(null); }, onError: (e: any) => toast.error(e.message) });
  const deleteMut = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: () => { inv(); toast.success("Deleted"); setConfirmDel(null); }, onError: (e: any) => toast.error(e.message) });

  const rows = (data as any[]).filter((r) => {
    const q = search.toLowerCase();
    return !q || r.name?.toLowerCase().includes(q) || r.county?.toLowerCase().includes(q);
  });

  if (error) return <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">Failed to load: {(error as Error).message}</div>;

  return (
    <div className="space-y-4">
      <DataToolbar search={search} onSearch={setSearch} placeholder="Search local groups…" count={rows.length}>
        <Dialog open={adding} onOpenChange={setAdding}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />New Group</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Local Group</DialogTitle></DialogHeader>
            <GroupForm onSubmit={(v: any) => createMut.mutate(v)} pending={createMut.isPending} />
          </DialogContent>
        </Dialog>
      </DataToolbar>

      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>County</TableHead><TableHead>Constituency</TableHead><TableHead>Ward</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-6 w-full" /></TableCell></TableRow>)
              : rows.length === 0 ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No local groups yet.</TableCell></TableRow>
              : rows.map((g: any) => (
                <TableRow key={g.id}>
                  <TableCell className="font-medium">{g.name}</TableCell>
                  <TableCell>{g.county ?? "—"}</TableCell>
                  <TableCell>{g.constituency ?? "—"}</TableCell>
                  <TableCell>{g.ward ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(g)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmDel(g)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Group</DialogTitle></DialogHeader>
          {editing && <GroupForm initial={editing} onSubmit={(v: any) => updateMut.mutate(v)} pending={updateMut.isPending} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete "{confirmDel?.name}"?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDel && deleteMut.mutate(confirmDel.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
