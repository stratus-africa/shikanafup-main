import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/_authenticated/admin/ui/settings")({
  component: Page,
});

function Page() {
  return (
    <>
      <SiteHeader title="Settings" />
      <div className="flex flex-1 flex-col p-6 text-sm text-muted-foreground">
        Coming soon.
      </div>
    </>
  );
}
