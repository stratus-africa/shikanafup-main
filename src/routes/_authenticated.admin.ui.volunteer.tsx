import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { VolunteerTable } from "@/components/admin/volunteer/volunteer-table";

export const Route = createFileRoute("/_authenticated/admin/ui/volunteer")({
  component: Page,
});

function Page() {
  return (
    <>
      <SiteHeader title="Volunteers" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <VolunteerTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
