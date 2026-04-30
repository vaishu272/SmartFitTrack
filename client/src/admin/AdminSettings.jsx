import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../store/auth";
import axios from "axios";
import toast from "react-hot-toast";
import {
  User,
  Shield,
  Settings,
  Key,
  LogOut,
  Database,
  Download,
  Trash2,
  ArrowRightLeft,
  Server,
  Activity,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function AdminSettings() {
  const { user, API, LogoutUser } = useAuth();

  // State for config
  const [config, setConfig] = useState({
    enableWorkouts: true,
    enableContactForm: true,
    maintenanceMode: false,
  });

  // State for stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkouts: 0,
    dbStatus: 0,
  });

  // Forms State
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/admin/config`, {
        withCredentials: true,
      });
      setConfig(res.data);
    } catch (error) {
      console.error("Failed to load config", error);
    }
  }, [API]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/api/admin/stats`, {
        withCredentials: true,
      });
      setStats({
        totalUsers: res.data.totalUsers,
        totalWorkouts: res.data.totalWorkouts,
        dbStatus: res.data.dbStatus,
      });
    } catch (error) {
      console.error("Failed to load stats", error);
    }
  }, [API]);

  useEffect(() => {
    fetchConfig();
    fetchStats();
  }, [fetchConfig, fetchStats]);

  const handleConfigChange = async (key, value) => {
    const originalConfig = { ...config };
    setConfig({ ...config, [key]: value });
    try {
      await axios.put(
        `${API}/api/admin/config`,
        { [key]: value },
        { withCredentials: true },
      );
      toast.success("Settings updated");
    } catch {
      setConfig(originalConfig);
      toast.error("Failed to update settings");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new)
      return toast.error("Please fill all fields");
    setLoading(true);
    try {
      await axios.post(
        `${API}/api/admin/change-password`,
        {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        },
        { withCredentials: true },
      );
      toast.success("Password changed successfully");
      setPasswords({ current: "", new: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = async () => {
    if (
      !window.confirm("Are you sure you want to log out of all other sessions?")
    )
      return;
    try {
      await axios.post(
        `${API}/api/admin/logout-all`,
        {},
        { withCredentials: true },
      );
      toast.success("Logged out of all other sessions");
    } catch {
      toast.error("Failed to log out sessions");
    }
  };

  const handleTransferRole = async (e) => {
    e.preventDefault();
    if (!newAdminEmail) return toast.error("Please enter an email");
    if (
      !window.confirm(
        `Are you sure you want to transfer your admin role to ${newAdminEmail}? You will be demoted to a regular user.`,
      )
    )
      return;

    setLoading(true);
    try {
      await axios.post(
        `${API}/api/admin/transfer-role`,
        { newAdminEmail },
        { withCredentials: true },
      );
      toast.success(
        "Role transferred successfully. You are no longer an admin.",
      );
      LogoutUser(); // Force logout as they are no longer admin
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to transfer role");
    } finally {
      setLoading(false);
    }
  };

  const handleExportUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/users?includeAdmin=true`, {
        withCredentials: true,
      });
      const users = res.data.users;

      const csvContent =
        "data:text/csv;charset=utf-8," +
        "Name,Email,Phone,Role,Verified\n" +
        users
          .map(
            (u) =>
              `${u.name},${u.email},${u.phone || ""},${u.role},${u.isEmailVerified}`,
          )
          .join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "smartfit_users.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Users exported");
    } catch {
      toast.error("Failed to export users");
    }
  };

  const handleDeleteInactive = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete all inactive users? This cannot be undone.",
      )
    )
      return;
    try {
      const res = await axios.delete(`${API}/api/admin/inactive-users`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      fetchStats();
    } catch {
      toast.error("Failed to delete inactive users");
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
        System Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Info */}
        <div className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white">
            <User className="text-primary-600 dark:text-primary-500" />
            <h2 className="text-xl font-semibold">Admin Info</h2>
          </div>
          <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
            <div className="flex justify-between pb-2 border-b border-zinc-100 dark:border-dark-800">
              <span className="font-medium">Email</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-zinc-100 dark:border-dark-800">
              <span className="font-medium">Role</span>
              <span className="capitalize bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-0.5 rounded text-xs font-semibold">
                {user?.role}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-zinc-100 dark:border-dark-800">
              <span className="font-medium flex items-center gap-1">
                <Clock size={14} /> Last Login
              </span>
              <span>{new Date(user?.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white">
            <Activity className="text-primary-600 dark:text-primary-500" />
            <h2 className="text-xl font-semibold">System Info</h2>
          </div>
          <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
            <div className="flex justify-between pb-2 border-b border-zinc-100 dark:border-dark-800">
              <span className="font-medium flex items-center gap-1">
                <User size={14} /> Total Users
              </span>
              <span className="font-semibold text-zinc-900 dark:text-white">
                {stats.totalUsers}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-zinc-100 dark:border-dark-800">
              <span className="font-medium flex items-center gap-1">
                <Activity size={14} /> Total Workouts
              </span>
              <span className="font-semibold text-zinc-900 dark:text-white">
                {stats.totalWorkouts}
              </span>
            </div>
            <div className="flex justify-between pb-2 border-b border-zinc-100 dark:border-dark-800">
              <span className="font-medium flex items-center gap-1">
                <Server size={14} /> DB Status
              </span>
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                <CheckCircle size={14} />{" "}
                {stats.dbStatus === 1 ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white">
            <Key className="text-primary-600 dark:text-primary-500" />
            <h2 className="text-xl font-semibold">Security Settings</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3 mb-6">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-dark-800 border border-zinc-200 dark:border-dark-700 text-sm focus:ring-2 focus:ring-primary-500 outline-none text-zinc-900 dark:text-white"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-dark-800 border border-zinc-200 dark:border-dark-700 text-sm focus:ring-2 focus:ring-primary-500 outline-none text-zinc-900 dark:text-white"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition disabled:opacity-50"
            >
              Change Password
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-100 dark:border-dark-800 flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-zinc-900 dark:text-white">
                Active Sessions
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                Token expires in 7 days
              </p>
            </div>
            <button
              onClick={handleLogoutAll}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition"
            >
              <LogOut size={16} /> Logout All
            </button>
          </div>
        </div>

        {/* Role Management */}
        <div className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white">
            <Shield className="text-primary-600 dark:text-primary-500" />
            <h2 className="text-xl font-semibold">Role Management</h2>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            Transfer your admin privileges to another user. You will be demoted
            to a regular user automatically.
          </p>
          <form onSubmit={handleTransferRole} className="space-y-3">
            <input
              type="email"
              placeholder="New Admin Email"
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 dark:bg-dark-800 border border-zinc-200 dark:border-dark-700 text-sm focus:ring-2 focus:ring-primary-500 outline-none text-zinc-900 dark:text-white"
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
            >
              <ArrowRightLeft size={16} /> Transfer Admin Role
            </button>
          </form>
        </div>

        {/* App Configuration */}
        <div className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white">
            <Settings className="text-primary-600 dark:text-primary-500" />
            <h2 className="text-xl font-semibold">App Configuration</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-zinc-900 dark:text-white">
                  Enable Workouts
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Allow users to log new workouts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={config.enableWorkouts}
                  onChange={(e) =>
                    handleConfigChange("enableWorkouts", e.target.checked)
                  }
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-dark-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-primary-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-zinc-900 dark:text-white">
                  Contact Form
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Accept new contact messages
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={config.enableContactForm}
                  onChange={(e) =>
                    handleConfigChange("enableContactForm", e.target.checked)
                  }
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-dark-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-primary-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-zinc-900 dark:text-white">
                  Maintenance Mode
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Show maintenance message
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={config.maintenanceMode}
                  onChange={(e) =>
                    handleConfigChange("maintenanceMode", e.target.checked)
                  }
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-dark-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Controls */}
        <div className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-zinc-900 dark:text-white">
            <Database className="text-primary-600 dark:text-primary-500" />
            <h2 className="text-xl font-semibold">Data Controls</h2>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleExportUsers}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-zinc-100 dark:bg-dark-800 text-zinc-900 dark:text-white border border-zinc-200 dark:border-dark-700 rounded-lg text-sm font-medium hover:bg-zinc-200 dark:hover:bg-dark-700 transition"
            >
              <Download size={16} /> Export Users (CSV)
            </button>
            <button
              onClick={handleDeleteInactive}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 rounded-lg text-sm font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition"
            >
              <Trash2 size={16} /> Delete Inactive Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
