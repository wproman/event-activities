// app/(main)/page.tsx
import Hero from "@/components/modules/Home/Hero"

// import EventCategories from "@/components/home/EventCategories"
// import FeaturedEvents from "@/components/home/FeaturedEvents"
// import TopHosts from "@/components/home/TopHosts"
// import Testimonials from "@/components/home/Testimonials"
// import CTA from "@/components/home/CTA"

export const metadata = {
  title: "GatherUp – Never Go Alone Again",
  description: "Find companions for concerts, hiking, board games, sports, dinners & more. Join local events or create your own!",
}

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. How It Works */}
      {/* <HowItWorks />

      {/* 3. Event Categories */}
      {/* <EventCategories /> */}

      {/* 4. Featured / Upcoming Events */}
      {/* <FeaturedEvents /> */}
{/*  */}
      {/* 5. Top-Rated Hosts */}
      {/* <TopHosts /> */}

      {/* 6. Testimonials */}
      {/* <Testimonials /> */}

      {/* 7. Final CTA */}
      {/* <CTA /> */} 
    </>
  )
}