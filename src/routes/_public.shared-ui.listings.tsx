import { createFileRoute } from "@tanstack/react-router";
import { seoHead, seoLoader } from "@/lib/seo";
import { ListingHero } from "@/components/listing-hero";
import ProductsGrid from "@/components/listing-grid";

export const Route = createFileRoute("/_public/shared-ui/listings")({
  loader: seoLoader("listings"),
  head: seoHead("listings"),
  component: ListingsPage,
});

function ListingsPage() {
  return (
    <main className="w-full">
      <ListingHero />
      <ProductsGrid />
    </main>
  );
}
