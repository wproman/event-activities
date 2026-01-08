/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { User } from "@/app/types";
import EditProfileModal from "@/components/shared/EditProfieModal";
import { Button } from "@/components/ui/button";
import updateUserProfile from "@/services/user/updateUserProfile";
import { useRouter } from "next/navigation"; // Import useRouter
import { useState } from "react";
import { toast } from "sonner";

interface ProfileEditProp {
  isOwnProfile: boolean;
  currentUser: User;
}

const ProfileEdit = ({ isOwnProfile, currentUser }: ProfileEditProp) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Use router to refresh page

  const handleSaveProfile = async (updates: Partial<User>) => {
    setIsLoading(true);
    
    try {
      // Call the update service
      const result = await updateUserProfile(currentUser.id, updates);
      
      if (result.success) {
        // Show success message
        toast.success("Profile updated successfully");
        
        // Close the modal
        setIsEditModalOpen(false);
        
        // Refresh the page to get updated data
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isOwnProfile && (
        <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
          Edit Profile
        </Button>
      )}
      {isOwnProfile && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={currentUser}
          onSave={handleSaveProfile}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </div>
  );
};

export default ProfileEdit;