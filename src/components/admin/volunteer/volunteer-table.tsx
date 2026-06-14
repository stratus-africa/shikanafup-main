import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Check, X, Trash2 } from "lucide-react";
import { DataToolbar } from "@/components/admin/_shared/data-toolbar";
import { listVolunteers, approveVolunteer, rejectVolunteer, deleteVolunteer } from "@/lib/admin/volunteers.functions";

const KEY = ["admin", "volunteers"];

export function VolunteerTable() {
  const qc = useQueryClient();
  const list = useServerFn(listVolunteers);
  const approve = useServerFn(approveVolunteer);
  const reject = useServerFn(rejectVolunteer);
  const del = useServerFn(deleteVolunteer);

  const [search, setSearch] = useState("");
  const [confirmDel, setConfirmDel] = useState<any | null>(null);

  const { data = [], isLoading, error } = useQuery({ queryKey: KEY, queryFn: () => list() });
  const inv = () => qc.invalidateQueries({ queryKey: KEY });
  const approveMut = useMutation({ mutationFn: (id: string) => approve({ data: { id } }), onSuccess: () => { inv(); toast.success("Approved"); }, onError: (e: any) => toast.error(e.message) });
  const rejectMut = useMutation({ mutationFn: (id: string) => reject({ data: { id } }), onSuccess: () => { inv(); toast.success("Rejected"); }, onError: (e: any) => toast.error(e.message) });
  const deleteMut = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: () => { inv(); toast.success("Deleted"); setConfirmDel(null); }, onError: (e: any) => toast.error(e.message) });

  const rows = (data as any[]).filter((r) => {
    const q = search.toLowerCase();
    return !q || r.profile?.full_name?.toLowerCase().includes(q) || r.profile?.email?.toLowerCase().includes(q);
  });

  if (error) return <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">Failed to load: {(error as Error).message}</div>;

  return (
    <div className="space-y-4">
      <DataToolbar search={search} onSearch={setSearch} placeholder="Search volunteers…" count={rows.length} />

      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Volunteer</TableHead><TableHead>Email</TableHead><TableHead>Skills</TableHead><TableHead>Availability</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-6 w-full" /></TableCell></TableRow>)
              : rows.length === 0 ? <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No volunteers yet.</TableCell></TableRow>
              : rows.map((v: any) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.profile?.full_name ?? "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{v.profile?.email ?? "—"}</TableCell>
                  <TableCell className="text-xs max-w-xs truncate">{Array.isArray(v.skills) ? v.skills.join(", ") : v.skills ?? "—"}</TableCell>
                  <TableCell className="text-xs">{v.availability ?? "—"}</TableCell>
                  <TableCell><Badge variant={v.status === "approved" ? "default" : v.status === "rejected" ? "destructive" : "outline"}>{v.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" disabled={v.status === "approved"} onClick={() => approveMut.mutate(v.id)}><Check className="h-4 w-4 text-green-600" /></Button>
                    <Button size="icon" variant="ghost" disabled={v.status === "rejected"} onClick={() => rejectMut.mutate(v.id)}><X className="h-4 w-4 text-destructive" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmDel(v)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete volunteer entry?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => confirmDel && deleteMut.mutate(confirmDel.id)}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
