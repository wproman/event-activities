import { User } from "@/app/types";
import HandleBlockUser from "@/components/modules/Admin/UserManagement/HandleBlockUser";
import getAllUser from "@/services/admin/getAllUser";

const UsersTable = async () => {
  console.log("=== UsersTable rendering ===");
  const users = await getAllUser();
  console.log("Users received:", users);
  console.log("Number of users:", users.length);

  const usersList = Array.isArray(users) ? users : [];
  console.log("UsersList length:", usersList.length);

  return (
    <div className="overflow-x-auto mt-10">
      {usersList.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No users found.</p>
      ) : (
        <table className="table w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Blocked</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {usersList.map((user: User, index: number) => (
              <tr key={user.id} className="border-b text-center">
                <td>{index + 1}</td>
                <td>{user.name || "N/A"}</td>
                <td>{user.email}</td>
                <td>{user.status === "BLOCKED" ? "Yes" : "No"}</td>
                <td>
                  <HandleBlockUser user={user} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersTable;
