import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../store/auth";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useTheme } from "../store/theme";

const Login = () => {
  const { LoginUser, isLoggedIn, LoginUserWithGoogle, API, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const inputBase =
    "w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-[#1a1a1a] border border-zinc-200 dark:border-transparent text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-neutral-500 outline-none transition";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isLoggedIn) {
      if (user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isLoggedIn, navigate, user]);

  const onSubmit = async (data) => {
    setServerError("");

    try {
      await LoginUser(data.email, data.password);
      reset();
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      const resData = error.response?.data;
      if (error.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        toast.error("Please verify your email first");
        navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        return;
      }

      let errorMessage = "Login failed";

      if (resData) {
        if (resData.extraDetails && typeof resData.extraDetails === "object") {
          errorMessage = Object.values(resData.extraDetails)[0];
        } else if (resData.message) {
          errorMessage = resData.message;
        }
      }
      setServerError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${API}/api/auth/google-login`, {
        credential: credentialResponse.credential,
      });

      toast.success("Google Login Successful!");

      if (res.data.accessToken) {
        await LoginUserWithGoogle(res.data.accessToken);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Google Login Failed");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Login Failed");
  };

  const { isDark } = useTheme();

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative overflow-hidden bg-zinc-100 dark:bg-transparent">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-[520px] h-[520px] bg-primary-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] bg-secondary-500/20 rounded-full blur-[120px]" />
      </div>

      <main className="w-full max-w-5xl">
        <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row md:items-stretch">
          <div className="hidden md:flex flex-col justify-between relative bg-linear-to-bl from-[#1d2a6a] via-[#103a8a] to-[#044c92] md:w-1/2 p-12 shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIvPjwvc3ZnPg==')] opacity-40 mask-[linear-gradient(to_bottom_left,white,transparent_80%)]" />
            <div className="absolute top-1/2 right-12 flex flex-col items-end gap-3 opacity-20 transform -translate-y-1/2">
              <div className="h-2 w-48 bg-white rounded-full"></div>
              <div className="h-2 w-32 bg-white rounded-full"></div>
              <div className="h-2 w-40 bg-white rounded-full"></div>
            </div>

            <div className="relative z-10 text-white text-right">
              <h3 className="text-xl font-bold tracking-tight">Welcome back</h3>
              <p className="text-sm text-white/80 mt-1">
                Keep the momentum going.
              </p>
            </div>

            <div className="relative z-10 text-white mt-auto">
              <p className="text-sm text-white/80">Welcome back</p>
              <h3 className="text-3xl font-bold tracking-tight mt-1">
                Train smart. Track progress.
              </h3>
              <p className="text-sm text-white/70 mt-3">
                Sign in to continue logging workouts, calories and streaks.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-12 md:w-1/2 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Welcome back
              </h2>
              <p className="text-sm text-zinc-500 dark:text-neutral-400 mt-2">
                Sign in to continue your training.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
              <div className="space-y-1">
                <input
                  className={[
                    inputBase,
                    errors.email
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-transparent focus:border-neutral-600",
                  ].join(" ")}
                  type="email"
                  id="email"
                  placeholder="Enter your Email"
                  autoComplete="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Enter valid email",
                    },
                    validate: (value) =>
                      !value.endsWith(".com.com") ||
                      "Invalid domain structure (.com.com is not allowed)",
                  })}
                />
                <p className="min-h-5 text-red-400 text-xs mt-1">
                  {errors.email ? errors.email.message : ""}
                </p>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <input
                    className={[
                      inputBase,
                      "pr-12",
                      errors.password
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-transparent focus:border-neutral-600",
                    ].join(" ")}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your Password"
                    autoComplete="current-password"
                    aria-invalid={errors.password ? "true" : "false"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 dark:text-neutral-400 dark:hover:text-white transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="min-h-5 text-red-400 text-xs mt-1">
                  {errors.password ? errors.password.message : ""}
                </p>
              </div>
              <div className="flex justify-end">
                <NavLink
                  to="/forgot-password"
                  className="text-sm text-blue-800 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-200 font-medium transition-colors"
                >
                  Forgot Password
                </NavLink>
              </div>

              <p className="min-h-5 text-red-500 text-xs text-center">
                {serverError || ""}
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-2 bg-linear-to-r from-[#0091ff] to-[#6038f8] hover:opacity-90 rounded-xl text-white font-bold transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-[#111] text-zinc-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme={isDark ? "filled_black" : "outline"}
                size="large"
                shape="rectangular"
                text="continue_with"
              />
            </div>

            <div className="mt-8 text-center text-sm text-zinc-500 dark:text-neutral-400">
              No account?{" "}
              <NavLink
                to="/register"
                className="text-[#0091ff] hover:text-[#0091ff]/80 font-medium transition-colors"
              >
                Create one
              </NavLink>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Login;
