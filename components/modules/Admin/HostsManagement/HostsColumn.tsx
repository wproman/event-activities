"use client";

import type { IUser } from "@/app/types/host.interface";
import { DateCell } from "@/components/shared/cell/DateCell";
import { StatusBadgeCell } from "@/components/shared/cell/StatusBadgeCell";
import { UserInfoCell } from "@/components/shared/cell/UserInfoCell";
import type { Column } from "@/components/shared/ManagementTable";
import { MapPin, Star, Tag } from "lucide-react";

export const hostsColumns: Column<IUser>[] = [
  {
    header: "Host",
    accessor: (host) => (
      <UserInfoCell
        name={host.name}
        email={host.email}
        photo={host.avatarUrl || ""}
      />
    ),
  },
  {
    header: "Full Name",
    accessor: (host) => (
      <span className="text-sm font-medium">{host.fullName || "N/A"}</span>
    ),
  },
  {
    header: "Bio",
    accessor: (host) => (
      <div className="max-w-[200px]">
        <p className="text-sm text-gray-600 line-clamp-2">
          {host.bio || "No bio provided"}
        </p>
      </div>
    ),
  },
  {
    header: "Interests",
    accessor: (host) => (
      <div className="max-w-[150px]">
        {host.interests && host.interests.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {host.interests.slice(0, 3).map((interest, index) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                <Tag className="h-3 w-3" />
                {interest}
              </span>
            ))}
            {host.interests.length > 3 && (
              <span className="text-xs text-gray-500">
                +{host.interests.length - 3} more
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-gray-500">No interests</span>
        )}
      </div>
    ),
  },
  {
    header: "Location",
    accessor: (host) => (
      <div className="flex items-center gap-1">
        <MapPin className="h-4 w-4 text-gray-500" />
        <span className="text-sm">{host.city || "Not specified"}</span>
      </div>
    ),
  },
  {
    header: "Rating",
    accessor: (host) => (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">
          {host.ratingAvg ? host.ratingAvg.toFixed(1) : "0.0"}
          <span className="text-xs text-gray-500 ml-1">
            ({host.ratingCount || 0})
          </span>
        </span>
      </div>
    ),
  },
  {
    header: "Status",
    accessor: (host) => {
      // Create a custom status badge since StatusBadgeCell doesn't accept status prop
      // You can check if your IUser has isDeleted or status field
      if ("isDeleted" in host && host.isDeleted !== undefined) {
        // If IUser has isDeleted, use StatusBadgeCell
        return <StatusBadgeCell isDeleted={host.isDeleted as boolean} />;
      } else if ("status" in host) {
        // If IUser has status field, create custom badge
        const isActive = host.status === "ACTIVE";
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      } else {
        // Fallback
        return <span className="text-sm text-gray-500">N/A</span>;
      }
    },
  },
  {
    header: "Password Change",
    accessor: (host) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          host.needPasswordChange
            ? "bg-red-100 text-red-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {host.needPasswordChange ? "Required" : "Not Required"}
      </span>
    ),
  },
  {
    header: "Joined",
    accessor: (host) => <DateCell date={host.createdAt} />,
  },
];
