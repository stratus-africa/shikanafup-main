import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { BlogsTable } from "@/components/admin/blogs/blogs-table";

export const Route = createFileRoute("/_authenticated/admin/ui/blogs")({
  component: Page,
});

function Page() {
  return (
    <>
      <SiteHeader title="Blogs" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <BlogsTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
