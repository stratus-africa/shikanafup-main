import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { MemberMasquerade } from "@/components/admin/members/member-masquerade";

export const Route = createFileRoute("/_authenticated/admin/ui/member-account/$memberId")({
  component: Page,
});

function Page() {
  const { memberId } = Route.useParams();
  return (
    <>
      <SiteHeader title="Member Account" />
      <div className="flex flex-1 flex-col p-4 lg:p-6">
        <MemberMasquerade memberId={memberId} />
      </div>
    </>
  );
}
