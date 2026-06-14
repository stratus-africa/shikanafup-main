import { createFileRoute } from "@tanstack/react-router";
import { ListingHero } from "@/components/listing-hero";
import ProductsGrid from "@/components/listing-grid";

export const Route = createFileRoute("/_public/listings")({
  head: () => ({
    meta: [
      { title: "Listings — SFUP" },
      { name: "description", content: "SFUP merchandise and listings." },
    ],
  }),
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
