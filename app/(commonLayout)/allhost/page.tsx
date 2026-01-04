
import { User } from '@/app/types';
import getAllUser from "@/services/admin/getAllUser";
import Image from "next/image";

const Allhost= async () => {
  const users = await getAllUser();
  
  // Add defensive check to ensure users is an array
  const usersList = Array.isArray(users) ? users : [];

  return (
    <div className="flex flex-col items-center my-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Community Members</h1>
      
      {usersList.length === 0 ? (
        <p className="text-gray-500">No community members found.</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-6xl">
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Image</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Role</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Bio</th>
                <th className="px-4 py-2 border">Interests</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user: User) => (
                <tr key={user.id} className="text-center">
                  <td className="border px-4 py-2">
                    {user?.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full mx-auto"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 mx-auto flex items-center justify-center">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2">{user.city || "-"}</td>
                  <td className="border px-4 py-2">{user.bio || "-"}</td>
                  <td className="border px-4 py-2">
                    {user?.interests?.length > 0 ? user.interests.join(", ") : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Allhost;