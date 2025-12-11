// components/Navbar.tsx
import Link from "next/link";
// import { Button} from "@/components/ui/button";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export default async function Navbar() {
//   const session = await getServerSession(authOptions);
//   const user = session?.user;
//   const role = user?.role; // "USER" | "HOST" | "ADMIN"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          GatherUp
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/events" className="text-muted-foreground hover:text-foreground">Explore Events</Link>

          {/* {!user ? (
            <>
              <Link href="/auth/become-host">Become a Host</Link>
              <Link href="/login">Login</Link>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          ) : role === "ADMIN" ? (
            <>
              <Link href="/admin/dashboard">Admin Dashboard</Link>
              <Link href="/profile/me">Profile</Link>
              <form action="/api/auth/signout" method="post">
                <Button variant="ghost">Logout</Button>
              </form>
            </>
          ) : role === "HOST" ? (
            <>
              <Link href="/events/create">Create Event</Link>
              <Link href="/my-events">My Events</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/profile/me">Profile</Link>
              <Button variant="ghost">Logout</Button>
            </>
          ) : (
            <>
              <Link href="/my-events">My Events</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/profile/me">Profile</Link>
              <Button variant="ghost">Logout</Button>
            </>
          )} */}
        </nav>
      </div>
    </header>
  );
}