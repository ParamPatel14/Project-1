import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getUsers } from "../api";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Welcome, {user?.name || user?.email}!</h2>
          <p className="text-gray-600">Role: {user?.role}</p>
        </div>
        
        <h3 className="text-lg font-semibold mb-4">All Users</h3>
        <ul className="bg-gray-50 rounded-lg border divide-y">
          {users.map((u) => (
            <li key={u.id} className="p-4 flex justify-between">
              <span>{u.email}</span>
              <span className="text-sm text-gray-500">{u.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
