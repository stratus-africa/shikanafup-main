import { Users, Target, TrendingUp, Shield } from "lucide-react"

export function WhyChooseUs() {
  const values = [
    {
      icon: Users,
      title: "Unity",
      description: "We believe in bringing people together from all walks of life to build a stronger nation.",
    },
    {
      icon: Target,
      title: "Mission",
      description: "To champion transparent governance and progressive policies that improve lives.",
    },
    {
      icon: TrendingUp,
      title: "Progress",
      description: "Driving economic growth and social development for sustainable prosperity.",
    },
    {
      icon: Shield,
      title: "Leadership",
      description: "Dedicated leaders committed to serving with integrity and vision.",
    },
  ]

  return (
    <section className="py-8 md:py-12 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-primary mb-4">Why Join Us</h2>
        <p className="text-center text-muted-foreground mb-16 text-lg">Our core values define everything we do</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <div
                key={index}
                className="text-center bg-muted p-6 hover:shadow-lg transition-shadow rounded-lg border border-border"
              >
                <div className="inline-block p-4 bg-secondary/10 rounded-full mb-4">
                  <Icon size={32} className="text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
