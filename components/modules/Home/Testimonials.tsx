export default function Testimonials() {
  const reviews = [
    "Finally went to a concert without feeling awkward! Met amazing people.",
    "Hosted my first board game night — 12 people showed up! Best decision ever.",
    "As an expat, this app helped me make real friends in a new city.",
  ]

  return (
    <section className="py-20">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Loved by Thousands</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {reviews.map((text, i) => (
            <div key={i} className="bg-muted/50 rounded-xl p-8 italic">
              <p className="text-lg">"{text}"</p>
              <p className="mt-6 text-sm text-muted-foreground">- Happy Member</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}