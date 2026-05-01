import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/auth";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Shield,
  Camera,
  Save,
  RefreshCw,
  Key,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

export default function AdminProfile() {
  const { user, userAuthentication, API, authorizationToken } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
      setPreview(
        user.avatar && user.avatar.startsWith("http") ? user.avatar : "",
      );
    }
  }, [user]);

  const handleChange = (e) => {
    setMessage("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview("");
    }
  };

  const handlePasswordInputChange = (e) => {
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const resetProfileForm = () => {
    if (!user) return;
    setFormData({
      name: user.name || "",
      email: user.email || "",
    });
    setPreview(user.avatar || "");
    setProfileImage(null);
    setMessage("");
  };

  const hasProfileChanges = useMemo(() => {
    if (!user) return false;
    return (
      profileImage !== null ||
      (formData.name || "") !== (user.name || "") ||
      (formData.email || "") !== (user.email || "")
    );
  }, [formData, profileImage, user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (isUpdating) return;
    setIsUpdating(true);

    if (!formData.name?.trim() || !formData.email?.trim()) {
      setMessage("Name and email are required");
      setIsUpdating(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("email", formData.email.trim());

      if (profileImage) {
        data.append("profileImage", profileImage);
      }

      const res = await axios.put(`${API}/api/auth/profile`, data, {
        withCredentials: true,
        headers: { Authorization: authorizationToken },
      });

      await userAuthentication();
      toast.success(res.data.message || "Profile updated");
      setProfileImage(null);
    } catch (error) {
      setMessage(error.response?.data?.message || "Profile update failed");
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (isChangingPassword) return;

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in new password fields");
      return;
    }

    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await axios.put(
        `${API}/api/auth/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          withCredentials: true,
          headers: { Authorization: authorizationToken },
        },
      );

      toast.success(res.data?.message || "Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const hasPasswordMismatch =
    passwordForm.confirmPassword.length > 0 &&
    passwordForm.newPassword !== passwordForm.confirmPassword;

  return (
    <div className="p-4 md:p-8 space-y-8 text-zinc-900 dark:text-white max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary-500/10 text-primary-500 rounded-xl">
          <User size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
          <p className="text-sm text-zinc-500 dark:text-neutral-400 mt-1">
            Manage your administrator account details and security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          {/* Avatar Card */}
          <div className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="h-32 bg-linear-to-r from-primary-600 to-secondary-600 relative"></div>
            <div className="px-6 pb-6 relative flex flex-col items-center mt-[-64px]">
              <div className="relative group cursor-pointer">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    onError={() => setPreview("")}
                    referrerPolicy="no-referrer"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-dark-900 shadow-md bg-white dark:bg-dark-900"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white dark:border-dark-900 shadow-md bg-linear-to-br from-zinc-100 to-zinc-200 dark:from-dark-800 dark:to-dark-700 flex items-center justify-center text-5xl font-bold text-zinc-400 dark:text-zinc-800">
                    {(formData?.name?.trim()?.[0] || "A").toUpperCase()}
                  </div>
                )}
                <label className="absolute bottom-0 right-0 p-2.5 bg-primary-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-primary-500 hover:scale-105 transition-all">
                  <Camera size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
                {user?.name || "Admin"}
              </h2>
              <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full text-xs font-semibold">
                <ShieldCheck size={14} />
                <span className="capitalize">{user?.role || "admin"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Details Form */}
          <div className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <User className="text-primary-500" size={24} />
              Personal Information
            </h3>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-neutral-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User size={18} className="text-zinc-400" />
                    </div>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-dark-950 border border-zinc-200 dark:border-dark-800 text-zinc-900 dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition"
                      placeholder="Admin Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-neutral-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-zinc-400" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-100 dark:bg-dark-950 border border-zinc-200 dark:border-dark-800 text-zinc-500 dark:text-zinc-500 cursor-not-allowed outline-none transition"
                      placeholder="admin@example.com"
                    />
                  </div>
                </div>
              </div>

              {message && (
                <div className="rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-4 py-3 text-sm text-amber-900 dark:text-amber-200 flex items-start gap-3">
                  <span className="shrink-0 text-amber-500">⚠</span>
                  <p>{message}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-100 dark:border-dark-800">
                <button
                  type="button"
                  onClick={resetProfileForm}
                  disabled={isUpdating || !hasProfileChanges}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-zinc-700 dark:text-zinc-300 font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  <span>Reset</span>
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || !hasProfileChanges}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(14,165,233,0.2)] hover:shadow-[0_0_25px_rgba(14,165,233,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 ml-auto"
                >
                  {isUpdating ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Password Security Form */}
          <div className="bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <Shield className="text-primary-500" size={24} />
              Security Settings
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-neutral-300">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key size={18} className="text-zinc-400" />
                    </div>
                    <input
                      type={
                        passwordVisibility.currentPassword ? "text" : "password"
                      }
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full pl-11 pr-12 py-3 rounded-xl bg-zinc-50 dark:bg-dark-950 border border-zinc-200 dark:border-dark-800 text-zinc-900 dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition"
                      autoComplete="current-password"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("currentPassword")
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1"
                    >
                      {passwordVisibility.currentPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-neutral-300">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key size={18} className="text-zinc-400" />
                    </div>
                    <input
                      type={
                        passwordVisibility.newPassword ? "text" : "password"
                      }
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInputChange}
                      className="w-full pl-11 pr-12 py-3 rounded-xl bg-zinc-50 dark:bg-dark-950 border border-zinc-200 dark:border-dark-800 text-zinc-900 dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition"
                      autoComplete="new-password"
                      placeholder="New password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1"
                    >
                      {passwordVisibility.newPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-neutral-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CheckCircle size={18} className="text-zinc-400" />
                    </div>
                    <input
                      type={
                        passwordVisibility.confirmPassword ? "text" : "password"
                      }
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className={`w-full pl-11 pr-12 py-3 rounded-xl bg-zinc-50 dark:bg-dark-950 border ${hasPasswordMismatch ? "border-red-500 dark:border-red-500/50" : "border-zinc-200 dark:border-dark-800"} text-zinc-900 dark:text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition`}
                      autoComplete="new-password"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility("confirmPassword")
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-1"
                    >
                      {passwordVisibility.confirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {hasPasswordMismatch && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-dark-800">
                <button
                  type="submit"
                  disabled={
                    isChangingPassword ||
                    !passwordForm.newPassword ||
                    !passwordForm.confirmPassword ||
                    !passwordForm.currentPassword ||
                    hasPasswordMismatch
                  }
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isChangingPassword ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <ShieldCheck size={18} />
                  )}
                  <span>
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
