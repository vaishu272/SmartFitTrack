import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "../store/theme";

const Register = () => {
  const { isLoggedIn, API, LoginUserWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();

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
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await axios.post(`${API}/api/auth/register`, data);

      toast.success(res.data?.message || "OTP sent to your email");
      navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      reset();
    } catch (error) {
      const resData = error.response?.data;
      let errorMessage = "Registration failed";

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
    } catch {
      toast.error("Google Login Failed");
    }
  };

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative overflow-hidden bg-zinc-100 dark:bg-transparent">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-[520px] h-[520px] bg-primary-500/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-[520px] h-[520px] bg-secondary-500/20 rounded-full blur-[120px]" />
      </div>

      <main className="w-full max-w-5xl">
        <div className="bg-white dark:bg-[#111] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* LEFT */}
          <div className="hidden md:flex flex-col justify-between relative bg-linear-to-bl from-[#1d2a6a] via-[#103a8a] to-[#044c92] md:w-1/2 p-12">
            <div className="text-white text-right">
              <h3 className="text-xl font-bold">Join us</h3>
              <p className="text-sm text-white/80 mt-1">
                Start your fitness journey
              </p>
            </div>

            <div className="text-white mt-auto">
              <h3 className="text-3xl font-bold">
                Build habits. Stay consistent.
              </h3>
              <p className="text-sm text-white/70 mt-3">
                Track workouts, calories and streaks.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="p-8 sm:p-12 md:w-1/2 flex flex-col justify-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Create account
              </h2>
              <p className="text-sm text-zinc-500 dark:text-neutral-400 mt-2">
                Start your fitness journey 🚀
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
              {/* NAME */}
              <div className="space-y-1">
                <input
                  className={[
                    inputBase,
                    errors.name
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-transparent focus:border-neutral-600",
                  ].join(" ")}
                  type="text"
                  placeholder="Enter your Name"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Minimum 3 characters",
                    },
                  })}
                />
                <p className="min-h-5 text-red-400 text-xs">
                  {errors.name?.message}
                </p>
              </div>

              {/* EMAIL */}
              <div className="space-y-1">
                <input
                  className={[
                    inputBase,
                    errors.email
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-transparent focus:border-neutral-600",
                  ].join(" ")}
                  type="email"
                  placeholder="Enter your Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter valid email",
                    },
                  })}
                />
                <p className="min-h-5 text-red-400 text-xs">
                  {errors.email?.message}
                </p>
              </div>

              {/* PASSWORD */}
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
                    placeholder="Enter your Password"
                    {...register("password", {
                      required: "Password is required",
                      validate: (value) => {
                        if (value.length < 6) {
                          return "Minimum 6 characters required";
                        }

                        const strongRegex =
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

                        if (!strongRegex.test(value)) {
                          return "Password must contain uppercase, lowercase, number and special character";
                        }

                        return true;
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-neutral-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="min-h-5 text-red-400 text-xs">
                  {errors.password?.message}
                </p>
              </div>

              {/* SERVER ERROR */}
              <p className="min-h-5 text-red-500 text-xs text-center">
                {serverError}
              </p>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-2 bg-linear-to-r from-[#0091ff] to-[#6038f8] hover:opacity-90 rounded-xl text-white font-bold transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? "Registering…" : "Register"}
              </button>
            </form>

            {/* GOOGLE */}
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
                theme={isDark ? "filled_black" : "outline"}
                size="large"
                shape="rectangular"
                text="continue_with"
              />
            </div>

            <div className="mt-8 text-center text-sm text-zinc-500 dark:text-neutral-400">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="text-[#0091ff] hover:text-[#0091ff]/80 font-medium"
              >
                Login
              </NavLink>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Register;
