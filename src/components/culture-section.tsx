"use client"

import { Briefcase, Users, Lightbulb, Heart, Shield, Target } from "lucide-react"

export function CultureSection() {
  const values = [
    {
      icon: Users,
      title: "Inclusive Teamwork",
      description: "We believe in collaboration and diverse perspectives.",
    },
    {
      icon: Lightbulb,
      title: "Innovation & Impact",
      description: "We encourage creative thinking and meaningful contributions.",
    },
    {
      icon: Shield,
      title: "Integrity",
      description: "We operate with transparency and ethical standards.",
    },
    {
      icon: Heart,
      title: "Service Mindset",
      description: "We're driven by the desire to serve our communities.",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for the highest standards in everything we do.",
    },
    {
      icon: Briefcase,
      title: "Professional Growth",
      description: "We invest in our team's development and career advancement.",
    },
  ]

  return (
    <section className="w-full py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Why Work With Us?</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
SFUP is a dynamic space for Kenyans ready to see their work change the nation in real- time. If you're looking for a mission that hits different, you just found it.           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:border-secondary transition-colors"
              >
                <div className="bg-secondary p-3 rounded-lg mb-4 w-fit">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{value.title}</h3>
                <p className="text-foreground/70">{value.description}</p>
              </div>
            )
          })}
        </div>

        {/* Benefits Section */}
        <div className="mt-16 bg-muted rounded-lg p-8 md:p-12">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">Benefits & Compensation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-bold text-secondary mb-3">Competitive Salary</h4>
              <p className="text-foreground/70">
                Market-competitive compensation based on experience and qualifications.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-secondary mb-3">Professional Development</h4>
              <p className="text-foreground/70">Training programs, mentorship, and career advancement opportunities.</p>
            </div>
            <div>
              <h4 className="text-xl font-bold text-secondary mb-3">Flexible Work</h4>
              <p className="text-foreground/70">Flexible hours and remote work options where applicable.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
