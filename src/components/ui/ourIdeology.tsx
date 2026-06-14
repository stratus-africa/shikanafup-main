"use client"

import { Shield, Users, Landmark, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"

export function OurIdeology() {
  const principles = [
    {
      icon: Shield,
      title: "Resilience",
      subtitle: "National Consciousness",
      description:
        "Our journey upward as we navigate the challenging terrain of life’s many trials teaches us resilience and reminds us all to believe in our inner strength.",
    },
    {
      icon: Users,
      title: "Patriotism",
      subtitle: "Service to Kenya",
      description:
        "Unwavering loyalty to the Republic of Kenya, prioritizing the unity of all citizens and their collective good over narrow sectional interests.",
    },
    {
      icon: Landmark,
      title: "Strong Institutions",
      subtitle: "Robust Frameworks",
      description:
        "Effective leadership at the core of building robust institutional frameworks and systems that serve all citizens equitably.",
    },
    {
      icon: Zap,
      title: "Collective Progress",
      subtitle: "Shared Prosperity",
      description:
        "Equitable distribution of resources and mutual respect, creating a harmonious society built on shared values and sustainable development.",
    },
  ]

  return (
    <>
      <section className="py-8 md:py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-3">What We Believe</h2>
            <p className="text-lg text-muted-foreground">
              The Unity of All Kenyans
            </p>
          </div>

          {/* Main Ideology Statement */}
          <div className="space-y-4 max-w-4xl mx-auto text-center mb-12">
            <p className="text-lg leading-relaxed text-foreground/80">
              Enshrined as a core national value in our Constitution,
              SHIKANA embodies the deliberate quest for our nation’s consciousness,
              a shared awareness of who we are as a nation, expressed through our Kenyan identity, sovereignty,
              and pride. It calls on all Kenyans to rise above ethnic, political, social, and economic divisions and work together to shape our collective future.
            </p>
          </div>

          {/* Four Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((principle, index) => {
              const Icon = principle.icon
              return (
                <div
                  key={index}
                  className="text-center bg-muted p-6 transition-shadow rounded-lg border border-border"
                >
                  <div className="inline-block p-4 bg-secondary/10 rounded-full mb-4">
                    <Icon size={32} className="text-secondary" />
                  </div>

                  <h3 className="text-xl font-bold text-primary mb-1">{principle.title}</h3>
                  <p className="text-sm font-semibold text-secondary mb-3">{principle.subtitle}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{principle.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Blue shading to break white monotony */}
      <section className="py-12 md:py-16 px-4 bg-gray-50 border-t border-border">
        <div className="max-w-6xl mx-auto">
          {/* ideology */}
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Our Ideology</h2>
          </div>

          {/* Main Ideology Statement */}
          <div className="space-y-4 max-w-4xl mx-auto text-center mb-6">
            <p className="text-lg leading-relaxed text-foreground/80">
              Our Party is founded on the idea of nationalism which encompasses social and fiscal conservatism.
              On the one hand we have a fundamental duty of preserving our national and traditional beliefs of a morally stable,
              cohesive and just society. On the other hand, we have an obligation as a country
              to ensure that we have a socially and an economically empowered people. This can be achieved through focusing on
              prudently managing our national and natural resources, for the collective benefit and protection of the interest of our Cultures, Communities, Constituencies, Counties and the Country (5Cs).
            </p>
          </div>

          {/* Join Us Section */}
          <div className="w-full">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-3">
              Join Us
            </h2>

            {/* Intro statement */}
            <p className="text-lg md:text-xl leading-relaxed text-foreground/80 text-center max-w-3xl mx-auto mb-8">
              Multiple ways to get involved with <span className="font-semibold text-primary">SHIKANA FRONTLINERS FOR UNITY PARTY.</span>
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <li className="flex items-start gap-1">
                <span className="text-secondary font-bold mt-1">✓</span>
                <Link
                  href="/shared-ui/register"
                  className="text-foreground/80 hover:text-primary hover:underline transition-colors"
                >
                  Become a Member
                </Link>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-secondary font-bold mt-1">✓</span>
                <Link
                  href="/shared-ui/volunteer"
                  className="text-foreground/80 hover:text-primary hover:underline transition-colors"
                >
                  Become a Volunteer
                </Link>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-secondary font-bold mt-1">✓</span>
                <Link
                  href="/shared-ui/careers"
                  className="text-foreground/80 hover:text-primary hover:underline transition-colors"
                >
                  Become a Staff
                </Link>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-secondary font-bold mt-1">✓</span>
                <Link
                  href="/shared-ui/political-position"
                  className="text-foreground/80 hover:text-primary hover:underline transition-colors"
                >
                  Become An Aspirant
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
