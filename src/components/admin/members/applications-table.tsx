import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./applicant-details-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, X, Trash2, History, MoreHorizontal, Eye } from "lucide-react";
import { ApplicantDetailsDialog } from "@/components/admin/members/applicant-details-dialog";
import {
  FilterBar,
  FilterField,
  SortHead,
  TablePagination,
  inDateRange,
  paginate,
  sortRows,
  useTableState,
} from "@/components/admin/_shared/table-toolkit";
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rejectTarget, setRejectTarget] = useState<any>(null);
  const [reason, setReason] = useState("");
  const [auditId, setAuditId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<any | null>(null);

  const table = useTableState("created_at", "desc");

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

  const types = useMemo(
    () =>
      Array.from(
        new Set((data as any[]).map((r) => r.membership_type).filter(Boolean) as string[]),
      ).sort(),
    [data],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data as any[]).filter((r) => {
      if (q) {
        const hay = [r.first_name, r.last_name, r.email, r.phone, r.county, r.status]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (typeFilter !== "all" && (r.membership_type ?? "") !== typeFilter) return false;
      if (!inDateRange(r.created_at, from, to)) return false;
      return true;
    });
  }, [data, search, statusFilter, typeFilter, from, to]);

  const sorted = useMemo(
    () =>
      sortRows(filtered, table.sort, table.dir, (r: any, key) => {
        switch (key) {
          case "name":
            return `${r.first_name ?? ""} ${r.last_name ?? ""}`.trim();
          case "email":
            return r.email;
          case "phone":
            return r.phone;
          case "county":
            return r.county;
          case "membership_type":
            return r.membership_type;
          case "status":
            return r.status;
          case "created_at":
            return r.created_at ? new Date(r.created_at).getTime() : null;
          default:
            return null;
        }
      }),
    [filtered, table.sort, table.dir],
  );

  const pageRows = paginate(
    sorted,
    Math.min(table.page, Math.max(1, Math.ceil(sorted.length / table.pageSize))),
    table.pageSize,
  );
  const hasFilters = !!search || statusFilter !== "all" || typeFilter !== "all" || !!from || !!to;
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setFrom("");
    setTo("");
    table.setPage(1);
  };

  if (error) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="sap-window">
      <FilterBar
        search={search}
        onSearch={(v) => {
          setSearch(v);
          table.setPage(1);
        }}
        placeholder="Search applications…"
        hasFilters={hasFilters}
        onReset={resetFilters}
      >
        <FilterField label="Status">
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              table.setPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>
        <FilterField label="Type">
          <Select
            value={typeFilter}
            onValueChange={(v) => {
              setTypeFilter(v);
              table.setPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {types.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>
        <FilterField label="Submitted from">
          <Input
            type="date"
            value={from}
            onChange={(e) => { setFrom(e.target.value); table.setPage(1); }}
            className="h-8 w-[150px] text-xs"
          />
        </FilterField>
        <FilterField label="Submitted to">
          <Input
            type="date"
            value={to}
            onChange={(e) => { setTo(e.target.value); table.setPage(1); }}
            className="h-8 w-[150px] text-xs"
          />
        </FilterField>
      </FilterBar>

      <div className="sap-grid">
        <Table>
          <TableHeader>
            <TableRow>
              <SortHead label="Name" sortKey="name" state={table} />
              <SortHead label="Email" sortKey="email" state={table} />
              <SortHead label="Phone" sortKey="phone" state={table} />
              <SortHead label="County" sortKey="county" state={table} />
              <SortHead label="Type" sortKey="membership_type" state={table} />
              <SortHead label="Status" sortKey="status" state={table} />
              <SortHead label="Submitted" sortKey="created_at" state={table} />
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}><Skeleton className="h-5 w-full" /></TableCell>
                </TableRow>
              ))
            ) : pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                  {hasFilters ? "No applications match these filters." : "No applications yet."}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((a: any) => (
                <TableRow key={a.id}>
                  <TableCell>{a.first_name} {a.last_name}</TableCell>
                  <TableCell className="text-muted-foreground">{a.email}</TableCell>
                  <TableCell>{a.phone}</TableCell>
                  <TableCell>{a.county ?? "—"}</TableCell>
                  <TableCell>{a.membership_type ?? "—"}</TableCell>
                  <TableCell>
                    <StatusBadge status={a.status} />
                    {a.status === "rejected" && a.rejection_reason && (
                      <p className="mt-1 max-w-[16rem] text-xs text-muted-foreground">{a.rejection_reason}</p>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setViewing(a)}>
                          <Eye className="mr-2 h-4 w-4" /> View applicant details
                        </DropdownMenuItem>
                        {a.status !== "approved" && (
                          <DropdownMenuItem
                            disabled={statusMut.isPending}
                            onSelect={() => statusMut.mutate({ id: a.id, status: "approved" })}
                          >
                            <Check className="mr-2 h-4 w-4" /> Approve
                          </DropdownMenuItem>
                        )}
                        {a.status !== "rejected" && (
                          <DropdownMenuItem onSelect={() => { setRejectTarget(a); setReason(""); }}>
                            <X className="mr-2 h-4 w-4" /> Reject
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onSelect={() => setAuditId(a.id)}>
                          <History className="mr-2 h-4 w-4" /> Audit trail
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onSelect={() => delMut.mutate(a.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination total={sorted.length} state={table} />

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

      <ApplicantDetailsDialog
        application={viewing}
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
      />

      <AuditDialog id={auditId} open={!!auditId} onOpenChange={(v) => !v && setAuditId(null)} />
    </div>
  );
}
