import { NavSection } from "@/app/types/dashboard.interface";
import { getDefaultDashboardRoute, UserRole } from "./auth-utils";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);

  return [
    {
      items: [
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "LayoutDashboard",
          roles: ["USER", "HOST", "ADMIN"],
        },
        {
          title: "My Profile",
          href: `/my-profile`,
          icon: "User",
          roles: ["USER", "HOST", "ADMIN"],
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Change Password",
          href: "/change-password",
          icon: "Settings", // ✅ String
          roles: ["USER"],
        },
      ],
    },
  ];
};

export const hostNavItems: NavSection[] = [
  {
    title: "Event Management",
    items: [
      {
        title: "My Events",
        href: "/host/dashboard/my-events",
        icon: "Event", // ✅ String
        // badge: "3",
        roles: ["HOST"],
      },
      {
        title: "Manage User",
        href: "/host/dashboard/manage-participants",
        icon: "participants", // ✅ String
        // badge: "3",
        roles: ["HOST"],
      },
      {
        title: "Manage Payments",
        href: "/host/dashboard/my-payments",
        icon: "participants", // ✅ String
        // badge: "3",
        roles: ["HOST"],
      },
      // {
      //     title: "Prescriptions",
      //     href: "/doctor/dashboard/prescriptions",
      //     icon: "FileText", // ✅ String
      //     roles: ["HOST"],
      // },
    ],
  },
];

export const userNavItems: NavSection[] = [
  {
    title: "Events",
    items: [
      {
        title: "My events",
        href: "/dashboard/my-event",
        icon: "Calendar", // ✅ String
        roles: ["USER"],
      },
      {
        title: "Book events",
        href: "/dashboard/book-events",
        icon: "ClipboardList", // ✅ String
        roles: ["USER"],
      },
    ],
  },
  {
    title: "All events",
    items: [
      {
        title: "My Events",
        href: "/dashboard/my-events",
        icon: "FileText", // ✅ String
        roles: ["USER"],
      },
      // {
      //     title: "Health Records",
      //     href: "/dashboard/health-records",
      //     icon: "Activity", // ✅ String
      //     roles: ["USER"],
      // },
    ],
  },
];

export const adminNavItems: NavSection[] = [
  {
    title: "User Management",
    items: [
      {
        title: "Admins",
        href: "/admin/dashboard/admins-management",
        icon: "Shield", // ✅ String
        roles: ["ADMIN"],
      },
      {
        title: "Hosts",
        href: "/admin/dashboard/hosts-management",
        icon: "Stethoscope", // ✅ String
        roles: ["ADMIN"],
      },
      {
        title: "Users",
        href: "/admin/dashboard/users-management",
        icon: "Users", // ✅ String
        roles: ["ADMIN"],
      },
    ],
  },
  {
    title: "Events Management",
    items: [
      {
        title: "Events",
        href: "/admin/dashboard/events-management",
        icon: "Calendar", // ✅ String
        roles: ["ADMIN"],
      },
      {
        title: "Schedules",
        href: "/admin/dashboard/schedules-management",
        icon: "Clock", // ✅ String
        roles: ["ADMIN"],
      },
      // {
      //     title: "Specialities",
      //     href: "/admin/dashboard/specialities-management",
      //     icon: "Hospital", // ✅ String
      //     roles: ["ADMIN"],
      // },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems];
    case "HOST":
      return [...commonNavItems, ...hostNavItems];
    case "USER":
      return [...commonNavItems, ...userNavItems];
    default:
      return [];
  }
};
