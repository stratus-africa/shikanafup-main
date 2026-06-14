import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listMembers } from "@/lib/admin/members.functions";
import { listEvents } from "@/lib/admin/events.functions";
import { listDonations } from "@/lib/admin/donations.functions";
import { listAspirants } from "@/lib/admin/aspirants.functions";
import { listVolunteers } from "@/lib/admin/volunteers.functions";
import { listBlogs } from "@/lib/admin/blogs.functions";
import { Users, Calendar, HandCoins, UserCheck, HeartHandshake, Newspaper } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  component: DashboardPage,
});

function Stat({ label, value, icon: Icon, loading }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{value}</div>}
      </CardContent>
    </Card>
  );
}

function DashboardPage() {
  const members = useQuery({ queryKey: ["admin","members"], queryFn: useServerFn(listMembers) });
  const events = useQuery({ queryKey: ["admin","events"], queryFn: useServerFn(listEvents) });
  const donations = useQuery({ queryKey: ["admin","donations"], queryFn: useServerFn(listDonations) });
  const aspirants = useQuery({ queryKey: ["admin","aspirants"], queryFn: useServerFn(listAspirants) });
  const volunteers = useQuery({ queryKey: ["admin","volunteers"], queryFn: useServerFn(listVolunteers) });
  const blogs = useQuery({ queryKey: ["admin","blogs"], queryFn: useServerFn(listBlogs) });

  const totalDonated = (donations.data as any[] | undefined)?.filter(d => d.status === "completed")
    .reduce((s, d) => s + (d.amount_cents || 0), 0) ?? 0;

  return (
    <>
      <SiteHeader title="Dashboard" />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Stat label="Members" value={members.data?.length ?? 0} icon={Users} loading={members.isLoading} />
          <Stat label="Events" value={events.data?.length ?? 0} icon={Calendar} loading={events.isLoading} />
          <Stat label="Donations (KES)" value={`${(totalDonated/100).toLocaleString()}`} icon={HandCoins} loading={donations.isLoading} />
          <Stat label="Aspirants" value={aspirants.data?.length ?? 0} icon={UserCheck} loading={aspirants.isLoading} />
          <Stat label="Volunteers" value={volunteers.data?.length ?? 0} icon={HeartHandshake} loading={volunteers.isLoading} />
          <Stat label="Blog Posts" value={blogs.data?.length ?? 0} icon={Newspaper} loading={blogs.isLoading} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Recent Donations</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {(donations.data as any[] | undefined)?.slice(0, 5).map((d) => (
                <div key={d.id} className="flex justify-between border-b pb-1 last:border-0">
                  <span>{d.donor_name ?? d.donor?.full_name ?? "Anonymous"}</span>
                  <span className="font-mono">{d.currency} {(d.amount_cents/100).toLocaleString()}</span>
                </div>
              )) ?? <Skeleton className="h-32 w-full" />}
              {donations.data?.length === 0 && <p className="text-muted-foreground">No donations yet.</p>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Upcoming Events</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {(events.data as any[] | undefined)
                ?.filter(e => new Date(e.starts_at) >= new Date())
                .slice(0, 5).map((e) => (
                <div key={e.id} className="flex justify-between border-b pb-1 last:border-0">
                  <span className="truncate">{e.title}</span>
                  <span className="text-xs text-muted-foreground">{new Date(e.starts_at).toLocaleDateString()}</span>
                </div>
              )) ?? <Skeleton className="h-32 w-full" />}
              {events.data?.length === 0 && <p className="text-muted-foreground">No events scheduled.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
