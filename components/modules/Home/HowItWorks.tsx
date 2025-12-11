import { Search, CalendarCheck, Users } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Browse or Search",
      desc: "Find events by interest, location, or date",
    },
    {
      icon: CalendarCheck,
      title: "Join or Create",
      desc: "RSVP instantly or host your own activity",
    },
    {
      icon: Users,
      title: "Meet & Enjoy",
      desc: "Connect with awesome people in real life",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="mt-4 text-muted-foreground">Three simple steps to never be alone again</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white mb-6">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{i + 1}. {step.title}</h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}