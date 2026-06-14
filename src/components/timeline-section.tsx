"use client"

export function TimelineSection() {
  const milestones = [
    {
      year: "2024",
      title: "Party Formation",
      description: "Consultation with the communities to design the party strategies.",
    },
    {
      year: "2025",
      title: "Party Registration",
      description: "Registration of the party continues in earnest",
    },

    {
      year: "2026",
      title: "Party Development",
      description: "Launch for national party agents recruitment, and member registration targeting 15 Million Kenyans in all 47 counties.",
    },

  ]

  return (
    <section className="w-full py-12 md:py-16 bg-white border-t border-border">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 text-balance">Our Journey</h2>
          <div className="text-lg text-foreground/70 max-w-4xl mx-auto">
            <span className="block mb-4 font-semibold">Key milestones in building the Shikana Frontliners for Unity Party.</span>
            <p className="leading-relaxed">
              We are building the next frontier of political power in our communities and throughout the country by engaging with the youth, educating the Kenyan people, and empowering the next generation of leadership so that our vision of a united and equally prosperous nation can become a reality. We’ll keep fighting for good governance and inclusivity where the people’s voices are heard and valued and that we all have a fair chance to thrive.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>
                {index < milestones.length - 1 && <div className="w-1 h-20 bg-secondary/30 mt-2" />}
              </div>
              <div className="pb-8">
                <h3 className="text-2xl font-bold text-primary">{milestone.year}</h3>
                <p className="text-xl font-semibold text-secondary mb-2">{milestone.title}</p>
                <p className="text-foreground/70 leading-relaxed">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
