import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import {
  getMyMembership,
  listOpenPositions,
  listMyApplications,
  applyForPartyPosition,
  applyForVolunteering,
  updateMyProfile,
} from "@/lib/member/portal.functions";
import { ApplicationTimeline } from "@/components/member/application-timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, FileText, Send, ShieldCheck, UserRound } from "lucide-react";

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

export function MemberPortal() {
  const qc = useQueryClient();
  const fetchMembership = useServerFn(getMyMembership);
  const fetchPositions = useServerFn(listOpenPositions);
  const fetchMine = useServerFn(listMyApplications);
  const applyParty = useServerFn(applyForPartyPosition);
  const applyVolunteer = useServerFn(applyForVolunteering);

  const membership = useQuery({ queryKey: ["my-membership"], queryFn: () => fetchMembership() });
  const positions = useQuery({ queryKey: ["open-positions"], queryFn: () => fetchPositions() });
  const mine = useQuery({ queryKey: ["my-applications"], queryFn: () => fetchMine() });

  const [positionId, setPositionId] = useState("");
  const [motivation, setMotivation] = useState("");
  const [experience, setExperience] = useState("");

  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [availability, setAvailability] = useState("");

  const partyMutation = useMutation({
    mutationFn: () => applyParty({ data: { position_id: positionId, motivation, experience } }),
    onSuccess: () => {
      toast.success("Application submitted");
      setPositionId("");
      setMotivation("");
      setExperience("");
      qc.invalidateQueries({ queryKey: ["my-applications"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not submit application"),
  });

  const volunteerMutation = useMutation({
    mutationFn: () =>
      applyVolunteer({
        data: {
          skills: skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          areas_of_interest: interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          availability,
        },
      }),
    onSuccess: () => {
      toast.success("Volunteer application submitted");
      setSkills("");
      setInterests("");
      setAvailability("");
      qc.invalidateQueries({ queryKey: ["my-applications"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not submit application"),
  });

  const m: any = membership.data ?? {};
  const app = m.application ?? {};
  const profile = m.profile ?? {};
  const member = m.member ?? null;

  const saveProfile = useServerFn(updateMyProfile);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    county: "",
    constituency: "",
    ward: "",
  });
  useEffect(() => {
    if (!membership.data) return;
    setForm({
      full_name: profile.full_name ?? [app.first_name, app.last_name].filter(Boolean).join(" ") ?? "",
      phone: profile.phone ?? app.phone ?? "",
      county: profile.county ?? app.county ?? "",
      constituency: profile.constituency ?? app.constituency ?? "",
      ward: profile.ward ?? app.ward ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membership.data]);

  const profileMutation = useMutation({
    mutationFn: () => saveProfile({ data: form }),
    onSuccess: () => {
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["my-membership"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not update profile"),
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const displayName =
    [app.first_name, app.last_name].filter(Boolean).join(" ") || profile.full_name || "Shikana Member";
  const membershipLabel =
    member?.status === "active"
      ? "Active member"
      : app.status === "rejected"
        ? "Application rejected"
        : app.id
          ? "Pending approval"
          : "No application";

  return (
    <div className="min-h-screen bg-[#f5f8fb] pb-24 lg:pb-10">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <a href="/" className="flex items-center gap-3">
            <img src="/SFU-LOGO.png" alt="Shikana Frontliners for Unity Party" className="size-10 object-contain" />
            <div>
              <p className="text-sm font-bold text-secondary">Shikana Frontliners</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Member portal</p>
            </div>
          </a>
          <Badge
            className={
              member?.status === "active"
                ? "border-0 bg-emerald-600 text-white hover:bg-emerald-600"
                : "border-0 bg-primary text-white"
            }
          >
            {membershipLabel}
          </Badge>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="relative overflow-hidden bg-secondary px-6 py-8 text-white sm:px-9 sm:py-10">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.12),transparent_65%)]" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/55">My Shikana</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Welcome back, {displayName.split(" ")[0]}.</h1>
            <p className="mt-3 max-w-xl text-white/70">
              Manage your membership, applications and contact information in one place.
            </p>
          </div>
        </section>

        <Tabs defaultValue="profile" className="mt-8 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
          <TabsList className="fixed inset-x-4 bottom-4 z-30 grid h-auto grid-cols-3 border border-border bg-white p-1.5 shadow-xl lg:sticky lg:top-6 lg:inset-auto lg:h-fit lg:grid-cols-1 lg:self-start lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            <TabsTrigger
              value="profile"
              className="flex min-h-12 flex-col gap-1 text-[10px] font-bold uppercase tracking-wide data-[state=active]:bg-secondary data-[state=active]:text-white lg:flex-row lg:justify-start lg:gap-3 lg:rounded-none lg:border-l-2 lg:border-transparent lg:px-4 lg:text-sm lg:normal-case lg:tracking-normal lg:data-[state=active]:border-primary"
            >
              <UserRound className="size-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="apply"
              className="flex min-h-12 flex-col gap-1 text-[10px] font-bold uppercase tracking-wide data-[state=active]:bg-secondary data-[state=active]:text-white lg:flex-row lg:justify-start lg:gap-3 lg:rounded-none lg:border-l-2 lg:border-transparent lg:px-4 lg:text-sm lg:normal-case lg:tracking-normal lg:data-[state=active]:border-primary"
            >
              <Send className="size-4" />
              Apply
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="flex min-h-12 flex-col gap-1 text-[10px] font-bold uppercase tracking-wide data-[state=active]:bg-secondary data-[state=active]:text-white lg:flex-row lg:justify-start lg:gap-3 lg:rounded-none lg:border-l-2 lg:border-transparent lg:px-4 lg:text-sm lg:normal-case lg:tracking-normal lg:data-[state=active]:border-primary"
            >
              <ClipboardList className="size-4" />
              Applications
            </TabsTrigger>
          </TabsList>
          <div className="min-w-0">
            <TabsContent value="profile" className="mt-0 space-y-6">
              <section className="grid gap-5 sm:grid-cols-2">
                <div className="border border-border bg-white p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        Membership status
                      </p>
                      <p className="mt-3 text-xl font-bold text-secondary">{membershipLabel}</p>
                    </div>
                    <ShieldCheck className="size-7 text-primary" />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Your current membership record at a glance.</p>
                </div>
                <div className="border border-border bg-white p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        Membership number
                      </p>
                      <p className="mt-3 text-xl font-bold text-secondary">{member?.member_no || "—"}</p>
                    </div>
                    <FileText className="size-7 text-primary" />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Party code: 912</p>
                </div>
              </section>
              <Card className="rounded-none border-border shadow-sm">
                <CardHeader className="flex-row items-center justify-between border-b border-border">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Member record</p>
                    <CardTitle className="mt-2 text-2xl text-secondary">Membership details</CardTitle>
                  </div>
                  {member ? (
                    <Badge>{member.status === "active" ? "Active member" : member.status}</Badge>
                  ) : app.status === "rejected" ? (
                    <Badge variant="destructive">Rejected</Badge>
                  ) : app.id ? (
                    <Badge variant="secondary">Pending approval</Badge>
                  ) : (
                    <Badge variant="outline">No application found</Badge>
                  )}
                </CardHeader>
                <CardContent className="grid gap-x-8 py-3 sm:grid-cols-2 lg:grid-cols-3">
                  {membership.isLoading ? (
                    Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-10" />)
                  ) : (
                    <>
                      <Row label="Membership no." value={member?.member_no} />
                      <Row label="Party code" value="912" />
                      <Row
                        label="Name"
                        value={[app.first_name, app.last_name].filter(Boolean).join(" ") || profile.full_name}
                      />
                      <Row label="Email" value={profile.email ?? app.email} />
                      <Row label="Phone" value={profile.phone ?? app.phone} />
                      <Row label="ID / Passport" value={app.id_no ?? profile.id_number} />
                      <Row label="County" value={app.county ?? profile.county} />
                      <Row label="Constituency" value={app.constituency ?? profile.constituency} />
                      <Row label="Ward" value={app.ward ?? profile.ward} />
                      <Row label="Membership type" value={app.membership_type ?? member?.tier} />
                      <Row
                        label="Joined"
                        value={member?.joined_at ? new Date(member.joined_at).toLocaleDateString() : ""}
                      />
                      <Row
                        label="Applied"
                        value={app.created_at ? new Date(app.created_at).toLocaleDateString() : ""}
                      />
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-none border-border shadow-sm">
                <CardHeader className="border-b border-border">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Keep your record current</p>
                  <CardTitle className="mt-2 text-2xl text-secondary">Update contact details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="grid gap-2">
                    <Label>Full name</Label>
                    <Input value={form.full_name} onChange={set("full_name")} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Mobile number</Label>
                    <Input value={form.phone} onChange={set("phone")} placeholder="07xx xxx xxx" />
                  </div>
                  <div className="grid gap-2">
                    <Label>County</Label>
                    <Input value={form.county} onChange={set("county")} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Constituency</Label>
                    <Input value={form.constituency} onChange={set("constituency")} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Ward</Label>
                    <Input value={form.ward} onChange={set("ward")} />
                  </div>
                  <div className="flex items-end">
                    <Button
                      className="w-full"
                      disabled={profileMutation.isPending}
                      onClick={() => profileMutation.mutate()}
                    >
                      {profileMutation.isPending ? "Saving…" : "Save changes"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="apply" className="mt-0 grid gap-6 lg:grid-cols-2">
              <Card className="rounded-none border-border shadow-sm">
                <CardHeader className="border-b border-border">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Leadership</p>
                  <CardTitle className="mt-2 text-2xl text-secondary">Apply for a party position</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Position</Label>
                    <Select value={positionId} onValueChange={setPositionId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                      <SelectContent>
                        {(positions.data?.party ?? []).map((p: any) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Why are you applying?</Label>
                    <Textarea rows={4} value={motivation} onChange={(e) => setMotivation(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Relevant experience</Label>
                    <Textarea rows={3} value={experience} onChange={(e) => setExperience(e.target.value)} />
                  </div>
                  <Button
                    className="w-full"
                    disabled={!positionId || partyMutation.isPending}
                    onClick={() => partyMutation.mutate()}
                  >
                    {partyMutation.isPending ? "Submitting…" : "Submit application"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-none border-border shadow-sm">
                <CardHeader className="border-b border-border">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Community</p>
                  <CardTitle className="mt-2 text-2xl text-secondary">Apply to volunteer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Skills (comma separated)</Label>
                    <Input
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="Mobilization, Design"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Areas of interest (comma separated)</Label>
                    <Input
                      value={interests}
                      onChange={(e) => setInterests(e.target.value)}
                      placeholder="Youth, Civic education"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Availability</Label>
                    <Input
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      placeholder="Weekends"
                    />
                  </div>
                  <Button
                    className="w-full"
                    disabled={volunteerMutation.isPending}
                    onClick={() => volunteerMutation.mutate()}
                  >
                    {volunteerMutation.isPending ? "Submitting…" : "Submit application"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="mt-0 space-y-6">
              <Card className="rounded-none border-border shadow-sm">
                <CardHeader className="border-b border-border">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">My activity</p>
                  <CardTitle className="mt-2 text-2xl text-secondary">Party position applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(mine.data?.party ?? []).length === 0 && (
                    <p className="text-sm text-muted-foreground">No applications yet.</p>
                  )}
                  {(mine.data?.party ?? []).map((a: any) => (
                    <div key={a.id} className="border border-border bg-muted/30 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{a.position?.title ?? "Position"}</p>
                          <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge
                          className="shrink-0"
                          variant={
                            a.status === "approved" ? "default" : a.status === "rejected" ? "destructive" : "secondary"
                          }
                        >
                          {a.status}
                        </Badge>
                      </div>
                      <ApplicationTimeline
                        status={a.status}
                        createdAt={a.created_at}
                        reviewedAt={a.reviewed_at}
                        notes={a.notes}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-none border-border shadow-sm">
                <CardHeader className="border-b border-border">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">My activity</p>
                  <CardTitle className="mt-2 text-2xl text-secondary">Volunteer applications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {(mine.data?.volunteer ?? []).length === 0 && (
                    <p className="text-sm text-muted-foreground">No applications yet.</p>
                  )}
                  {(mine.data?.volunteer ?? []).map((a: any) => (
                    <div key={a.id} className="border border-border bg-muted/30 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {(a.areas_of_interest ?? []).join(", ") || "Volunteer"}
                          </p>
                          <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge
                          className="shrink-0"
                          variant={
                            a.status === "approved" ? "default" : a.status === "rejected" ? "destructive" : "secondary"
                          }
                        >
                          {a.status}
                        </Badge>
                      </div>
                      <ApplicationTimeline
                        status={a.status}
                        createdAt={a.created_at}
                        reviewedAt={a.reviewed_at}
                        notes={a.notes}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
