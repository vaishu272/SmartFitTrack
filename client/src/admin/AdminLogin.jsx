import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, ShieldCheck, Sun, Moon } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../store/auth";
import { useTheme } from "../store/theme";

const ADMIN_EMAIL = "smartfittrack1@gmail.com";

export default function AdminLogin() {
  const { LoginAdminUser, isLoggedIn, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: ADMIN_EMAIL,
      password: "",
    },
  });

  useEffect(() => {
    if (isLoggedIn && user?.role === "admin") {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isLoggedIn, navigate, user?.role]);

  useEffect(() => {
    if (localStorage.getItem("adminLogoutRedirect") === "true") {
      localStorage.removeItem("adminLogoutRedirect");
      toast.success("Logged out. Redirecting to home...", { duration: 3000 });
      const timer = setTimeout(() => {
        navigate("/", { replace: true, state: {} });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await LoginAdminUser(data.email, data.password);
      toast.success("Admin login successful");
      navigate("/admin/dashboard");
    } catch (error) {
      const message = error.response?.data?.message || "Admin login failed";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-6 bg-zinc-100 dark:bg-dark-950 relative">
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-full bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 text-zinc-500 hover:text-zinc-900 dark:text-neutral-400 dark:hover:text-white transition-colors shadow-sm"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <div className="w-full max-w-md bg-white dark:bg-dark-900 border border-zinc-200 dark:border-dark-800 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="text-primary-600" size={26} />
          <div>
            <h1 className="text-2xl font-bold">Admin Login</h1>
            <p className="text-sm text-zinc-500 dark:text-neutral-400">
              Sign in with the designated admin account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <input
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-dark-950 border border-zinc-200 dark:border-dark-800"
              type="email"
              readOnly
              {...register("email")}
            />
          </div>

          <div>
            <div className="relative">
              <input
                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-dark-950 border border-zinc-200 dark:border-dark-800 pr-12"
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-red-500 min-h-4 mt-1">
              {errors.password?.message || ""}
            </p>
          </div>

          <p className="text-xs text-red-500 min-h-4 text-center">
            {serverError}
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
