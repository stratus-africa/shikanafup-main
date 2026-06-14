"use client"

import {
  Landmark,
  Users,
  Gavel,
  BookOpen,
  ShieldCheck,
  MessageSquare,
  Handshake,
  HeartHandshake,
  Scale,
  BrainCircuit,
  Leaf,
  Flag,
  Trophy,
  Eye,
  Globe,
} from "lucide-react"

export function ValuesSection() {
  const values = [
    {
      icon: Landmark,
      title: "Limited Government",
      description: "Belief in a government that empowers citizens rather than controlling them.",
    },
    {
      icon: Users,
      title: "Sovereignty of the People",
      description: "Power belongs to the people, who delegate it to state organs.",
    },
    {
      icon: Gavel,
      title: "Respect to the Rule of Law",
      description: "Equality before the law and adherence to legal principles.",
    },
    {
      icon: BookOpen,
      title: "Supremacy of Constitution",
      description: "The Constitution is the supreme law binding all persons and state organs.",
    },
    {
      icon: ShieldCheck,
      title: "National and Personal Security",
      description: "Commitment to the safety and security of every individual and the nation.",
    },
    {
      icon: MessageSquare,
      title: "People's Consultative Assembly",
      description: "Valuing dialogue and consultation in decision-making processes.",
    },
    {
      icon: Handshake,
      title: "Personal and Collective Responsibility",
      description: "Every citizen has a duty to contribute to the well-being of the nation.",
    },
    {
      icon: HeartHandshake,
      title: "Strong Families and Caring Communities",
      description: "The family unit and community support systems are the foundation of society.",
    },
    {
      icon: Scale,
      title: "Equal Citizenship and Opportunities",
      description: "Fair chances for all Kenyans to reach their potential regardless of background.",
    },
    {
      icon: BrainCircuit,
      title: "Informed Individual Choices",
      description: "Empowering citizens with knowledge to make independent decisions.",
    },
    {
      icon: Leaf,
      title: "Sustainable Development",
      description: "Responsible stewardship of our environment for future generations.",
    },
    {
      icon: Flag,
      title: "Loyalty to Country",
      description: "Unwavering commitment to Kenya and its democratic ideals.",
    },
    {
      icon: Trophy,
      title: "Competitive Enterprise",
      description: "Encouraging innovation, hard work, and rewarding achievement.",
    },
    {
      icon: Eye,
      title: "Integrity and Accountability",
      description: "Transparency and ethical conduct in public service and leadership.",
    },
    {
      icon: Globe,
      title: "International Cooperation",
      description: "Fostering mutual respect and collaboration with the global community.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-16 bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Our Party Values</h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            We believe in our party vision, mission and ideology. Pursuant to the provisions of Article 10 of the
            Constitution of Kenya, we shall achieve a just, morally upright and prosperous society based on but not
            limited to the following national and traditional values:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <div
                key={index}
                className="bg-muted p-6 rounded-xl border border-border shadow-sm hover:shadow-md hover:border-secondary/50 transition-all duration-300 group"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-secondary/10 p-3 rounded-lg group-hover:bg-secondary/20 transition-colors">
                      <Icon size={24} className="text-secondary" />
                    </div>
                    <h3 className="text-lg font-bold text-primary">{value.title}</h3>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed">{value.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
