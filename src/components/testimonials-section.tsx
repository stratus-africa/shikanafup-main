"use client"

import { Quote } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      quote:
        "Our party represent true leadership and a genuine commitment to unity. When we lift and celebrate each other, we amplify our collective achievements.",
      author: "Nicholas Mutunga",
      role: "IT Expert",
    },
    {
      id: 2,
      quote:
        "SFUP is the change we want for our country. The more we are, the greater our impact will be in transforming our country for good.",
      author: "Grace Nyambura",
      role: "Local Business Owner",
    },
    {
      id: 3,
      quote:
        "Shikana is a force to reckon with! We’re proud to be a party that listens to the aspirations of the young people and amplify the voices of everyday Kenyans.",
      author: "Ber’nita Ammi’mor",
      role: "Youth Advocate",
    },
    {
      id: 4,
      quote:
        "Shikana's focus on economic empowerment is what we need. It's refreshing to have a party that prioritizes solutions for our local businesses.",
      author: "Mohammed Abdallah",
      role: "Entrepreneur",
    },
  ]

  return (
    <section className="py-8 md:py-16 bg-primary overflow-hidden">
      <div className="w-full">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">What Our People Say</h2>
        <p className="text-lg text-white/80 text-center mb-16">
          Hear from our members and supporters across the counties and the country
        </p>

        <div className="relative flex overflow-hidden group">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-primary to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-primary to-transparent" />
          <div
            className="flex gap-8 px-4 animate-scroll pause-on-hover"
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="flex-shrink-0 w-[400px] bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:border-white/40 hover:shadow-xl cursor-default"
              >
                <Quote className="text-secondary mb-4" size={32} />
                <p className="text-white mb-6 text-lg leading-relaxed italic line-clamp-4">"{testimonial.quote}"</p>
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-white font-bold">{testimonial.author}</p>
                    <p className="text-white/70 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
