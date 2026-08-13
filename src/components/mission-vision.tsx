import { Target, Eye } from "lucide-react"
import { usePageContent } from "@/hooks/use-page-content"

export function MissionVision() {
  const { c } = usePageContent()
  const bullets = (prefix: string) =>
    [1, 2, 3].map((n) => c(`${prefix}_point${n}`)).filter(Boolean)

  return (
    <section className="w-full py-8 md:py-12 bg-background">
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            {c("site.about.stand_heading")}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Vision */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary p-3 rounded-lg">
                <Eye size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                {c("site.about.vision_heading")}
              </h2>
            </div>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {c("site.about.vision_text")}
            </p>
            <ul className="space-y-3 mt-6">
              {bullets("site.about.vision").map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="text-secondary font-bold mt-1">✓</span>
                  <span className="text-foreground/80">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-secondary p-3 rounded-lg">
                <Target size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                {c("site.about.mission_heading")}
              </h2>
            </div>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {c("site.about.mission_text")}
            </p>
            <ul className="space-y-3 mt-6">
              {bullets("site.about.mission").map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="text-secondary font-bold mt-1">✓</span>
                  <span className="text-foreground/80">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
