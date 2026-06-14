import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import { listAuditLogs } from "@/lib/admin/audit.functions";

export function AuditLogsTable() {
  const fetchLogs = useServerFn(listAuditLogs);
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["admin", "audit-logs"],
    queryFn: () => fetchLogs({ data: { limit: 200 } }),
  });
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (data ?? []).filter(
      (r: any) =>
        r.action?.toLowerCase().includes(q) ||
        r.entity?.toLowerCase().includes(q) ||
        r.actor?.full_name?.toLowerCase().includes(q) ||
        r.entity_id?.toString().toLowerCase().includes(q),
    );
  }, [data, search]);

  if (error) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load audit logs: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search action, entity, actor…"
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="text-sm text-muted-foreground">{filtered.length} entries</span>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Entity ID</TableHead>
              <TableHead>Diff</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">
                  No audit entries yet.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row: any) => (
                <TableRow key={row.id}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {new Date(row.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>{row.actor?.full_name ?? row.actor?.email ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.action}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{row.entity}</TableCell>
                  <TableCell className="font-mono text-xs">{row.entity_id ?? "—"}</TableCell>
                  <TableCell className="max-w-md truncate text-xs text-muted-foreground">
                    {row.diff ? JSON.stringify(row.diff) : "—"}
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
