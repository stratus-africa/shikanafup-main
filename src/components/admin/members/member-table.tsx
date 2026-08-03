import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, Trash2, MoreHorizontal, Eye } from "lucide-react";
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
  listMembers,
  updateMember,
  deleteMember,
} from "@/lib/admin/members.functions";

const KEY = ["admin", "members"];
const STATUSES = ["pending", "active", "suspended", "expired"] as const;

const nameOf = (r: any) =>
  r.profile?.full_name ||
  [r.application?.first_name, r.application?.last_name].filter(Boolean).join(" ") ||
  null;
const emailOf = (r: any) => r.profile?.email ?? r.application?.email ?? null;

// Membership standing derived from the linked application + member status
const standingOf = (
  r: any,
): { label: string; variant: "default" | "destructive" | "outline" | "secondary"; className?: string } => {
  const green =
    "border-green-600/30 bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300";
  const amber =
    "border-amber-600/30 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
  if (r.application?.status === "rejected") return { label: "Rejected", variant: "destructive" };
  if (r.application?.status === "pending")
    return { label: "Pending approval", variant: "outline", className: amber };
  if (r.status === "active") return { label: "Active", variant: "outline", className: green };
  if (r.status === "suspended") return { label: "Suspended", variant: "destructive" };
  if (r.status === "expired") return { label: "Inactive", variant: "secondary" };
  return { label: "Pending", variant: "outline", className: amber };
};

export function MembersTable() {
  const qc = useQueryClient();
  const list = useServerFn(listMembers);
  const update = useServerFn(updateMember);
  const del = useServerFn(deleteMember);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDel, setConfirmDel] = useState<any | null>(null);
  const [viewing, setViewing] = useState<any | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const table = useTableState("joined_at", "desc");

  const { data = [], isLoading, error } = useQuery({
    queryKey: KEY,
    queryFn: () => list(),
  });

  const updateMut = useMutation({
    mutationFn: (input: any) => update({ data: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Member updated");
      setEditing(null);
    },
    onError: (e: any) => toast.error(e.message ?? "Update failed"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Member removed");
      setConfirmDel(null);
    },
    onError: (e: any) => toast.error(e.message ?? "Delete failed"),
  });

  const tiers = useMemo(
    () =>
      Array.from(
        new Set((data as any[]).map((r) => r.tier).filter(Boolean) as string[]),
      ).sort(),
    [data],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data as any[]).filter((r) => {
      if (q) {
        const hay = [
          r.member_no,
          nameOf(r),
          emailOf(r),
          r.application?.phone,
          r.local_group?.name,
          standingOf(r).label,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusFilter !== "all" && standingOf(r).label !== statusFilter) return false;
      if (tierFilter !== "all" && (r.tier ?? "") !== tierFilter) return false;
      if (!inDateRange(r.joined_at ?? r.created_at, from, to)) return false;
      return true;
    });
  }, [data, search, statusFilter, tierFilter, from, to]);

  const sorted = useMemo(
    () =>
      sortRows(filtered, table.sort, table.dir, (r: any, key) => {
        switch (key) {
          case "member_no":
            return r.member_no;
          case "name":
            return nameOf(r);
          case "email":
            return emailOf(r);
          case "status":
            return standingOf(r).label;
          case "tier":
            return r.tier;
          case "local_group":
            return r.local_group?.name;
          case "joined_at":
            return r.joined_at ? new Date(r.joined_at).getTime() : null;
          default:
            return null;
        }
      }),
    [filtered, table.sort, table.dir],
  );

  const pageRows = paginate(sorted, Math.min(table.page, Math.max(1, Math.ceil(sorted.length / table.pageSize))), table.pageSize);
  const hasFilters =
    !!search || statusFilter !== "all" || tierFilter !== "all" || !!from || !!to;

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTierFilter("all");
    setFrom("");
    setTo("");
    table.setPage(1);
  };

  if (error) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load members: {(error as Error).message}
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
        placeholder="Search members…"
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
            <SelectTrigger className="h-8 w-[160px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {["Active", "Pending approval", "Suspended", "Inactive", "Rejected"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>
        <FilterField label="Tier">
          <Select
            value={tierFilter}
            onValueChange={(v) => {
              setTierFilter(v);
              table.setPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[150px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tiers</SelectItem>
              {tiers.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>
        <FilterField label="Joined from">
          <Input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              table.setPage(1);
            }}
            className="h-8 w-[150px] text-xs"
          />
        </FilterField>
        <FilterField label="Joined to">
          <Input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              table.setPage(1);
            }}
            className="h-8 w-[150px] text-xs"
          />
        </FilterField>
      </FilterBar>

      <div className="sap-grid">
        <Table>
          <TableHeader>
            <TableRow>
              <SortHead label="Member No." sortKey="member_no" state={table} />
              <SortHead label="Name" sortKey="name" state={table} />
              <SortHead label="Email" sortKey="email" state={table} />
              <SortHead label="Status" sortKey="status" state={table} />
              <SortHead label="Tier" sortKey="tier" state={table} />
              <SortHead label="Local Group" sortKey="local_group" state={table} />
              <SortHead label="Joined" sortKey="joined_at" state={table} />
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  {hasFilters ? "No members match these filters." : "No members yet."}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((m: any) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs">
                    {m.member_no ?? "—"}
                  </TableCell>
                  <TableCell>{nameOf(m) ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {emailOf(m) ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={standingOf(m).variant} className={standingOf(m).className}>{standingOf(m).label}</Badge>
                  </TableCell>
                  <TableCell>{m.tier ?? "—"}</TableCell>
                  <TableCell>{m.local_group?.name ?? "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {m.joined_at ? new Date(m.joined_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            setViewing(m.application ?? null);
                            setViewOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" /> View applicant details
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setEditing(m)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit member
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onSelect={() => setConfirmDel(m)}
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

      <ApplicantDetailsDialog
        application={viewing}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>{editing ? nameOf(editing) ?? "" : ""}</DialogDescription>
          </DialogHeader>
          {editing && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                updateMut.mutate({
                  id: editing.id,
                  member_no: fd.get("member_no") || undefined,
                  status: fd.get("status"),
                  tier: fd.get("tier") || null,
                });
              }}
              className="space-y-3"
            >
              <div>
                <Label>Member No.</Label>
                <Input name="member_no" defaultValue={editing.member_no ?? ""} />
              </div>
              <div>
                <Label>Status</Label>
                <Select name="status" defaultValue={editing.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tier</Label>
                <Input name="tier" defaultValue={editing.tier ?? ""} />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={updateMut.isPending}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete member?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDel && deleteMut.mutate(confirmDel.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
