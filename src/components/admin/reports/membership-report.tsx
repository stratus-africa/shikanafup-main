import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { membershipReport } from "@/lib/admin/reports.functions";
import {
  MEMBERSHIP_REPORT_COLUMNS,
  toCsv,
  type MembershipReportRow,
} from "@/lib/admin/report-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import { TablePagination, useTableState } from "@/components/admin/_shared/table-toolkit";

export function MembershipReport() {
  const fetchReport = useServerFn(membershipReport);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [county, setCounty] = useState("");
  const t = useTableState("REGDATE");

  const { data, isLoading } = useQuery({
    queryKey: ["membership-report", from, to, county],
    queryFn: () =>
      fetchReport({ data: { from: from || undefined, to: to || undefined, county: county || undefined } }) as Promise<
        MembershipReportRow[]
      >,
  });

  const rows = useMemo(() => data ?? [], [data]);
  const paged = useMemo(
    () => rows.slice((t.page - 1) * t.pageSize, t.page * t.pageSize),
    [rows, t.page, t.pageSize],
  );

  const download = () => {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `membership-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sap-window">
      <div className="sap-titlebar flex items-center justify-between">
        <span>Membership Report</span>
        <span className="text-xs opacity-80">Party code 912</span>
      </div>

      <div className="flex flex-wrap items-end gap-3 border-b bg-muted/40 p-3">
        <div className="grid gap-1">
          <Label className="text-xs">Registered from</Label>
          <Input type="date" className="h-8 w-40" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <Label className="text-xs">Registered to</Label>
          <Input type="date" className="h-8 w-40" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <Label className="text-xs">County</Label>
          <Input className="h-8 w-48" placeholder="All counties" value={county} onChange={(e) => setCounty(e.target.value)} />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{rows.length} record(s)</span>
          <Button size="sm" onClick={download} disabled={!rows.length}>
            <Download className="mr-1 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="sap-grid">
          <TableHeader>
            <TableRow>
              {MEMBERSHIP_REPORT_COLUMNS.map((c) => (
                <TableHead key={c} className="whitespace-nowrap">{c}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {MEMBERSHIP_REPORT_COLUMNS.map((c) => (
                    <TableCell key={c}><Skeleton className="h-4 w-20" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={MEMBERSHIP_REPORT_COLUMNS.length} className="py-8 text-center text-muted-foreground">
                  No membership records match these filters.
                </TableCell>
              </TableRow>
            ) : (
              paged.map((r, i) => (
                <TableRow key={`${r.MEMBERSHIPNO}-${i}`}>
                  {MEMBERSHIP_REPORT_COLUMNS.map((c) => (
                    <TableCell key={c} className="whitespace-nowrap">{r[c]}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination total={rows.length} state={t} />

    </div>
  );
}
