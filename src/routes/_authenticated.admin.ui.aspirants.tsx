import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspirantsTable } from "@/components/admin/aspirants/aspirants-table";

export const Route = createFileRoute("/_authenticated/admin/ui/aspirants")({
  component: Page,
});

function Page() {
  return (
    <>
      <SiteHeader title="Aspirants" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <Tabs defaultValue="political" className="w-full">
                <TabsList>
                  <TabsTrigger value="political">Political</TabsTrigger>
                  <TabsTrigger value="party">Party</TabsTrigger>
                </TabsList>
                <TabsContent value="political">
                  <AspirantsTable type="political" />
                </TabsContent>
                <TabsContent value="party">
                  <AspirantsTable type="party" />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
