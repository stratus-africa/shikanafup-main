import { TrendingUp, Users, MapPin, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";

export function ImpactStory() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(2082);
  }, []);

  return (
    <div className="w-full">
      {/* Transparency Statement */}
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-foreground mb-4">Financial Transparency</h3>
        <p className="text-lg text-foreground/70 mb-6 max-w-2xl mx-auto">
          We believe in complete transparency. All donations are tracked and reported according to campaign finance
          regulations. Download our annual financial reports to see exactly how funds are used.
        </p>
        <button className="bg-secondary text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary/90 transition-colors">
          View Financial Reports
        </button>
      </div>
    </div>
  );
}
