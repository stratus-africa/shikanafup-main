"use client"

import { Users, Lightbulb, Calendar, Megaphone, Award, BookOpen } from "lucide-react"

export function MembershipBenefits() {
  const benefits = [
    {
      icon: Users,
      title: "Community Network",
      description: "Connect with like-minded citizens working for national progress",
    },
    {
      icon: Lightbulb,
      title: "Thought Leadership",
      description: "Participate in policy discussions and shape party direction",
    },
    {
      icon: Calendar,
      title: "Exclusive Events",
      description: "Access members-only seminars, forums, and networking events",
    },
    {
      icon: Megaphone,
      title: "Amplified Voice",
      description: "Have your ideas heard and considered at all levels of the party",
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Get recognized for your contributions to the movement",
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      description: "Access materials on governance, policy, and civic engagement",
    },
  ]

  return (
    <section className="w-full py-8 md:py-12 bg-muted">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Membership Benefits</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Enjoy these exclusive benefits as a member of SFUP
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className="bg-background p-6 rounded-lg border border-border hover:border-secondary transition-colors"
              >
                <div className="bg-secondary p-3 rounded-lg mb-4 w-fit">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-foreground/70">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
