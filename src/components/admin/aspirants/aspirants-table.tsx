import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Check, X, RotateCcw, Trash2 } from "lucide-react";
import { DataToolbar } from "@/components/admin/_shared/data-toolbar";
import { listAspirants, approveAspirant, rejectAspirant, resetAspirant, deleteAspirant } from "@/lib/admin/aspirants.functions";

const KEY = ["admin", "aspirants"];

export function AspirantsTable(_props: { type?: string } = {}) {
  const qc = useQueryClient();
  const list = useServerFn(listAspirants);
  const approve = useServerFn(approveAspirant);
  const reject = useServerFn(rejectAspirant);
  const reset = useServerFn(resetAspirant);
  const del = useServerFn(deleteAspirant);

  const [search, setSearch] = useState("");
  const [confirmDel, setConfirmDel] = useState<any | null>(null);

  const { data = [], isLoading, error } = useQuery({ queryKey: KEY, queryFn: () => list() });
  const inv = () => qc.invalidateQueries({ queryKey: KEY });
  const mk = (fn: any, label: string) => useMutation({
    mutationFn: (id: string) => fn({ data: { id } }),
    onSuccess: () => { inv(); toast.success(label); },
    onError: (e: any) => toast.error(e.message),
  });
  const approveMut = mk(approve, "Approved");
  const rejectMut = mk(reject, "Rejected");
  const resetMut = mk(reset, "Reset");
  const deleteMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { inv(); toast.success("Deleted"); setConfirmDel(null); },
    onError: (e: any) => toast.error(e.message),
  });

  const rows = (data as any[]).filter((r) => {
    const q = search.toLowerCase();
    return !q || r.profile?.full_name?.toLowerCase().includes(q) || r.position?.title?.toLowerCase().includes(q);
  });

  if (error) return <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">Failed to load: {(error as Error).message}</div>;

  return (
    <div className="space-y-4">
      <DataToolbar search={search} onSearch={setSearch} placeholder="Search aspirants…" count={rows.length} />

      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Aspirant</TableHead><TableHead>Position</TableHead><TableHead>Level</TableHead><TableHead>Status</TableHead><TableHead>Applied</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-6 w-full" /></TableCell></TableRow>)
              : rows.length === 0 ? <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No aspirants yet.</TableCell></TableRow>
              : rows.map((a: any) => (
                <TableRow key={a.id}>
                  <TableCell><div className="font-medium">{a.profile?.full_name ?? "—"}</div><div className="text-xs text-muted-foreground">{a.profile?.email ?? ""}</div></TableCell>
                  <TableCell>{a.position?.title ?? "—"}</TableCell>
                  <TableCell><Badge variant="outline">{a.position?.level ?? "—"}</Badge></TableCell>
                  <TableCell><Badge variant={a.status === "approved" ? "default" : a.status === "rejected" ? "destructive" : "outline"}>{a.status}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" disabled={a.status === "approved" || approveMut.isPending} onClick={() => approveMut.mutate(a.id)}><Check className="h-4 w-4 text-green-600" /></Button>
                    <Button size="icon" variant="ghost" disabled={a.status === "rejected" || rejectMut.isPending} onClick={() => rejectMut.mutate(a.id)}><X className="h-4 w-4 text-destructive" /></Button>
                    <Button size="icon" variant="ghost" disabled={a.status === "pending" || resetMut.isPending} onClick={() => resetMut.mutate(a.id)}><RotateCcw className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmDel(a)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete aspirant entry?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => confirmDel && deleteMut.mutate(confirmDel.id)}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
