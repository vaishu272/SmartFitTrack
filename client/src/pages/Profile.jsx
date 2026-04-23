import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-neutral-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white focus:border-primary-500 outline-none transition";
const sectionCardClass =
  "bg-white dark:bg-white/5 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl shadow-sm dark:shadow-none p-6 md:p-8";

const Profile = () => {
  const navigate = useNavigate();
  const { user, userAuthentication, API, authorizationToken, LogoutUser } =
    useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [stats, setStats] = useState(null);
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    height: "",
    weight: "",
    age: "",
    gender: "",
    fitnessGoal: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        height: user.profile?.height || "",
        weight: user.profile?.weight || "",
        age: user.profile?.age || "",
        gender: user.profile?.gender || "",
        fitnessGoal: user.profile?.fitnessGoal || "",
      });
      setPreview(
        user.avatar && user.avatar.startsWith("http") ? user.avatar : "",
      );
    }
  }, [user]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await axios.get(`${API}/api/progress/dashboard/stats`, {
          headers: { Authorization: authorizationToken },
        });
        setStats(res.data);
      } catch {
        /* optional */
      }
    };
    if (authorizationToken) loadStats();
  }, [API, authorizationToken]);

  const handleChange = (e) => {
    setMessage("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      phone: user.phone || "",
      height: user.profile?.height || "",
      weight: user.profile?.weight || "",
      age: user.profile?.age || "",
      gender: user.profile?.gender || "",
      fitnessGoal: user.profile?.fitnessGoal || "",
    });
    setPreview(user.avatar || "");
    setProfileImage(null);
    setMessage("");
  };

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
      data.append("phone", formData.phone?.trim() || "");
      if (formData.height) data.append("height", formData.height);
      if (formData.weight) data.append("weight", formData.weight);
      if (formData.age) data.append("age", formData.age);
      if (formData.gender) data.append("gender", formData.gender);
      if (formData.fitnessGoal)
        data.append("fitnessGoal", formData.fitnessGoal);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview("");
    }
  };

  const handleWeightLog = async (e) => {
    e.preventDefault();
    const w = Number(weightInput);
    if (!Number.isFinite(w) || w <= 0) {
      toast.error("Enter a valid weight");
      return;
    }
    try {
      await axios.post(
        `${API}/api/progress/weight`,
        { weight: w },
        { headers: { Authorization: authorizationToken } },
      );
      toast.success("Weight logged");
      setWeightInput("");
      await userAuthentication();
      const res = await axios.get(`${API}/api/progress/dashboard/stats`, {
        headers: { Authorization: authorizationToken },
      });
      setStats(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not log weight");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (isChangingPassword) return;

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
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
        { currentPassword, newPassword },
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

  const achievements = user?.achievements || [];
  const hasPasswordMismatch =
    passwordForm.confirmPassword.length > 0 &&
    passwordForm.newPassword !== passwordForm.confirmPassword;
  const passwordStrengthText = useMemo(() => {
    if (!passwordForm.newPassword) return "";
    if (passwordForm.newPassword.length < 6) return "Too short";
    if (passwordForm.newPassword.length < 10) return "Medium strength";
    return "Strong password";
  }, [passwordForm.newPassword]);
  const hasProfileChanges = useMemo(() => {
    if (!user) return false;
    return (
      profileImage !== null ||
      (formData.name || "") !== (user.name || "") ||
      (formData.email || "") !== (user.email || "") ||
      (formData.phone || "") !== (user.phone || "") ||
      String(formData.height || "") !== String(user.profile?.height || "") ||
      String(formData.weight || "") !== String(user.profile?.weight || "") ||
      String(formData.age || "") !== String(user.profile?.age || "") ||
      (formData.gender || "") !== (user.profile?.gender || "") ||
      (formData.fitnessGoal || "") !== (user.profile?.fitnessGoal || "")
    );
  }, [formData, profileImage, user]);

  const statCard =
    "bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl p-4 text-center shadow-sm dark:shadow-none";

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-neutral-950 text-zinc-900 dark:text-white px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Profile
            </h1>
            <p className="text-sm text-zinc-500 dark:text-neutral-400 mt-1">
              Manage account details, goals, and security settings.
            </p>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={statCard}>
              <p className="text-xs text-zinc-500 dark:text-neutral-500 uppercase tracking-wide">
                Workouts
              </p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {stats.totalWorkouts}
              </p>
            </div>
            <div className={statCard}>
              <p className="text-xs text-zinc-500 dark:text-neutral-500 uppercase tracking-wide">
                7d kcal
              </p>
              <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                {stats.totalCaloriesThisWeek}
              </p>
            </div>
            <div className={statCard}>
              <p className="text-xs text-zinc-500 dark:text-neutral-500 uppercase tracking-wide">
                Streak
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.currentStreak} 🔥
              </p>
            </div>
            <div className={statCard}>
              <p className="text-xs text-zinc-500 dark:text-neutral-500 uppercase tracking-wide">
                Best streak
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                {stats.longestStreak}
              </p>
            </div>
          </div>
        )}

        <div className={sectionCardClass}>
          <div className="flex flex-col items-center mb-6">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                onError={() => setPreview("")}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary-500 shadow-[0_0_18px_rgba(56,189,248,0.4)]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-linear-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_18px_rgba(99,102,241,0.35)]">
                {(formData?.name?.trim()?.[0] || "U").toUpperCase()}
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
            <p className="text-xs text-zinc-500 dark:text-neutral-500 mt-2">
              JPG, PNG up to 5MB recommended
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Personal information
              </h2>
              <p className="text-sm text-zinc-500 dark:text-neutral-500">
                Keep your account details updated for a better experience.
              </p>
            </div>
            <div>
              <label className="block mb-2 text-sm text-zinc-600 dark:text-neutral-300">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter your full name"
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
                className={inputClass}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-600 dark:text-neutral-300">
                Phone (optional)
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
                placeholder="Optional"
              />
            </div>

            <div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                Body metrics
              </h3>
              <p className="text-sm text-zinc-500 dark:text-neutral-500">
                These values help personalize recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm text-zinc-600 dark:text-neutral-300">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className={inputClass}
                  min="50"
                  max="300"
                  placeholder="e.g. 175"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm text-zinc-600 dark:text-neutral-300">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className={inputClass}
                  min="20"
                  max="400"
                  placeholder="e.g. 72"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm text-zinc-600 dark:text-neutral-300">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={inputClass}
                  min="10"
                  max="120"
                  placeholder="e.g. 25"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm text-zinc-600 dark:text-neutral-300">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-600 dark:text-neutral-300">
                Fitness Goal
              </label>
              <select
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Maintenance">Maintenance</option>
                <option value="General Fitness">General Fitness</option>
              </select>
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
                className="w-full sm:flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 transition font-bold text-white shadow-[0_0_18px_rgba(14,165,233,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </div>

        <div className={sectionCardClass}>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
            Log weight
          </h2>
          <p className="text-sm text-zinc-500 dark:text-neutral-500 mb-4">
            Updates your weight trend chart on the dashboard.
          </p>
          <form
            onSubmit={handleWeightLog}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="number"
              step="0.1"
              min="20"
              max="400"
              placeholder="Weight (kg)"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className={inputClass}
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-secondary-600 hover:bg-secondary-500 font-bold text-white shrink-0"
            >
              Add entry
            </button>
          </form>
        </div>

        <div className={sectionCardClass}>
          <h2 className="text-xl font-bold text-primary-600 dark:text-primary-500 mb-4">
            Badges
          </h2>
          {achievements.length === 0 ? (
            <p className="text-zinc-500 dark:text-neutral-500 text-sm">
              Keep training to unlock badges.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {achievements.map((ach) => (
                <div
                  key={ach._id}
                  className="bg-zinc-50 dark:bg-neutral-900/80 border border-primary-500/20 rounded-xl p-4 text-center"
                >
                  <div className="text-3xl mb-1">{ach.icon}</div>
                  <p className="font-semibold text-sm text-zinc-900 dark:text-white">
                    {ach.title}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-neutral-500 mt-1 line-clamp-2">
                    {ach.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={sectionCardClass}>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
            Change password
          </h2>
          <p className="text-sm text-zinc-500 dark:text-neutral-500 mb-4">
            Use your current password to set a new one.
          </p>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-zinc-600 dark:text-neutral-300">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={
                    passwordVisibility.currentPassword ? "text" : "password"
                  }
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordInputChange}
                  className={`${inputClass} pr-12`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("currentPassword")}
                  aria-label={
                    passwordVisibility.currentPassword
                      ? "Hide current password"
                      : "Show current password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 dark:text-neutral-400 dark:hover:text-white transition-colors"
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
                  aria-label={
                    passwordVisibility.newPassword
                      ? "Hide new password"
                      : "Show new password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 dark:text-neutral-400 dark:hover:text-white transition-colors"
                >
                  {passwordVisibility.newPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              <p
                className={`mt-2 text-xs ${
                  passwordStrengthText === "Too short"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-zinc-500 dark:text-neutral-500"
                }`}
              >
                {passwordStrengthText || "Use at least 6 characters."}
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm text-zinc-600 dark:text-neutral-300">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={
                    passwordVisibility.confirmPassword ? "text" : "password"
                  }
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordInputChange}
                  className={`${inputClass} pr-12`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  aria-label={
                    passwordVisibility.confirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 dark:text-neutral-400 dark:hover:text-white transition-colors"
                >
                  {passwordVisibility.confirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
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
                !passwordForm.currentPassword ||
                !passwordForm.newPassword ||
                !passwordForm.confirmPassword ||
                hasPasswordMismatch
              }
              className="w-full py-3 rounded-xl bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:hover:bg-zinc-200 transition font-bold text-white dark:text-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChangingPassword ? "Changing..." : "Change password"}
            </button>
          </form>
        </div>

        <div className={sectionCardClass}>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
            Account
          </h2>
          <button
            type="button"
            onClick={() => {
              toast(
                (t) => (
                  <div className="p-1 min-w-[240px]">
                    <p className="text-base font-semibold text-zinc-900 dark:text-white mb-5">
                      Are you sure you want to logout?
                    </p>

                    <div className="flex gap-3 justify-end mt-2">
                      <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm font-bold transition-all active:scale-95"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={async () => {
                          toast.dismiss(t.id);
                          await LogoutUser();
                          navigate("/login");
                        }}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-all shadow-sm shadow-red-500/20 active:scale-95"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                ),
                {
                  id: "logout-confirmation-toast",
                  duration: Infinity,
                },
              );
            }}
            className="w-full py-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-800 dark:text-red-600 font-bold transition-colors border border-red-200 dark:border-red-500/20"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
