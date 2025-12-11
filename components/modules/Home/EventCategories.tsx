import { Music, Mountain, Gamepad2, Utensils, Code2, Palette } from "lucide-react"
import Link from "next/link"

const categories = [
  { name: "Music & Concerts", icon: Music, color: "bg-pink-100 text-pink-600" },
  { name: "Outdoor & Adventure", icon: Mountain, color: "bg-green-100 text-green-600" },
  { name: "Gaming", icon: Gamepad2, color: "bg-purple-100 text-purple-600" },
  { name: "Food & Drinks", icon: Utensils, color: "bg-orange-100 text-orange-600" },
  { name: "Tech & Startups", icon: Code2, color: "bg-blue-100 text-blue-600" },
  { name: "Art & Culture", icon: Palette, color: "bg-indigo-100 text-indigo-600" },
]

export default function EventCategories() {
  return (
    <section className="py-20">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/events?category=${cat.name.toLowerCase()}`}
              className="group text-center hover:scale-105 transition-transform"
            >
              <div className={`${cat.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow`}>
                <cat.icon className="w-10 h-10" />
              </div>
              <p className="text-sm font-medium">{cat.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}