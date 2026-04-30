import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../store/auth";

export default function AdminUsers() {
  const { API, authorizationToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/admin/users`, {
        headers: { Authorization: authorizationToken },
        params: { search },
      });
      setUsers(response.data.users);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [API, authorizationToken, search]);

  useEffect(() => {
    const id = setTimeout(() => {
      fetchUsers();
    }, 250);
    return () => clearTimeout(id);
  }, [fetchUsers]);

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API}/api/admin/users/${id}`, {
        headers: { Authorization: authorizationToken },
      });
      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-500">
        User Management
      </h1>

      <div className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 p-4 rounded-xl flex flex-col md:flex-row gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email"
          className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-dark-700 bg-zinc-50 dark:bg-dark-950"
        />
      </div>

      <div className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 rounded-xl p-4 overflow-x-auto">
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="text-left border-b border-zinc-200 dark:border-dark-800">
                <th className="py-2 pr-3">Name</th>
                <th className="py-2 pr-3">Email</th>
                <th className="py-2 pr-3">Role</th>
                <th className="py-2 pr-3">Verified</th>
                <th className="py-2 pr-3">Created</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-zinc-100 dark:border-dark-900"
                  >
                    <td className="py-2 pr-3">{u.name}</td>
                    <td className="py-2 pr-3">{u.email}</td>
                    <td className="py-2 pr-3 capitalize">{u.role}</td>
                    <td className="py-2 pr-3">
                      {u.isEmailVerified ? "Yes" : "No"}
                    </td>
                    <td className="py-2 pr-3">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 flex gap-2">
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="px-2.5 py-1 rounded bg-red-600 text-white hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
