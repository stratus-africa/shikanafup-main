import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { AuditLogsTable } from "@/components/admin/audit-trails/auditTrail-table";

export const Route = createFileRoute("/_authenticated/admin/ui/audit-trails")({
  component: Page,
});

function Page() {
  return (
    <>
      <SiteHeader title="Audit Trails" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <AuditLogsTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
