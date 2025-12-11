// app/(main)/layout.tsx
// import Navbar from "@/components/Navbar"
// import Footer from "@/components/Footer"

import Footer from "@/components/shared/publicFooter"
import Navbar from "@/components/shared/publicNavbar"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}