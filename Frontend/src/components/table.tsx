import React, { useEffect, useState } from "react";
import { fetchUsers } from "../services/user";  // Import fetchUsers

interface User {
  _id: string;
  name: string;
  email: string;
  contact_no: string;
  user_type: "restaurant" | "food_bank";
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchUsers(); // Use the API function
      if (data.length === 0) {
        setError("Failed to fetch users");
      } else {
        setUsers(data);
      }
      setLoading(false);
    };

    getUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>{user.name}</strong> ({user.user_type}) - {user.email} - {user.contact_no}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
