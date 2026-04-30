import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/auth";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-neutral-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:border-primary-500 outline-none transition";
const sectionCardClass =
  "bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 rounded-xl p-6 mb-6";

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
      setPreview(user.avatar && user.avatar.startsWith("http") ? user.avatar : "");
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
        }
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
    <div className="p-6 space-y-6 text-zinc-900 dark:text-white max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <p className="text-sm text-zinc-500 dark:text-neutral-400 mt-1">
          Manage your administrator account details and security.
        </p>
      </div>

      <div className={sectionCardClass}>
        <div className="flex flex-col items-center mb-6">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              onError={() => setPreview("")}
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover border-4 border-primary-500"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-linear-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-3xl font-bold text-white">
              {(formData?.name?.trim()?.[0] || "A").toUpperCase()}
            </div>
          )}

          <label className="mt-4 cursor-pointer text-sm text-primary-600 hover:text-primary-500 dark:text-primary-500 dark:hover:text-primary-400">
            Change photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm text-zinc-600 dark:text-neutral-300">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Admin Name"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-600 dark:text-neutral-300">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className={`${inputClass} opacity-60 cursor-not-allowed`}
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
             <label className="block mb-2 text-sm text-zinc-600 dark:text-neutral-300">
                Role
              </label>
              <input
                value={user?.role || "admin"}
                disabled
                className={`${inputClass} opacity-60 cursor-not-allowed capitalize`}
              />
          </div>

          {message && (
            <div className="rounded-xl bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/20 px-4 py-3 text-sm text-amber-900 dark:text-amber-200">
              {message}
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={resetProfileForm}
              disabled={isUpdating || !hasProfileChanges}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold transition disabled:opacity-50"
            >
              Reset changes
            </button>
            <button
              type="submit"
              disabled={isUpdating || !hasProfileChanges}
              className="w-full sm:flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 transition font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>
      </div>

      <div className={sectionCardClass}>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
          Change password
        </h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-zinc-600 dark:text-neutral-300">
              Current Password
            </label>
            <div className="relative">
              <input
                type={passwordVisibility.currentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordInputChange}
                className={`${inputClass} pr-12`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("currentPassword")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 dark:text-neutral-400 dark:hover:text-white transition-colors"
              >
                {passwordVisibility.currentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-zinc-600 dark:text-neutral-300">
              New Password
            </label>
            <div className="relative">
              <input
                type={passwordVisibility.newPassword ? "text" : "password"}
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordInputChange}
                className={`${inputClass} pr-12`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 dark:text-neutral-400 dark:hover:text-white transition-colors"
              >
                {passwordVisibility.newPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-zinc-600 dark:text-neutral-300">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={passwordVisibility.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordInputChange}
                className={`${inputClass} pr-12`}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 dark:text-neutral-400 dark:hover:text-white transition-colors"
              >
                {passwordVisibility.confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {hasPasswordMismatch && (
              <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                Passwords do not match.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              isChangingPassword ||
              !passwordForm.newPassword ||
              !passwordForm.confirmPassword ||
              !passwordForm.currentPassword ||
              hasPasswordMismatch
            }
            className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:hover:bg-zinc-200 transition font-bold text-white dark:text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChangingPassword ? "Changing..." : "Change password"}
          </button>
        </form>
      </div>
    </div>
  );
}
