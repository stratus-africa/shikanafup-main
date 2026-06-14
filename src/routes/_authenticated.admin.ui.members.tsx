import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { MembersTable } from "@/components/admin/members/member-table";

export const Route = createFileRoute("/_authenticated/admin/ui/members")({
  component: Page,
});

function Page() {
  return (
    <>
      <SiteHeader title="Members" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <MembersTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
