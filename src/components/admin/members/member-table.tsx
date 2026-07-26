import { useState } from "react";
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
  DialogTrigger,
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DataToolbar } from "@/components/admin/_shared/data-toolbar";
import {
  listMembers,
  updateMember,
  deleteMember,
} from "@/lib/admin/members.functions";

const KEY = ["admin", "members"];
const STATUSES = ["pending", "active", "suspended", "expired"] as const;

export function MembersTable() {
  const qc = useQueryClient();
  const list = useServerFn(listMembers);
  const update = useServerFn(updateMember);
  const del = useServerFn(deleteMember);

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDel, setConfirmDel] = useState<any | null>(null);

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

  const nameOf = (r: any) =>
    r.profile?.full_name ||
    [r.application?.first_name, r.application?.last_name].filter(Boolean).join(" ") ||
    null;
  const emailOf = (r: any) => r.profile?.email ?? r.application?.email ?? null;


  const rows = (data as any[]).filter((r) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      r.member_no?.toLowerCase().includes(q) ||
      nameOf(r)?.toLowerCase().includes(q) ||
      emailOf(r)?.toLowerCase().includes(q) ||
      r.status?.toLowerCase().includes(q)
    );
  });


  if (error) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load members: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataToolbar
        search={search}
        onSearch={setSearch}
        placeholder="Search members…"
        count={rows.length}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Local Group</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={8}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No members yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs">
                    {m.member_no ?? "—"}
                  </TableCell>
                  <TableCell>{nameOf(m) ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {emailOf(m) ?? "—"}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{m.status}</Badge>
                  </TableCell>
                  <TableCell>{m.tier ?? "—"}</TableCell>
                  <TableCell>{m.local_group?.name ?? "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {m.joined_at
                      ? new Date(m.joined_at).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setEditing(m)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setConfirmDel(m)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>{editing?.profile?.full_name}</DialogDescription>
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
            <AlertDialogDescription>
              This cannot be undone.
            </AlertDialogDescription>
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
