import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { listJobApplications, updateApplicationStatus } from "@/lib/admin/jobs.functions";

const STATUSES = ["submitted", "reviewing", "shortlisted", "rejected", "hired"] as const;

export function ApplicationsTable({ jobId }: { jobId: string }) {
  const qc = useQueryClient();
  const list = useServerFn(listJobApplications);
  const setStatus = useServerFn(updateApplicationStatus);
  const KEY = ["admin", "job-applications", jobId];

  const { data = [], isLoading, error } = useQuery({
    queryKey: KEY,
    queryFn: () => list({ data: { job_id: jobId } }),
  });

  const mut = useMutation({
    mutationFn: (v: any) => setStatus({ data: v }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: KEY }); toast.success("Status updated"); },
    onError: (e: any) => toast.error(e.message),
  });

  if (error) return <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">Failed to load applications: {(error as Error).message}</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader><TableRow><TableHead>Applicant</TableHead><TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead>CV</TableHead><TableHead>Submitted</TableHead></TableRow></TableHeader>
        <TableBody>
          {isLoading ? Array.from({ length: 5 }).map((_, i) => <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-6 w-full" /></TableCell></TableRow>)
            : (data as any[]).length === 0 ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No applications yet.</TableCell></TableRow>
            : (data as any[]).map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.applicant_name ?? a.profile?.full_name ?? "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{a.applicant_email ?? a.profile?.email ?? "—"}</TableCell>
                <TableCell>
                  <Select defaultValue={a.status} onValueChange={(v) => mut.mutate({ id: a.id, status: v })}>
                    <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{a.cv_url ? <a className="text-primary underline" href={a.cv_url} target="_blank" rel="noreferrer">View</a> : <Badge variant="outline">None</Badge>}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
