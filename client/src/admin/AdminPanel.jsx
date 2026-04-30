import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../store/auth";

export default function AdminPanel() {
  const { API, authorizationToken } = useAuth();
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState("");

  const fetchAdminData = useCallback(async () => {
    try {
      setLoading(true);
      const [overviewRes, usersRes] = await Promise.all([
        axios.get(`${API}/api/admin/overview`, {
          headers: { Authorization: authorizationToken },
        }),
        axios.get(`${API}/api/admin/users`, {
          headers: { Authorization: authorizationToken },
        }),
      ]);

      setOverview(overviewRes.data);
      setUsers(usersRes.data.users);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load admin panel");
    } finally {
      setLoading(false);
    }
  }, [API, authorizationToken]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const toggleAdminRole = async (userId) => {
    try {
      setUpdatingUserId(userId);
      const response = await axios.patch(
        `${API}/api/admin/users/${userId}/toggle-admin`,
        {},
        { headers: { Authorization: authorizationToken } },
      );

      toast.success(response.data.message || "User role updated");
      await fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update user role");
    } finally {
      setUpdatingUserId("");
    }
  };

  const cardClass =
    "bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 p-6 rounded-xl shadow-sm dark:shadow-none";

  if (loading || !overview) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-dark-950 flex flex-col items-center justify-center gap-3 text-primary-600 dark:text-primary-500 py-8">
        <div className="h-10 w-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-zinc-500 dark:text-neutral-400">
          Loading admin panel...
        </p>
      </div>
    );
  }

  const { totals, recentUsers } = overview;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-dark-950 p-6 md:p-8 text-zinc-900 dark:text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-500">
          Admin Panel
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={cardClass}>
            <p className="text-sm text-zinc-500 dark:text-neutral-400">Users</p>
            <p className="text-3xl font-bold mt-2">{totals.users}</p>
          </div>
          <div className={cardClass}>
            <p className="text-sm text-zinc-500 dark:text-neutral-400">Admins</p>
            <p className="text-3xl font-bold mt-2">{totals.admins}</p>
          </div>
          <div className={cardClass}>
            <p className="text-sm text-zinc-500 dark:text-neutral-400">Workouts</p>
            <p className="text-3xl font-bold mt-2">{totals.workouts}</p>
          </div>
          <div className={cardClass}>
            <p className="text-sm text-zinc-500 dark:text-neutral-400">
              Contact messages
            </p>
            <p className="text-3xl font-bold mt-2">{totals.contacts}</p>
          </div>
        </div>

        <section className={cardClass}>
          <h2 className="text-xl font-bold mb-4">Recently joined users</h2>
          {recentUsers.length === 0 ? (
            <p className="text-zinc-500 dark:text-neutral-400">No recent users.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentUsers.map((u) => (
                <div
                  key={u._id}
                  className="p-4 rounded-lg border border-zinc-200 dark:border-dark-800 bg-zinc-50 dark:bg-dark-950"
                >
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-zinc-500 dark:text-neutral-400">
                    {u.email}
                  </p>
                  <p className="text-xs mt-1 text-zinc-500 dark:text-neutral-500">
                    Joined {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={cardClass}>
          <h2 className="text-xl font-bold mb-4">Manage users</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="text-left border-b border-zinc-200 dark:border-dark-800">
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">Email</th>
                  <th className="py-3 pr-4">Verified</th>
                  <th className="py-3 pr-4">Onboarded</th>
                  <th className="py-3 pr-4">Role</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-zinc-100 dark:border-dark-900"
                  >
                    <td className="py-3 pr-4">{u.name}</td>
                    <td className="py-3 pr-4">{u.email}</td>
                    <td className="py-3 pr-4">{u.isEmailVerified ? "Yes" : "No"}</td>
                    <td className="py-3 pr-4">{u.onboardingComplete ? "Yes" : "No"}</td>
                    <td className="py-3 pr-4">{u.role === "admin" ? "Admin" : "User"}</td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => toggleAdminRole(u._id)}
                        disabled={updatingUserId === u._id}
                        className="px-3 py-1.5 rounded-md bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                      >
                        {updatingUserId === u._id
                          ? "Updating..."
                          : u.role === "admin"
                            ? "Remove admin"
                            : "Make admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
