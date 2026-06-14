import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
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
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { DataToolbar } from "@/components/admin/_shared/data-toolbar";
import { listJobs, createJob, updateJob, deleteJob } from "@/lib/admin/jobs.functions";

const KEY = ["admin", "jobs"];

function JobForm({ initial, onSubmit, pending }: any) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onSubmit({
      ...(initial?.id ? { id: initial.id } : {}),
      title: fd.get("title"),
      slug: fd.get("slug") || undefined,
      description: fd.get("description") || null,
      location: fd.get("location") || null,
      type: fd.get("type") || null,
      closes_at: fd.get("closes_at") || null,
    }); }} className="space-y-3">
      <div><Label>Title</Label><Input name="title" required defaultValue={initial?.title ?? ""} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Location</Label><Input name="location" defaultValue={initial?.location ?? ""} /></div>
        <div><Label>Type</Label><Input name="type" placeholder="Full-time, Volunteer…" defaultValue={initial?.type ?? ""} /></div>
      </div>
      <div><Label>Closes at</Label><Input type="date" name="closes_at" defaultValue={initial?.closes_at?.slice(0,10) ?? ""} /></div>
      <div><Label>Description</Label><Textarea name="description" rows={8} defaultValue={initial?.description ?? ""} /></div>
      <DialogFooter><Button type="submit" disabled={pending}>Save</Button></DialogFooter>
    </form>
  );
}

export function JobsTable() {
  const qc = useQueryClient();
  const list = useServerFn(listJobs);
  const create = useServerFn(createJob);
  const update = useServerFn(updateJob);
  const del = useServerFn(deleteJob);

  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDel, setConfirmDel] = useState<any | null>(null);

  const { data = [], isLoading, error } = useQuery({ queryKey: KEY, queryFn: () => list() });
  const inv = () => qc.invalidateQueries({ queryKey: KEY });

  const createMut = useMutation({ mutationFn: (v: any) => create({ data: v }), onSuccess: () => { inv(); toast.success("Job created"); setAdding(false); }, onError: (e: any) => toast.error(e.message) });
  const updateMut = useMutation({ mutationFn: (v: any) => update({ data: v }), onSuccess: () => { inv(); toast.success("Updated"); setEditing(null); }, onError: (e: any) => toast.error(e.message) });
  const deleteMut = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: () => { inv(); toast.success("Deleted"); setConfirmDel(null); }, onError: (e: any) => toast.error(e.message) });

  const rows = (data as any[]).filter((r) => {
    const q = search.toLowerCase();
    return !q || r.title?.toLowerCase().includes(q) || r.location?.toLowerCase().includes(q);
  });

  if (error) return <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">Failed to load jobs: {(error as Error).message}</div>;

  return (
    <div className="space-y-4">
      <DataToolbar search={search} onSearch={setSearch} placeholder="Search jobs…" count={rows.length}>
        <Dialog open={adding} onOpenChange={setAdding}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />New Job</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>New Job</DialogTitle></DialogHeader>
            <JobForm onSubmit={(v: any) => createMut.mutate(v)} pending={createMut.isPending} />
          </DialogContent>
        </Dialog>
      </DataToolbar>

      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead>Location</TableHead><TableHead>Closes</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-6 w-full" /></TableCell></TableRow>)
              : rows.length === 0 ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No jobs yet.</TableCell></TableRow>
              : rows.map((j: any) => (
                <TableRow key={j.id}>
                  <TableCell className="font-medium">{j.title}</TableCell>
                  <TableCell>{j.type ? <Badge variant="outline">{j.type}</Badge> : "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{j.location ?? "—"}</TableCell>
                  <TableCell className="text-xs">{j.closes_at ? new Date(j.closes_at).toLocaleDateString() : "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="icon" variant="ghost"><Link to="/admin/ui/jobs/$jobId/applications" params={{ jobId: j.id }}><Users className="h-4 w-4" /></Link></Button>
                    <Button size="icon" variant="ghost" onClick={() => setEditing(j)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmDel(j)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Job</DialogTitle></DialogHeader>
          {editing && <JobForm initial={editing} onSubmit={(v: any) => updateMut.mutate(v)} pending={updateMut.isPending} />}
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
