// // app/(main)/dashboard/page.tsx
// import { authOptions } from "@/lib/auth"
// import { getServerSession } from "next-auth"


export default async function DashboardPage() {
//   const session = await getServerSession(authOptions)

  // If not logged in → redirect to login
//   if (!session?.user) {
//     redirect("/login")
//   }

//   const role = session.user.role?.toUpperCase() // assuming role is "USER" | "HOST" | "ADMIN"

  return (
    <div className="container px-4 py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        {/* <p className="text-muted-foreground mt-2">
          Welcome back, {session.user.name || session.user.email}!
        </p> */}
      </header>

      {/* Role-based Dashboard Rendering */}
      {/* {role === "ADMIN" && <AdminDashboard />}
      {role === "HOST" && <HostDashboard />}
      {role === "USER" && <UserDashboard />}
       */}
      {/* Fallback if role is missing or unknown */}
      {/* {![ "USER", "HOST", "ADMIN" ].includes(role || "") && (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground">Your role is not configured yet.</p>
        </div>
      )} */}
    </div>
  )
}