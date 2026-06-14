import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonationsTable } from "@/components/admin/donations/donation-table";

export const Route = createFileRoute("/_authenticated/admin/ui/donations")({
  component: Page,
});

function Page() {
  return (
    <>
      <SiteHeader title="Donations" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <Tabs defaultValue="individual" className="w-full">
                <TabsList>
                  <TabsTrigger value="individual">Individual</TabsTrigger>
                  <TabsTrigger value="organization">Organization</TabsTrigger>
                </TabsList>
                <TabsContent value="individual">
                  <DonationsTable type="individual" />
                </TabsContent>
                <TabsContent value="organization">
                  <DonationsTable type="organization" />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
