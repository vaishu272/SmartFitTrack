import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../store/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { API } = useAuth();
  const navigate = useNavigate();

  const inputBase =
    "w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-[#1a1a1a] border border-zinc-200 dark:border-transparent text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-neutral-500 outline-none transition";

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API}/api/auth/forgot-password`,
        { email },
        { withCredentials: true },
      );

      toast.success("OTP sent to your email");
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Enter the OTP sent to your email");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API}/api/auth/reset-password`,
        { email, otp, password },
        { withCredentials: true },
      );

      toast.success("Password reset successfully. You can now login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-zinc-100 dark:bg-transparent">
      <main className="w-full max-w-md">
        <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
              {sent ? "Reset Password" : "Forgot Password"}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-neutral-400 mt-2">
              {sent
                ? "Enter the 6-digit OTP sent to your email"
                : "Enter your email to receive an OTP"}
            </p>
          </div>

          {sent ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
                className={`${inputBase} text-center tracking-widest text-xl`}
              />

              <div className="relative">
                <input
                  placeholder="New Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputBase}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 dark:text-neutral-400 dark:hover:text-white focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <input
                  placeholder="Confirm New Password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={inputBase}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 dark:text-neutral-400 dark:hover:text-white focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-[#0091ff] to-[#6038f8] hover:opacity-90 rounded-xl text-white font-bold transition-all disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="text-sm text-[#0091ff] font-medium"
                >
                  Change Email or Resend
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputBase}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-[#0091ff] to-[#6038f8] hover:opacity-90 rounded-xl text-white font-bold transition-all disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-zinc-500 dark:text-neutral-400">
            Remember password?{" "}
            <NavLink
              to="/login"
              className="text-[#0091ff] hover:text-[#0091ff]/80 font-medium"
            >
              Back to Login
            </NavLink>
          </div>
        </div>
      </main>
    </section>
  );
};

export default ForgotPassword;
