import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const Home = () => {
  const { isLoggedIn, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !isLoggedIn) return;
    if (!user?.onboardingComplete) {
      navigate("/onboarding", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoading, isLoggedIn, user, navigate]);

  if (isLoading || isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-zinc-100 dark:bg-dark-950">
        <div className="h-10 w-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] overflow-hidden relative pb-20 bg-zinc-100 dark:bg-transparent">
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] -z-10 mix-blend-screen animate-pulse" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-[120px] -z-10 mix-blend-screen" />

      <div className="container mx-auto px-6 py-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6 backdrop-blur-sm">
            Train smarter. Track everything.
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-8">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-secondary-600 dark:from-primary-300 dark:to-secondary-400">
              SmartFitTrack
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Log workouts, watch weight trends, burn calories with clarity, and unlock achievements — all
            in one MERN-powered fitness hub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NavLink
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary-500 text-white font-semibold hover:bg-primary-400 transition-colors shadow-[0_0_28px_rgba(14,165,233,0.45)]"
            >
              Get Started
            </NavLink>
            <NavLink
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white font-medium hover:bg-zinc-50 dark:hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Sign In
            </NavLink>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 dark:bg-neutral-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-primary-500/50 transition-colors shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-6 text-2xl">
              🏋️
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Workout logging</h3>
            <p className="text-zinc-600 dark:text-neutral-400 text-sm leading-relaxed">
              Build sessions from the exercise library with duration, sets, and reps. Calories are
              calculated automatically from MET-style rates.
            </p>
          </div>
          <div className="bg-white/80 dark:bg-neutral-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-secondary-500/50 transition-colors shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-xl bg-secondary-500/20 text-secondary-600 dark:text-secondary-400 flex items-center justify-center mb-6 text-2xl">
              📊
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Analytics</h3>
            <p className="text-zinc-600 dark:text-neutral-400 text-sm leading-relaxed">
              Dashboard charts for weekly calories and weight history so you can see momentum at a glance.
            </p>
          </div>
          <div className="bg-white/80 dark:bg-neutral-900/50 border border-zinc-200 dark:border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:border-purple-500/50 transition-colors shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 text-2xl">
              🏅
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">Streaks & badges</h3>
            <p className="text-zinc-600 dark:text-neutral-400 text-sm leading-relaxed">
              Stay consistent with streak tracking and earn achievements for milestones like first workout
              and calorie totals.
            </p>
          </div>
        </div>

        {/* Visitor vs User Capabilities */}
        <div className="mt-16 max-w-5xl mx-auto rounded-3xl overflow-hidden bg-white/60 dark:bg-neutral-900/40 border border-zinc-200 dark:border-white/10 backdrop-blur-lg shadow-xl shadow-zinc-200/50 dark:shadow-none relative">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-white/10">
            {/* Visitor Block */}
            <div className="p-8 md:p-12 hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-zinc-200 dark:bg-neutral-800 flex items-center justify-center text-2xl">
                  👀
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">For Visitors</h3>
              </div>
              <p className="text-zinc-600 dark:text-neutral-400 leading-relaxed text-lg">
                As a guest, you have full access to browse our comprehensive library of exercises. Discover new movements, view detailed instructional media, and learn about targeted muscle groups.
              </p>
            </div>
            {/* User Block */}
            <div className="p-8 md:p-12 bg-primary-50/50 dark:bg-primary-900/10 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors relative overflow-hidden">
              {/* Background subtle glow for premium feel */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-400/20 rounded-full blur-3xl" />
              <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center text-2xl">
                  👑
                </div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">For Registered Users</h3>
              </div>
              <p className="text-zinc-700 dark:text-neutral-300 leading-relaxed text-lg relative z-10 font-medium">
                Unlock your full potential! Registered users can track workouts in their calendar, log performance data, maintain activity streaks, and visually track weight loss over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
