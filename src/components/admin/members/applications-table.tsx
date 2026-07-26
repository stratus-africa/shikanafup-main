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
import { Check, X, Trash2 } from "lucide-react";
import { DataToolbar } from "@/components/admin/_shared/data-toolbar";
import {
  listApplications,
  updateApplicationStatus,
  deleteApplication,
} from "@/lib/admin/applications.functions";

const KEY = ["admin", "membership_applications"];

export function ApplicationsTable() {
  const qc = useQueryClient();
  const list = useServerFn(listApplications);
  const setStatus = useServerFn(updateApplicationStatus);
  const del = useServerFn(deleteApplication);
  const [search, setSearch] = useState("");

  const { data = [], isLoading, error } = useQuery({
    queryKey: KEY,
    queryFn: () => list(),
  });

  const statusMut = useMutation({
    mutationFn: (v: { id: string; status: "approved" | "rejected" | "pending" }) =>
      setStatus({ data: v }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      toast.success("Updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
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
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {a.status !== "approved" && (
                      <Button size="icon" variant="ghost" title="Approve"
                        onClick={() => statusMut.mutate({ id: a.id, status: "approved" })}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {a.status !== "rejected" && (
                      <Button size="icon" variant="ghost" title="Reject"
                        onClick={() => statusMut.mutate({ id: a.id, status: "rejected" })}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
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
    </div>
  );
}
