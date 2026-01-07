// components/Navbar.tsx

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

import { getCookie } from "@/services/auth/tokenHandlers";
import LogoutButton from "./LogoutButton";

// Define the type for navigation items
type NavItem = {
  href: string;
  label: string;
};

const PublicNavbar = async () => {
  const accessToken = await getCookie("accessToken");
  const userRole = accessToken ? (await getCookie("userRole")) || "USER" : null;

  // Common nav items
  const commonItems: NavItem[] = [
    { href: "/explore", label: "Explore Events" },
    { href: "/hosts/create-host", label: "Become a Host" },
  ];

  // Role-specific items
  const userItems: NavItem[] = [
    { href: "/dashboard/my-event", label: "My Events" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const hostItems: NavItem[] = [
    { href: "/events/create", label: "Create Event" },
    { href: "/my-events", label: "My Events" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const adminItems: NavItem[] = [
    { href: "/admin/dashboard", label: "Admin Dashboard" },
    { href: "/admin/users", label: "Manage Users" },
    { href: "/admin/events", label: "Manage Events" },
  ];

  // Explicitly type the variable
  let roleSpecificItems: NavItem[] = [];

  if (userRole === "ADMIN") {
    roleSpecificItems = adminItems;
  } else if (userRole === "HOST") {
    roleSpecificItems = hostItems;
  } else if (userRole === "USER") {
    roleSpecificItems = userItems;
  }

  const desktopNavItems: NavItem[] = accessToken
    ? [...commonItems, ...roleSpecificItems]
    : commonItems;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">GatherUp</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {desktopNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {accessToken ? (
            <>
              <Link href="/my-profile">
                <Button variant="ghost">Profile</Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-75 sm:w-100">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col space-y-6 mt-8">
                {/* Common Links */}
                {commonItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Role-specific Links (Logged In) */}
                {accessToken && roleSpecificItems.length > 0 && (
                  <>
                    <div className="border-t pt-6" />
                    {roleSpecificItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="text-lg font-medium hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </>
                )}

                {/* Auth Section */}
                <div className="border-t pt-6 space-y-4">
                  {accessToken ? (
                    <>
                      <Link href="/profile/me" className="block">
                        <Button variant="outline" className="w-full">
                          Profile
                        </Button>
                      </Link>
                      <LogoutButton />
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button className="w-full">Sign Up</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;
