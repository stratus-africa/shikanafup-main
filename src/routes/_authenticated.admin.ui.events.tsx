import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { EventsTable } from "@/components/admin/events/view-update-event";

export const Route = createFileRoute("/_authenticated/admin/ui/events")({
  component: Page,
});

function Page() {
  return (
    <>
      <SiteHeader title="Events" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <EventsTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
