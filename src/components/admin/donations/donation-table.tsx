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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DataToolbar } from "@/components/admin/_shared/data-toolbar";
import { listDonations, recordDonation, updateDonation, deleteDonation } from "@/lib/admin/donations.functions";

const KEY = ["admin", "donations"];
const STATUSES = ["pending", "completed", "failed", "refunded"] as const;

function DonationForm({ initial, onSubmit, pending }: any) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onSubmit({
      ...(initial?.id ? { id: initial.id } : {}),
      donor_name: fd.get("donor_name") || null,
      donor_email: fd.get("donor_email") || null,
      donor_phone: fd.get("donor_phone") || null,
      amount_cents: Math.round(Number(fd.get("amount") || 0) * 100),
      currency: (fd.get("currency") || "KES") as string,
      method: fd.get("method") || null,
      reference: fd.get("reference") || null,
      status: fd.get("status"),
      notes: fd.get("notes") || null,
    }); }} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Donor Name</Label><Input name="donor_name" defaultValue={initial?.donor_name ?? ""} /></div>
        <div><Label>Email</Label><Input type="email" name="donor_email" defaultValue={initial?.donor_email ?? ""} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Phone</Label><Input name="donor_phone" defaultValue={initial?.donor_phone ?? ""} /></div>
        <div><Label>Reference</Label><Input name="reference" defaultValue={initial?.reference ?? ""} /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label>Amount</Label><Input type="number" step="0.01" name="amount" required defaultValue={initial ? (initial.amount_cents/100).toString() : ""} /></div>
        <div><Label>Currency</Label><Input name="currency" defaultValue={initial?.currency ?? "KES"} /></div>
        <div><Label>Method</Label><Input name="method" placeholder="M-Pesa, Bank…" defaultValue={initial?.method ?? ""} /></div>
      </div>
      <div>
        <Label>Status</Label>
        <Select name="status" defaultValue={initial?.status ?? "completed"}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div><Label>Notes</Label><Textarea name="notes" rows={3} defaultValue={initial?.notes ?? ""} /></div>
      <DialogFooter><Button type="submit" disabled={pending}>Save</Button></DialogFooter>
    </form>
  );
}

export function DonationsTable() {
  const qc = useQueryClient();
  const list = useServerFn(listDonations);
  const create = useServerFn(recordDonation);
  const update = useServerFn(updateDonation);
  const del = useServerFn(deleteDonation);

  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDel, setConfirmDel] = useState<any | null>(null);

  const { data = [], isLoading, error } = useQuery({ queryKey: KEY, queryFn: () => list() });
  const inv = () => qc.invalidateQueries({ queryKey: KEY });
  const createMut = useMutation({ mutationFn: (v: any) => create({ data: v }), onSuccess: () => { inv(); toast.success("Recorded"); setAdding(false); }, onError: (e: any) => toast.error(e.message) });
  const updateMut = useMutation({ mutationFn: (v: any) => update({ data: v }), onSuccess: () => { inv(); toast.success("Updated"); setEditing(null); }, onError: (e: any) => toast.error(e.message) });
  const deleteMut = useMutation({ mutationFn: (id: string) => del({ data: { id } }), onSuccess: () => { inv(); toast.success("Deleted"); setConfirmDel(null); }, onError: (e: any) => toast.error(e.message) });

  const rows = (data as any[]).filter((r) => {
    const q = search.toLowerCase();
    return !q || r.donor_name?.toLowerCase().includes(q) || r.donor_email?.toLowerCase().includes(q) || r.reference?.toLowerCase().includes(q);
  });

  const total = rows.filter((r) => r.status === "completed").reduce((sum: number, r) => sum + (r.amount_cents || 0), 0);

  if (error) return <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">Failed to load: {(error as Error).message}</div>;

  return (
    <div className="space-y-4">
      <DataToolbar search={search} onSearch={setSearch} placeholder="Search donations…" count={rows.length}>
        <Badge variant="outline" className="text-base px-3 py-1">Total: KES {(total/100).toLocaleString()}</Badge>
        <Dialog open={adding} onOpenChange={setAdding}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Record Donation</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Record Donation</DialogTitle></DialogHeader>
            <DonationForm onSubmit={(v: any) => createMut.mutate(v)} pending={createMut.isPending} />
          </DialogContent>
        </Dialog>
      </DataToolbar>

      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Donor</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-6 w-full" /></TableCell></TableRow>)
              : rows.length === 0 ? <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No donations yet.</TableCell></TableRow>
              : rows.map((d: any) => (
                <TableRow key={d.id}>
                  <TableCell><div className="font-medium">{d.donor_name ?? d.donor?.full_name ?? "Anonymous"}</div><div className="text-xs text-muted-foreground">{d.donor_email ?? d.donor?.email ?? ""}</div></TableCell>
                  <TableCell className="font-mono">{d.currency} {(d.amount_cents/100).toLocaleString()}</TableCell>
                  <TableCell className="text-xs">{d.method ?? "—"}</TableCell>
                  <TableCell><Badge variant={d.status === "completed" ? "default" : "outline"}>{d.status}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => setEditing(d)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmDel(d)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Edit Donation</DialogTitle></DialogHeader>
          {editing && <DonationForm initial={editing} onSubmit={(v: any) => updateMut.mutate(v)} pending={updateMut.isPending} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete donation?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => confirmDel && deleteMut.mutate(confirmDel.id)}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
