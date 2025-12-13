import { IUser } from "@/app/types/host.interface";
import InfoRow from "@/components/shared/InfoRow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDateTime, getInitials } from "@/lib/formatters";
import {
  Briefcase,
  Calendar,
  Heart,
  Mail,
  MapPin,
  Phone,
  Star,
  Tag,
  User,
} from "lucide-react";

interface IHostViewDialogProps {
  open: boolean;
  onClose: () => void;
  host: IUser | null;
}

const HostViewDetailDialog = ({
  open,
  onClose,
  host,
}: IHostViewDialogProps) => {
  if (!host) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-5xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Host Profile</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Host Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg mb-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src={host?.avatarUrl || ""} alt={host?.name} />
              <AvatarFallback className="text-2xl">
                {getInitials(host?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold mb-1">{host?.name}</h2>
              <h3 className="text-xl text-muted-foreground mb-2">{host?.fullName}</h3>
              <p className="text-muted-foreground mb-2 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="h-4 w-4" />
                {host?.email}
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Badge
                  variant="default"
                  className="text-sm capitalize"
                >
                  {host?.role?.toLowerCase() || "host"}
                </Badge>
                {host?.ratingAvg !== undefined && host.ratingAvg > 0 && (
                  <Badge variant="secondary" className="text-sm">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {host.ratingAvg.toFixed(1)} Rating ({host.ratingCount || 0})
                  </Badge>
                )}
                <Badge variant="outline" className="text-sm">
                  {host?.status === "ACTIVE" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-lg">
                  Personal Information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Full Name"
                    value={host?.fullName || "Not specified"}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Email"
                    value={host?.email || "Not specified"}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Joined On"
                    value={formatDateTime(host?.createdAt || "")}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Last Updated"
                    value={formatDateTime(host?.updatedAt || "")}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Bio & Interests */}
            {(host?.bio || (host?.interests && host.interests.length > 0)) && (
              <>
                <div className="space-y-4">
                  {host?.bio && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Briefcase className="h-5 w-5 text-green-600" />
                        <h3 className="font-semibold text-lg">Bio</h3>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-foreground">{host.bio}</p>
                      </div>
                    </div>
                  )}
                  
                  {host?.interests && host.interests.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Heart className="h-5 w-5 text-pink-600" />
                        <h3 className="font-semibold text-lg">Interests</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {host.interests.map((interest, index) => (
                          <Badge
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            key={index}
                            variant="outline"
                            className="px-4 py-2 text-sm"
                          >
                            <Tag className="h-3 w-3 mr-2" />
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Separator />
              </>
            )}

            {/* Location & Ratings */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-lg">Location & Ratings</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                {host?.city && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <InfoRow
                      label="City"
                      value={host.city}
                    />
                  </div>
                )}
                {host?.ratingAvg !== undefined && host.ratingAvg > 0 && (
                  <div className="flex items-start gap-3">
                    <Star className="h-4 w-4 mt-1 text-muted-foreground" />
                    <InfoRow
                      label="Average Rating"
                      value={`${host.ratingAvg.toFixed(1)} / 5.0`}
                    />
                  </div>
                )}
                {host?.ratingCount !== undefined && host.ratingCount > 0 && (
                  <div className="flex items-start gap-3">
                    <Star className="h-4 w-4 mt-1 text-muted-foreground" />
                    <InfoRow
                      label="Total Ratings"
                      value={host.ratingCount.toString()}
                    />
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Password Change Required"
                    value={host?.needPasswordChange ? "Yes" : "No"}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Phone className="h-5 w-5 text-orange-600" />
                <h3 className="font-semibold text-lg">Account Status</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Briefcase className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Role"
                    value={host?.role?.toUpperCase() || "HOST"}
                  />
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <InfoRow
                    label="Account Status"
                    value={host?.status === "ACTIVE" ? "Active" : "Inactive"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HostViewDetailDialog;