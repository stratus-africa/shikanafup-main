import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, X, Trash2, MoreHorizontal, Eye } from "lucide-react";
import { RecordDetailsDialog } from "@/components/admin/_shared/record-details-dialog";
import {
  FilterBar, FilterField, SortHead, TablePagination, inDateRange, paginate, sortRows, useTableState,
} from "@/components/admin/_shared/table-toolkit";
import {
  listVolunteers, approveVolunteer, rejectVolunteer, deleteVolunteer,
} from "@/lib/admin/volunteers.functions";

const KEY = ["admin", "volunteers"];

export function VolunteerTable() {
  const qc = useQueryClient();
  const list = useServerFn(listVolunteers);
  const approve = useServerFn(approveVolunteer);
  const reject = useServerFn(rejectVolunteer);
  const del = useServerFn(deleteVolunteer);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [confirmDel, setConfirmDel] = useState<any | null>(null);
  const [viewing, setViewing] = useState<any | null>(null);
  const table = useTableState("created_at", "desc");

  const { data = [], isLoading, error } = useQuery({ queryKey: KEY, queryFn: () => list() });
  const inv = () => qc.invalidateQueries({ queryKey: KEY });

  const approveMut = useMutation({
    mutationFn: (id: string) => approve({ data: { id } }),
    onSuccess: () => { inv(); toast.success("Volunteer approved"); },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });
  const rejectMut = useMutation({
    mutationFn: (id: string) => reject({ data: { id } }),
    onSuccess: () => { inv(); toast.success("Volunteer rejected"); },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => { inv(); toast.success("Deleted"); setConfirmDel(null); },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const availabilities = useMemo(
    () => Array.from(new Set((data as any[]).map((r) => r.availability).filter(Boolean))).sort(),
    [data],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data as any[]).filter((r) => {
      if (q) {
        const hay = [
          r.profile?.full_name, r.profile?.email, r.profile?.phone, r.availability, r.status,
          Array.isArray(r.skills) ? r.skills.join(" ") : r.skills,
          Array.isArray(r.areas_of_interest) ? r.areas_of_interest.join(" ") : r.areas_of_interest,
        ].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (availabilityFilter !== "all" && (r.availability ?? "") !== availabilityFilter) return false;
      if (!inDateRange(r.created_at, from, to)) return false;
      return true;
    });
  }, [data, search, statusFilter, availabilityFilter, from, to]);

  const sorted = useMemo(
    () => sortRows(filtered, table.sort, table.dir, (r: any, key) => {
      switch (key) {
        case "name": return r.profile?.full_name;
        case "email": return r.profile?.email;
        case "skills": return Array.isArray(r.skills) ? r.skills.join(", ") : r.skills;
        case "availability": return r.availability;
        case "status": return r.status;
        case "created_at": return r.created_at ? new Date(r.created_at).getTime() : null;
        default: return null;
      }
    }),
    [filtered, table.sort, table.dir],
  );

  const pageRows = paginate(
    sorted,
    Math.min(table.page, Math.max(1, Math.ceil(sorted.length / table.pageSize))),
    table.pageSize,
  );
  const hasFilters = !!search || statusFilter !== "all" || availabilityFilter !== "all" || !!from || !!to;
  const resetFilters = () => {
    setSearch(""); setStatusFilter("all"); setAvailabilityFilter("all"); setFrom(""); setTo(""); table.setPage(1);
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
        onSearch={(v) => { setSearch(v); table.setPage(1); }}
        placeholder="Search volunteers…"
        hasFilters={hasFilters}
        onReset={resetFilters}
      >
        <FilterField label="Status">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); table.setPage(1); }}>
            <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </FilterField>
        <FilterField label="Availability">
          <Select value={availabilityFilter} onValueChange={(v) => { setAvailabilityFilter(v); table.setPage(1); }}>
            <SelectTrigger className="h-8 w-[150px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All availability</SelectItem>
              {availabilities.map((a: any) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        </FilterField>
        <FilterField label="Applied from">
          <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); table.setPage(1); }} className="h-8 w-[150px] text-xs" />
        </FilterField>
        <FilterField label="Applied to">
          <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); table.setPage(1); }} className="h-8 w-[150px] text-xs" />
        </FilterField>
      </FilterBar>

      <div className="sap-grid">
        <Table>
          <TableHeader>
            <TableRow>
              <SortHead label="Volunteer" sortKey="name" state={table} />
              <SortHead label="Email" sortKey="email" state={table} />
              <SortHead label="Skills" sortKey="skills" state={table} />
              <SortHead label="Availability" sortKey="availability" state={table} />
              <SortHead label="Status" sortKey="status" state={table} />
              <SortHead label="Applied" sortKey="created_at" state={table} />
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={7}><Skeleton className="h-5 w-full" /></TableCell></TableRow>
              ))
            ) : pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">
                  {hasFilters ? "No volunteers match these filters." : "No volunteers yet."}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((v: any) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">{v.profile?.full_name ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{v.profile?.email ?? "—"}</TableCell>
                  <TableCell className="max-w-xs truncate text-xs">
                    {Array.isArray(v.skills) ? v.skills.join(", ") : v.skills ?? "—"}
                  </TableCell>
                  <TableCell className="text-xs">{v.availability ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant={v.status === "approved" ? "default" : v.status === "rejected" ? "destructive" : "outline"}>
                      {v.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {v.created_at ? new Date(v.created_at).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-7 w-7" aria-label="Actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setViewing(v)}>
                          <Eye className="mr-2 h-4 w-4" /> View volunteer details
                        </DropdownMenuItem>
                        {v.status !== "approved" && (
                          <DropdownMenuItem disabled={approveMut.isPending} onSelect={() => approveMut.mutate(v.id)}>
                            <Check className="mr-2 h-4 w-4" /> Approve
                          </DropdownMenuItem>
                        )}
                        {v.status !== "rejected" && (
                          <DropdownMenuItem disabled={rejectMut.isPending} onSelect={() => rejectMut.mutate(v.id)}>
                            <X className="mr-2 h-4 w-4" /> Reject
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setConfirmDel(v)}>
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

      <RecordDetailsDialog
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
        title="Volunteer details"
        status={viewing?.status}
        subtitle={viewing?.profile?.full_name ?? viewing?.profile?.email ?? ""}
        fields={[
          { label: "Full name", value: viewing?.profile?.full_name },
          { label: "Email", value: viewing?.profile?.email },
          { label: "Phone", value: viewing?.profile?.phone },
          { label: "County", value: viewing?.profile?.county },
          { label: "Constituency", value: viewing?.profile?.constituency },
          { label: "Ward", value: viewing?.profile?.ward },
          { label: "Availability", value: viewing?.availability },
          { label: "Status", value: viewing?.status },
          { label: "Applied", value: viewing?.created_at ? new Date(viewing.created_at).toLocaleString() : null },
          { label: "Reviewed", value: viewing?.reviewed_at ? new Date(viewing.reviewed_at).toLocaleString() : null },
          { label: "Reviewer", value: viewing?.reviewer?.full_name ?? viewing?.reviewer?.email },
          { label: "Skills", value: viewing?.skills, full: true },
          { label: "Areas of interest", value: viewing?.areas_of_interest, full: true },
          { label: "Notes", value: viewing?.notes, full: true },
        ]}
      />

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete volunteer entry?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmDel && deleteMut.mutate(confirmDel.id)}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
