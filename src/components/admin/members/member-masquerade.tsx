import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getMemberAccount,
  updateMemberProfile,
  setMemberPassword,
} from "@/lib/admin/members.functions";

export function MemberMasquerade({ memberId }: { memberId: string }) {
  const qc = useQueryClient();
  const fetchAccount = useServerFn(getMemberAccount);
  const saveProfile = useServerFn(updateMemberProfile);
  const savePassword = useServerFn(setMemberPassword);

  const key = ["admin", "member-account", memberId];
  const { data, isLoading, error } = useQuery({
    queryKey: key,
    queryFn: () => fetchAccount({ data: { id: memberId } }),
  });

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    county: "",
    constituency: "",
    ward: "",
  });
  const [password, setPassword] = useState("");

  useEffect(() => {
    const p = (data as any)?.member?.profile;
    const a = (data as any)?.member?.application;
    if (!data) return;
    setForm({
      full_name: p?.full_name ?? [a?.first_name, a?.last_name].filter(Boolean).join(" "),
      email: p?.email ?? a?.email ?? "",
      phone: p?.phone ?? a?.phone ?? "",
      county: p?.county ?? a?.county ?? "",
      constituency: p?.constituency ?? a?.constituency ?? "",
      ward: p?.ward ?? a?.ward ?? "",
    });
  }, [data]);

  const profileMut = useMutation({
    mutationFn: () => saveProfile({ data: { id: memberId, ...form } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ["admin", "members"] });
      toast.success("Member profile updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Update failed"),
  });

  const passwordMut = useMutation({
    mutationFn: () => savePassword({ data: { id: memberId, password } }),
    onSuccess: () => {
      setPassword("");
      toast.success("Password updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Could not set password"),
  });

  if (error) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        {(error as Error).message}
      </div>
    );
  }

  if (isLoading || !data) {
    return <Skeleton className="h-72 w-full" />;
  }

  const member = (data as any).member;
  const apps = (data as any).applications;
  const linked = !!(data as any).userId;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/ui/members">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to members
            </Link>
          </Button>
          <Badge variant="secondary">
            {member.member_no ?? "No member number"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary">
          <ShieldAlert className="h-4 w-4" />
          Masquerading — changes are made on behalf of this member and audited.
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Member profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-3 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                profileMut.mutate();
              }}
            >
              {(
                [
                  ["full_name", "Full name"],
                  ["email", "Email"],
                  ["phone", "Phone"],
                  ["county", "County"],
                  ["constituency", "Constituency"],
                  ["ward", "Ward"],
                ] as const
              ).map(([k, label]) => (
                <div key={k} className="space-y-1">
                  <Label htmlFor={k}>{label}</Label>
                  <Input
                    id={k}
                    value={(form as any)[k]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [k]: e.target.value }))
                    }
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <Button type="submit" disabled={!linked || profileMut.isPending}>
                  Save profile
                </Button>
                {!linked && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    This member has no login account yet, so profile edits are
                    unavailable.
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Membership</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Status</p>
                <p className="font-medium">{member.status}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Tier</p>
                <p className="font-medium">{member.tier ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Joined</p>
                <p className="font-medium">
                  {member.joined_at
                    ? new Date(member.joined_at).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  Local group
                </p>
                <p className="font-medium">{member.local_group?.name ?? "—"}</p>
              </div>
            </div>

            <div className="space-y-2 border-t pt-3">
              <Label htmlFor="new-password">Set new password</Label>
              <div className="flex gap-2">
                <Input
                  id="new-password"
                  type="text"
                  value={password}
                  placeholder="At least 8 characters"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  onClick={() => passwordMut.mutate()}
                  disabled={!linked || password.length < 8 || passwordMut.isPending}
                >
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Their applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ...apps.party.map((a: any) => ({
                  type: "Party position",
                  details: a.position?.title ?? "—",
                  ...a,
                })),
                ...apps.volunteer.map((a: any) => ({
                  type: "Volunteer",
                  details: (a.areas_of_interest ?? []).join(", ") || "—",
                  ...a,
                })),
              ].length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 text-center text-sm text-muted-foreground"
                  >
                    No applications submitted.
                  </TableCell>
                </TableRow>
              ) : (
                [
                  ...apps.party.map((a: any) => ({
                    type: "Party position",
                    details: a.position?.title ?? "—",
                    ...a,
                  })),
                  ...apps.volunteer.map((a: any) => ({
                    type: "Volunteer",
                    details: (a.areas_of_interest ?? []).join(", ") || "—",
                    ...a,
                  })),
                ].map((a: any) => (
                  <TableRow key={`${a.type}-${a.id}`}>
                    <TableCell>{a.type}</TableCell>
                    <TableCell>{a.details}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{a.status}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
