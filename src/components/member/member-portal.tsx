import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import toast from "react-hot-toast";
import {
  getMyMembership,
  listOpenPositions,
  listMyApplications,
  applyForPartyPosition,
  applyForVolunteering,
} from "@/lib/member/portal.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    mutationFn: () =>
      applyParty({ data: { position_id: positionId, motivation, experience } }),
    onSuccess: () => {
      toast.success("Application submitted");
      setPositionId(""); setMotivation(""); setExperience("");
      qc.invalidateQueries({ queryKey: ["my-applications"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not submit application"),
  });

  const volunteerMutation = useMutation({
    mutationFn: () =>
      applyVolunteer({
        data: {
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
          areas_of_interest: interests.split(",").map((s) => s.trim()).filter(Boolean),
          availability,
        },
      }),
    onSuccess: () => {
      toast.success("Volunteer application submitted");
      setSkills(""); setInterests(""); setAvailability("");
      qc.invalidateQueries({ queryKey: ["my-applications"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Could not submit application"),
  });

  const m: any = membership.data ?? {};
  const app = m.application ?? {};
  const profile = m.profile ?? {};
  const member = m.member ?? null;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Membership</h1>
        <p className="text-muted-foreground">
          Manage your profile and apply for party or volunteer positions.
        </p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="apply">Apply</TabsTrigger>
          <TabsTrigger value="applications">My applications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Membership details</CardTitle>
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
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {membership.isLoading ? (
                Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-10" />)
              ) : (
                <>
                  <Row label="Membership no." value={member?.member_no} />
                  <Row label="Party code" value="912" />
                  <Row label="Name" value={[app.first_name, app.last_name].filter(Boolean).join(" ") || profile.full_name} />
                  <Row label="Email" value={profile.email ?? app.email} />
                  <Row label="Phone" value={profile.phone ?? app.phone} />
                  <Row label="ID / Passport" value={app.id_no ?? profile.id_number} />
                  <Row label="County" value={app.county ?? profile.county} />
                  <Row label="Constituency" value={app.constituency ?? profile.constituency} />
                  <Row label="Ward" value={app.ward ?? profile.ward} />
                  <Row label="Membership type" value={app.membership_type ?? member?.tier} />
                  <Row label="Joined" value={member?.joined_at ? new Date(member.joined_at).toLocaleDateString() : ""} />
                  <Row label="Applied" value={app.created_at ? new Date(app.created_at).toLocaleDateString() : ""} />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apply" className="mt-4 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Apply for a party position</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Position</Label>
                <Select value={positionId} onValueChange={setPositionId}>
                  <SelectTrigger><SelectValue placeholder="Select a position" /></SelectTrigger>
                  <SelectContent>
                    {(positions.data?.party ?? []).map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
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

          <Card>
            <CardHeader><CardTitle>Apply to volunteer</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Skills (comma separated)</Label>
                <Input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Mobilization, Design" />
              </div>
              <div className="grid gap-2">
                <Label>Areas of interest (comma separated)</Label>
                <Input value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="Youth, Civic education" />
              </div>
              <div className="grid gap-2">
                <Label>Availability</Label>
                <Input value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="Weekends" />
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

        <TabsContent value="applications" className="mt-4 space-y-6">
          <Card>
            <CardHeader><CardTitle>Party position applications</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(mine.data?.party ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">No applications yet.</p>
              )}
              {(mine.data?.party ?? []).map((a: any) => (
                <div key={a.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-medium">{a.position?.title ?? "Position"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={a.status === "approved" ? "default" : a.status === "rejected" ? "destructive" : "secondary"}>
                    {a.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Volunteer applications</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(mine.data?.volunteer ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">No applications yet.</p>
              )}
              {(mine.data?.volunteer ?? []).map((a: any) => (
                <div key={a.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-medium">{(a.areas_of_interest ?? []).join(", ") || "Volunteer"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={a.status === "approved" ? "default" : a.status === "rejected" ? "destructive" : "secondary"}>
                    {a.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
