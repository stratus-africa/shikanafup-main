"use client"

import { Target, Eye } from "lucide-react"

export function MissionVision() {
  return (
    <section className="w-full py-8 md:py-12 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">What We Stand For</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Vision */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary p-3 rounded-lg">
                <Eye size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Our Vision</h2>
            </div>
            <p className="text-lg text-foreground/80 leading-relaxed">
              To secure upright, safe and progressive communities by creating for them a prosperous socio-economic
              environment that guarantees equal opportunities for all Kenyans to reach their personal goals and
              collective aspirations.
            </p>
            <ul className="space-y-3 mt-6">
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">✓</span>
                <span className="text-foreground/80">Upright, safe and progressive communities</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">✓</span>
                <span className="text-foreground/80">Prosperous socio-economic environment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">✓</span>
                <span className="text-foreground/80">Equal opportunities for all Kenyans</span>
              </li>
            </ul>
          </div>

          {/* Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-secondary p-3 rounded-lg">
                <Target size={28} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Our Mission</h2>
            </div>
            <p className="text-lg text-foreground/80 leading-relaxed">
              To continue building a democratic social order that honors the completeness of the law and the absolute
              consciousness of the Kenyan people while being guided by divinity that shows us the way of life so that
              everyone can speak the truth in love and act in peace and unity as those who are going to be judged
              according to their works.
            </p>
            <ul className="space-y-3 mt-6">
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">✓</span>
                <span className="text-foreground/80">Democratic social order honoring the law</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">✓</span>
                <span className="text-foreground/80">Guided by divinity and consciousness</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary font-bold mt-1">✓</span>
                <span className="text-foreground/80">Truth, love, peace and unity in action</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
