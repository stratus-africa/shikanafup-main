import { TrendingUp, Users, MapPin, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";

export function ImpactStory() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(2082);
  }, []);

  // const impacts = [
  //   {
  //     icon: Users,
  //     stat: "50,000+",
  //     label: "Members Mobilized",
  //     description: "Active party members working toward our vision",
  //   },
  //   {
  //     icon: MapPin,
  //     stat: "25",
  //     label: "Regions Reached",
  //     description: "Nationwide presence and grassroots engagement",
  //   },
  //   {
  //     icon: TrendingUp,
  //     stat: "1,000+",
  //     label: "Events Organized",
  //     description: "Community events and civic engagement activities",
  //   },
  //   {
  //     icon: Zap,
  //     stat: "100%",
  //     label: "Transparent Spending",
  //     description: "Full accountability for all donations",
  //   },
  // ]

  return (
    <section className="w-full py-8 md:py-12 bg-muted">
      <div className="max-w-[1500px] mx-auto px-4">
        {/* Stats grid commented out for future use */}
        {/* ... stats grid ... */}
      </div>
    </section>
  );
}
