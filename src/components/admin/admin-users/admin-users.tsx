import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DataToolbar } from "@/components/admin/_shared/data-toolbar";
import { listAdminUsers, createAdminUser, updateUserRoles, deleteAdminUser } from "@/lib/admin/auth.functions";

const KEY = ["admin", "admin-users"];
const ALL_ROLES = ["super_admin", "admin", "editor", "moderator", "member"] as const;

export function AdminUsersTable() {
  const qc = useQueryClient();
  const list = useServerFn(listAdminUsers);
  const create = useServerFn(createAdminUser);
  const updateRoles = useServerFn(updateUserRoles);
  const del = useServerFn(deleteAdminUser);

  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDel, setConfirmDel] = useState<any | null>(null);
  const [editRoles, setEditRoles] = useState<string[]>([]);

  const { data = [], isLoading, error } = useQuery({ queryKey: KEY, queryFn: () => list() });
  const inv = () => qc.invalidateQueries({ queryKey: KEY });

  const createMut = useMutation({
    mutationFn: (v: any) => create({ data: v }),
    onSuccess: () => { inv(); toast.success("Admin user invited"); setAdding(false); },
    onError: (e: any) => toast.error(e.message),
  });
  const rolesMut = useMutation({
    mutationFn: (v: any) => updateRoles({ data: v }),
    onSuccess: () => { inv(); toast.success("Roles updated"); setEditing(null); },
    onError: (e: any) => toast.error(e.message),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => del({ data: { user_id: id } }),
    onSuccess: () => { inv(); toast.success("Removed"); setConfirmDel(null); },
    onError: (e: any) => toast.error(e.message),
  });

  const rows = (data as any[]).filter((r) => {
    const q = search.toLowerCase();
    return !q || r.profile?.full_name?.toLowerCase().includes(q) || r.profile?.email?.toLowerCase().includes(q);
  });

  if (error) return <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">Failed to load: {(error as Error).message}</div>;

  return (
    <div className="space-y-4">
      <DataToolbar search={search} onSearch={setSearch} placeholder="Search admin users…" count={rows.length}>
        <Dialog open={adding} onOpenChange={setAdding}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Invite Admin</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Invite Admin User</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); createMut.mutate({
              email: fd.get("email"),
              full_name: fd.get("full_name"),
              phone: fd.get("phone") || undefined,
              role: fd.get("role"),
              send_invite: fd.get("send_invite") === "on",
            }); }} className="space-y-3">
              <div><Label>Email</Label><Input type="email" name="email" required /></div>
              <div><Label>Full Name</Label><Input name="full_name" required /></div>
              <div><Label>Phone</Label><Input name="phone" /></div>
              <div>
                <Label>Role</Label>
                <Select name="role" defaultValue="moderator">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">admin</SelectItem>
                    <SelectItem value="editor">editor</SelectItem>
                    <SelectItem value="moderator">moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2"><Switch id="send_invite" name="send_invite" defaultChecked /><Label htmlFor="send_invite">Send invite email</Label></div>
              <DialogFooter><Button type="submit" disabled={createMut.isPending}>Invite</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </DataToolbar>

      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Roles</TableHead><TableHead>Created</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {isLoading ? Array.from({ length: 5 }).map((_, i) => <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-6 w-full" /></TableCell></TableRow>)
              : rows.length === 0 ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No admin users yet.</TableCell></TableRow>
              : rows.map((u: any) => (
                <TableRow key={u.user_id}>
                  <TableCell className="font-medium">{u.profile?.full_name ?? "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.profile?.email ?? "—"}</TableCell>
                  <TableCell className="flex flex-wrap gap-1">{(u.roles ?? []).map((r: string) => <Badge key={r} variant="outline">{r}</Badge>)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" onClick={() => { setEditing(u); setEditRoles(u.roles ?? []); }}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => setConfirmDel(u)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Manage Roles</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">{editing.profile?.email}</div>
              {ALL_ROLES.map((r) => (
                <div key={r} className="flex items-center justify-between rounded border p-2">
                  <span className="text-sm">{r}</span>
                  <Switch checked={editRoles.includes(r)} onCheckedChange={(v) => setEditRoles((prev) => v ? [...new Set([...prev, r])] : prev.filter((x) => x !== r))} />
                </div>
              ))}
              <DialogFooter>
                <Button disabled={rolesMut.isPending} onClick={() => rolesMut.mutate({ user_id: editing.user_id, roles: editRoles })}>Save</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete admin user?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => confirmDel && deleteMut.mutate(confirmDel.user_id)}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
