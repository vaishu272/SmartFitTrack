import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL ?? "";
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("Enter your email and OTP to verify.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [searchParams]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email.trim() || !otp.trim()) {
      toast.error("Email and OTP are required");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post(`${API}/api/auth/verify-email`, {
        email: email.trim(),
        otp: otp.trim(),
      });
      setStatus("success");
      setMessage(res.data?.message || "Email verified successfully.");
      toast.success("Email verified successfully");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.message || "Verification failed. Please try again.",
      );
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim()) {
      toast.error("Enter email to resend OTP");
      return;
    }
    try {
      setIsResending(true);
      const res = await axios.post(`${API}/api/auth/resend-verification-email`, {
        email: email.trim(),
      });
      toast.success(res.data?.message || "Verification OTP sent.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10 bg-zinc-100 dark:bg-neutral-950">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-neutral-900 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Email Verification
        </h1>
        <p
          className={`text-sm ${status === "success"
              ? "text-green-600 dark:text-green-400"
              : status === "error"
                ? "text-red-600 dark:text-red-400"
                : "text-zinc-500 dark:text-neutral-400"
            }`}
        >
          {message}
        </p>

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm mb-2 text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-neutral-800 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white outline-none focus:border-primary-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm mb-2 text-zinc-700 dark:text-zinc-300">
              OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-neutral-800 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white outline-none focus:border-primary-500 tracking-[0.4em] text-center"
              placeholder="123456"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 transition disabled:opacity-60"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResending}
            className="w-full rounded-xl bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold py-3 transition disabled:opacity-60"
          >
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
        </form>

        <div className="mt-4">
          <NavLink
            to="/register"
            className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-300 dark:border-white/10 text-zinc-700 dark:text-zinc-300 font-semibold py-3 transition hover:bg-zinc-100 dark:hover:bg-white/5"
          >
            Back to Register
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default EmailVerification;
