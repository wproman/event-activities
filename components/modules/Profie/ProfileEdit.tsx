/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"


import { User } from '@/app/types'
import EditProfileModal from '@/components/shared/EditProfieModal'
import { Button } from '@/components/ui/button'
import { revalidatePathFunction } from '@/services/event/eventDetails'
import updateUserProfile from '@/services/user/updateUserProfile'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ProfileEditProp{
  isOwnProfile:boolean,currentUser:any
}
const ProfileEdit = ({isOwnProfile,currentUser}:ProfileEditProp) => {
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
       const [isLoading, setIsLoading] = useState(false);
        useEffect(()=>{
          async function fetchData() {
        await revalidatePathFunction(`/my-profile`)
          }
          fetchData()
        },[])


 const handleSaveProfile =async (updates: Partial<User>) => {
    if (isOwnProfile) {
        // console.log(updates);
        
      const result = await updateUserProfile(updates)
      if (result.success) {
        toast.success("profile update success full")
        await revalidatePathFunction(`/my-profile`)
        setIsLoading(false);
    setIsEditModalOpen(false)
      }else{
        setIsLoading(false);
    setIsEditModalOpen(false)
      }
       
      console.log("result",result);
      
    }
  };

  return (
    <div>
          {isOwnProfile && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(true)}
                >
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
  )
}

export default ProfileEdit