import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "../store/theme";

const Register = () => {
  const { isLoggedIn, API, LoginUserWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const onSubmit = async (data) => {
    setServerError("");

    try {
      const res = await axios.post(`${API}/api/auth/register`, data);
      toast.success(
        res.data?.message || "Registered successfully. Check your email.",
      );
      setRegisteredEmail(data.email);
      setRegistrationSuccess(true);
      reset();
    } catch (error) {
      const resData = error.response?.data;

      let errorMessage = "Registration failed";

      if (resData) {
        if (resData.extraDetails && typeof resData.extraDetails === "object") {
          errorMessage = Object.values(resData.extraDetails)[0];
        } else if (resData.message || resData.msg) {
          errorMessage = resData.message || resData.msg;
        } else if (resData.extraDetails) {
          errorMessage = resData.extraDetails;
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleResendVerification = async () => {
    if (!registeredEmail) return;
    try {
      setIsResending(true);
      const res = await axios.post(
        `${API}/api/auth/resend-verification-email`,
        {
          email: registeredEmail,
        },
      );
      toast.success(res.data?.message || "Verification email sent.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not resend email");
    } finally {
      setIsResending(false);
    }
  };

  const { isDark } = useTheme();

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative overflow-hidden bg-zinc-100 dark:bg-transparent">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-[520px] h-[520px] bg-secondary-500/18 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] bg-primary-500/20 rounded-full blur-[120px]" />
      </div>

      <main className="w-full max-w-5xl">
        <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row md:items-stretch">
          <div className="hidden md:flex flex-col justify-between relative bg-linear-to-br from-[#1d2a6a] via-[#103a8a] to-[#044c92] md:w-1/2 p-12 shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4yKSIvPjwvc3ZnPg==')] opacity-40 mask-[linear-gradient(to_bottom_right,white,transparent_80%)]" />
            <div className="absolute top-1/2 left-12 flex flex-col gap-3 opacity-20 transform -translate-y-1/2">
              <div className="h-2 w-48 bg-white rounded-full"></div>
              <div className="h-2 w-32 bg-white rounded-full"></div>
              <div className="h-2 w-40 bg-white rounded-full"></div>
            </div>

            <div className="relative z-10 text-white">
              <h3 className="text-xl font-bold tracking-tight">
                Create account
              </h3>
              <p className="text-sm text-white/80 mt-1">
                Start strong. Stay consistent.
              </p>
            </div>

            <div className="relative z-10 text-white mt-auto">
              <p className="text-sm text-white/80">Create an account</p>
              <h3 className="text-3xl font-bold tracking-tight mt-1">
                Consistency beats intensity.
              </h3>
              <p className="text-sm text-white/70 mt-3">
                Track workouts, calories, streaks and unlock badges.
              </p>
            </div>
          </div>

          <div className="p-8 sm:p-12 md:w-1/2 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Create an account
              </h2>
              <p className="text-sm text-zinc-500 dark:text-neutral-400 mt-2">
                Join SmartFitnessTracker and start logging workouts today.
              </p>
            </div>

            {registrationSuccess ? (
              <div className="rounded-2xl border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 p-5 space-y-4">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                  Verify your email
                </h3>
                <p className="text-sm text-green-700 dark:text-green-200">
                  We sent a 6-digit OTP to <strong>{registeredEmail}</strong>.
                  Please verify your email before logging in.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-700 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-semibold transition disabled:opacity-60"
                  >
                    {isResending ? "Resending..." : "Resend verification email"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/verify-email?email=${encodeURIComponent(registeredEmail)}`,
                      )
                    }
                    className="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition"
                  >
                    Verify with OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="flex-1 py-3 rounded-xl bg-linear-to-r from-[#0091ff] to-[#6038f8] hover:opacity-90 text-white font-bold transition"
                  >
                    Go to login
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
                <div className="space-y-1">
                  <input
                    className={[
                      "w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-[#1a1a1a] border border-zinc-200 dark:border-transparent text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-neutral-500 outline-none transition",
                      errors.name
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-transparent focus:border-neutral-600",
                    ].join(" ")}
                    type="text"
                   placeholder="Enter your full name (e.g., John Doe)"
                    id="name"
                    autoComplete="name"
                    aria-invalid={errors.name ? "true" : "false"}
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Minimum 2 characters required",
                      },
                    })}
                  />
                  <p className="min-h-5 text-red-400 text-xs mt-1">
                    {errors.name ? errors.name.message : ""}
                  </p>
                </div>

                <div className="space-y-1">
                  <input
                    className={[
                      "w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-[#1a1a1a] border border-zinc-200 dark:border-transparent text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-neutral-500 outline-none transition",
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
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
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
                        "w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-[#1a1a1a] border border-zinc-200 dark:border-transparent text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-neutral-500 outline-none transition pr-12",
                        errors.password
                          ? "border-red-500/50 focus:border-red-500"
                          : "border-transparent focus:border-neutral-600",
                      ].join(" ")}
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter your strong Password"
                      autoComplete="new-password"
                      aria-invalid={errors.password ? "true" : "false"}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                        maxLength: {
                          value: 100,
                          message: "Password must not exceed 100 characters",
                        },
                        pattern: {
                          value:
                            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/,
                          message:
                            "Password must contain uppercase, lowercase, number and special character",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-800 dark:text-neutral-400 dark:hover:text-white focus:outline-none transition-colors"
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

                <p className="min-h-5 text-red-500 text-xs text-center">
                  {serverError || ""}
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 mt-2 bg-linear-to-r from-[#0091ff] to-[#6038f8] hover:opacity-90 rounded-xl text-white font-bold transition-all active:scale-[0.98] disabled:opacity-60"
                >
                  {isSubmitting ? "Registering…" : "Register"}
                </button>
              </form>
            )}

            {!registrationSuccess && (
              <>
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
                </div>
              </>
            )}

            <div className="mt-8 text-center text-sm text-zinc-500 dark:text-neutral-400">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-[#0091ff] hover:text-[#0091ff]/80 font-medium transition-colors"
              >
                Sign in
              </NavLink>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Register;
