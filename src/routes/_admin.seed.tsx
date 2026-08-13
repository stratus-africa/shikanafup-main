import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_admin/seed")({
  component: SeedPage,
});

const SAMPLE_EVENTS = [
  {
    title: "National Party Convention 2024",
    description:
      "Annual national convention to discuss party policies, leadership, and strategic initiatives for the coming year.",
    location: "KICC, Nairobi",
    starts_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000).toISOString(),
    capacity: 5000,
    is_published: true,
  },
  {
    title: "County Leadership Training",
    description:
      "Training program for county-level party leaders on governance, policy implementation, and community engagement.",
    location: "Westlands, Nairobi",
    starts_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    capacity: 200,
    is_published: true,
  },
  {
    title: "Youth Engagement Summit",
    description:
      "Platform for youth members to share ideas, discuss youth-focused policies, and build networks within the party.",
    location: "Safari Park Hotel, Nairobi",
    starts_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    capacity: 300,
    is_published: true,
  },
  {
    title: "Constituency Outreach Program",
    description:
      "Community outreach initiative to engage constituents, address concerns, and promote party values at the grassroots level.",
    location: "Various Constituencies",
    starts_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    ends_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    capacity: 1000,
    is_published: true,
  },
];

const SAMPLE_MERCHANDISE = [
  {
    name: "SFUP Party T-Shirt (Blue)",
    description: "Premium quality cotton t-shirt with SFUP logo and party colors. Available in all sizes.",
    price_cents: 79900, // 799 KES
    stock: 150,
    is_active: true,
  },
  {
    name: "SFUP Cap/Hat",
    description: "Adjustable baseball cap with embroidered SFUP logo. Perfect for rallies and outdoor events.",
    price_cents: 39900, // 399 KES
    stock: 200,
    is_active: true,
  },
  {
    name: "SFUP Hoodie",
    description: "Comfortable heavyweight hoodie with SFUP branding. Great for all seasons.",
    price_cents: 149900, // 1499 KES
    stock: 100,
    is_active: true,
  },
  {
    name: "SFUP Wrist Band",
    description: "Durable silicone wrist band in party colors. Show your support!",
    price_cents: 19900, // 199 KES
    stock: 500,
    is_active: true,
  },
  {
    name: "SFUP Sticker Pack",
    description: "Set of 10 high-quality vinyl stickers featuring SFUP logo and party messages.",
    price_cents: 9900, // 99 KES
    stock: 1000,
    is_active: true,
  },
  {
    name: "SFUP Tote Bag",
    description:
      "Eco-friendly canvas tote bag with SFUP branding. Perfect for shopping and everyday use.",
    price_cents: 59900, // 599 KES
    stock: 150,
    is_active: true,
  },
];

function SeedPage() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ events: 0, merchandise: 0 });

  const seedData = async () => {
    if (!confirm("This will create sample events and merchandise. Continue?")) return;

    setLoading(true);
    try {
      // Check if user is authenticated and is staff
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in");
        setLoading(false);
        return;
      }

      // Check user role (simplified check)
      const { data: userRole, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!userRole || !["super_admin", "admin", "editor"].includes(userRole.role)) {
        toast.error("You must be a staff member to seed data");
        setLoading(false);
        return;
      }

      // Seed events
      const eventsData = SAMPLE_EVENTS.map((event) => ({
        ...event,
        created_by: user.id,
      }));

      const { error: eventsError } = await supabase.from("events").insert(eventsData);
      if (eventsError) throw eventsError;

      // Seed merchandise
      const { error: merchError } = await supabase.from("merchandise").insert(SAMPLE_MERCHANDISE);
      if (merchError) throw merchError;

      setStats({
        events: SAMPLE_EVENTS.length,
        merchandise: SAMPLE_MERCHANDISE.length,
      });

      toast.success(
        `✅ Seeding complete!\n${SAMPLE_EVENTS.length} events and ${SAMPLE_MERCHANDISE.length} merchandise items added.`,
      );
    } catch (error: any) {
      console.error("Seeding error:", error);
      toast.error(error?.message || "Failed to seed data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background py-12 px-4">
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-4 text-foreground">Seed Sample Data</h1>
          <p className="text-foreground/70 mb-6">
            This page allows staff members to populate the database with sample events and merchandise for testing and
            demonstration purposes.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Warning:</strong> This will add sample events and merchandise to your database. Make sure you're
              on the appropriate environment (development/staging).
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Events to be created:</h3>
              <ul className="space-y-2 ml-4">
                {SAMPLE_EVENTS.map((event, i) => (
                  <li key={i} className="text-sm text-foreground/70">
                    • {event.title} ({event.capacity} capacity)
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Merchandise to be created:</h3>
              <ul className="space-y-2 ml-4">
                {SAMPLE_MERCHANDISE.map((merch, i) => (
                  <li key={i} className="text-sm text-foreground/70">
                    • {merch.name} - {(merch.price_cents / 100).toFixed(0)} KES (stock: {merch.stock})
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={seedData}
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Seeding...
              </>
            ) : (
              "Seed Sample Data"
            )}
          </button>

          {stats.events > 0 && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✅ Successfully seeded {stats.events} events and {stats.merchandise} merchandise items!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
