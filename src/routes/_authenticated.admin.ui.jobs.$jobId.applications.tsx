import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { ApplicationsTable } from "@/components/admin/jobs/applications/applications-table";

export const Route = createFileRoute("/_authenticated/admin/ui/jobs/$jobId/applications")({
  component: Page,
});

function Page() {
  const { jobId } = Route.useParams();
  return (
    <>
      <SiteHeader title="Job Applications" />
      <div className="flex flex-1 flex-col p-4">
        <ApplicationsTable jobId={jobId} />
      </div>
    </>
  );
}
