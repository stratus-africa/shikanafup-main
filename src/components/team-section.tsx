"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function TeamSection() {
  const team = [
    {
      name: "Stephen Ogallo",
      title: "Chair / Party Leader",
      description: "Leading the party with vision and integrity towards a united Kenya, championing our core values and strategic direction.",
      image: "/steve.jpeg",
    },
    {
      name: "Nancy Mutava",
      title: "Secretary General / Legal",
      description: "Overseeing party operations and ensuring compliance with legal frameworks while maintaining organizational excellence.",
      image: "/nancy.jpeg",
    },
    {
      name: "Laura Ombok",
      title: "Corporate Strategy / Treasurer",
      description: "Managing party resources with transparency and accountability while driving strategic initiatives for sustainable growth.",
      image: "/laura.jpeg",
    },
    {
      name: "Emanuel Yeswa",
      title: "Organising Secretary / Nominations",
      description: "Coordinating party activities and managing the nomination process to ensure fair representation across all levels.",
      image: "/emmanuel.jpeg",
    },
    {
      name: "Philip Mwembi",
      title: "Publicity and Media Relations",
      description: "Communicating our vision and values to citizens across the nation through strategic media engagement and public outreach.",
      image: "/phillip.jpeg",
    },
    {
      name: "Merceline Aol",
      title: "Women & Special Interest Leader",
      description: "Championing the rights and representation of women and special interest groups, ensuring inclusive participation in party affairs.",
      image: "/mercy.jpeg",
    },
  ]


  const getInitials = (name: string) => {
    const parts = name.trim().split(" ")
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-primary/10 text-primary",
      "bg-secondary/10 text-secondary",
      "bg-accent/10 text-accent",
      "bg-chart-1/10 text-chart-1",
      "bg-chart-2/10 text-chart-2",
      "bg-chart-3/10 text-chart-3",
      "bg-chart-4/10 text-chart-4",
      "bg-chart-5/10 text-chart-5",
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  return (
    <section className="w-full py-12 md:py-16 bg-gray-50 border-t border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-balance">Leadership Team</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Dedicated individuals committed to serving our nation with integrity and purpose.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <div className="mb-4 rounded-lg overflow-hidden border border-border bg-white p-2 shadow-sm">
                <Avatar className="w-full h-64 rounded-lg">
                  <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                  <AvatarFallback
                    className={cn(
                      "rounded-lg text-4xl font-bold",
                      getAvatarColor(member.name)
                    )}
                  >
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-xl font-bold text-primary mb-1">{member.name}</h3>
              <p className="text-secondary font-semibold mb-3">{member.title}</p>
              <p className="text-foreground/70 text-sm leading-relaxed">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
