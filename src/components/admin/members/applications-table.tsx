import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Trash2, History } from "lucide-react";
import { DataToolbar } from "@/components/admin/_shared/data-toolbar";
import {
  listApplications,
  updateApplicationStatus,
  deleteApplication,
  listApplicationAudit,
} from "@/lib/admin/applications.functions";

const KEY = ["admin", "membership_applications"];

function AuditDialog({ id, open, onOpenChange }: { id: string | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  const load = useServerFn(listApplicationAudit);
  const { data = [], isLoading } = useQuery({
    queryKey: ["admin", "application-audit", id],
    queryFn: () => load({ data: { id: id! } }),
    enabled: !!id && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Audit trail</DialogTitle>
          <DialogDescription>Approve / reject history for this application.</DialogDescription>
        </DialogHeader>
        <div className="max-h-80 space-y-3 overflow-y-auto">
          {isLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : (data as any[]).length === 0 ? (
            <p className="text-sm text-muted-foreground">No recorded actions yet.</p>
          ) : (
            (data as any[]).map((log) => (
              <div key={log.id} className="rounded-md border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <Badge variant={log.action === "approve" ? "default" : log.action === "reject" ? "destructive" : "outline"}>
                    {log.action}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  By {log.actor?.full_name || log.actor?.email || log.actor_id || "unknown"}
                </p>
                {log.diff?.reason && <p className="mt-1 text-xs">Reason: {log.diff.reason}</p>}
                {log.diff?.member_no && <p className="mt-1 text-xs">Member no: {log.diff.member_no}</p>}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ApplicationsTable() {
  const qc = useQueryClient();
  const list = useServerFn(listApplications);
  const setStatus = useServerFn(updateApplicationStatus);
  const del = useServerFn(deleteApplication);
  const [search, setSearch] = useState("");
  const [rejectTarget, setRejectTarget] = useState<any>(null);
  const [reason, setReason] = useState("");
  const [auditId, setAuditId] = useState<string | null>(null);

  const { data = [], isLoading, error } = useQuery({
    queryKey: KEY,
    queryFn: () => list(),
  });

  const statusMut = useMutation({
    mutationFn: (v: { id: string; status: "approved" | "rejected" | "pending"; reason?: string | null }) =>
      setStatus({ data: v }),
    onSuccess: (_r, v) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["admin", "members"] });
      qc.invalidateQueries({ queryKey: ["admin", "application-audit"] });
      toast.success(
        v.status === "approved" ? "Application approved" :
        v.status === "rejected" ? "Application rejected" : "Updated",
      );
      setRejectTarget(null);
      setReason("");
    },
    onError: (e: any) => {
      const msg = String(e?.message ?? "Failed");
      toast.error(/already been approved/i.test(msg) ? "This application has already been approved." : msg);
      qc.invalidateQueries({ queryKey: KEY });
    },
  });

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Removed");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const rows = (data as any[]).filter((r) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      r.first_name?.toLowerCase().includes(q) ||
      r.last_name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.phone?.toLowerCase().includes(q) ||
      r.status?.toLowerCase().includes(q)
    );
  });

  if (error) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search applications…"
        count={rows.length}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>County</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}><Skeleton className="h-6 w-full" /></TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                  No applications yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.first_name} {a.last_name}</TableCell>
                  <TableCell className="text-muted-foreground">{a.email}</TableCell>
                  <TableCell>{a.phone}</TableCell>
                  <TableCell>{a.county ?? "—"}</TableCell>
                  <TableCell>{a.membership_type ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={
                      a.status === "approved" ? "default" :
                      a.status === "rejected" ? "destructive" : "outline"
                    }>{a.status}</Badge>
                    {a.status === "rejected" && a.rejection_reason && (
                      <p className="mt-1 max-w-[16rem] text-xs text-muted-foreground">{a.rejection_reason}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {a.status !== "approved" && (
                      <Button size="icon" variant="ghost" title="Approve"
                        disabled={statusMut.isPending}
                        onClick={() => statusMut.mutate({ id: a.id, status: "approved" })}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {a.status !== "rejected" && (
                      <Button size="icon" variant="ghost" title="Reject"
                        onClick={() => { setRejectTarget(a); setReason(""); }}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" title="Audit trail"
                      onClick={() => setAuditId(a.id)}>
                      <History className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" title="Delete"
                      onClick={() => delMut.mutate(a.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!rejectTarget} onOpenChange={(v) => !v && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject application</DialogTitle>
            <DialogDescription>
              {rejectTarget ? `${rejectTarget.first_name} ${rejectTarget.last_name} will be marked rejected and removed from the members list.` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason (optional)</Label>
            <Textarea
              id="reject-reason"
              value={reason}
              maxLength={500}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Duplicate application, incomplete details…"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={statusMut.isPending}
              onClick={() => statusMut.mutate({ id: rejectTarget.id, status: "rejected", reason: reason.trim() || null })}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AuditDialog id={auditId} open={!!auditId} onOpenChange={(v) => !v && setAuditId(null)} />
    </div>
  );
}
