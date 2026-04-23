import { NavLink } from "react-router-dom";
import { Dumbbell, Target, Users, Zap } from "lucide-react";
import { useAuth } from "../store/auth";

export default function About() {
  const { isLoggedIn, user } = useAuth();
  return (
    <div className="min-h-[calc(100vh-80px)] overflow-hidden relative pb-20 bg-zinc-100 dark:bg-transparent">
      {/* Background decorations */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary-600/20 rounded-full blur-[100px] -z-10 mix-blend-screen animate-pulse" />
      <div className="absolute top-60 left-10 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-[120px] -z-10 mix-blend-screen" />

      <div className="container mx-auto px-6 py-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6 backdrop-blur-sm">
            Empowering Your Fitness Journey
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-6">
            About{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-secondary-600 dark:from-primary-300 dark:to-secondary-400">
              SmartFitTrack
            </span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            We believe that achieving your fitness goals shouldn't be
            complicated. Our mission is to provide an intuitive, data-driven
            platform that simplifies your workouts and maximizes your results.
          </p>
        </div>

        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          <div className="bg-white/80 dark:bg-neutral-900/50 border border-zinc-200 dark:border-white/10 rounded-3xl p-8 lg:p-10 backdrop-blur-sm shadow-xl shadow-zinc-200/40 dark:shadow-none hover:border-primary-500/50 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-6">
              <Target className="w-7 h-7" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              Our Mission
            </h3>
            <p className="text-zinc-600 dark:text-neutral-400 leading-relaxed text-lg">
              To empower individuals to take control of their health through
              precise tracking, insightful analytics, and a seamless digital
              experience that turns daily effort into lasting habits.
            </p>
          </div>
          <div className="bg-white/80 dark:bg-neutral-900/50 border border-zinc-200 dark:border-white/10 rounded-3xl p-8 lg:p-10 backdrop-blur-sm shadow-xl shadow-zinc-200/40 dark:shadow-none hover:border-secondary-500/50 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-secondary-500/20 text-secondary-600 dark:text-secondary-400 flex items-center justify-center mb-6">
              <Zap className="w-7 h-7" strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              Our Vision
            </h3>
            <p className="text-zinc-600 dark:text-neutral-400 leading-relaxed text-lg">
              To become the ultimate workout companion, fostering a global
              community where every drop of sweat is measured, celebrated, and
              transformed into lifelong well-being.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="max-w-5xl mx-auto mb-20 text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-10">
            Why Choose SmartFitTrack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: Dumbbell,
                title: "Rich Exercise Library",
                desc: "Access huge database of movements.",
              },
              {
                icon: Target,
                title: "Precision Tracking",
                desc: "Log every set, rep, and minute easily.",
              },
              {
                icon: Users,
                title: "Made for Everyone",
                desc: "From beginners to seasoned athletes.",
              },
              {
                icon: Zap,
                title: "Fast & Modern UI",
                desc: "Sleek, responsive dark-mode aesthetics.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white/60 dark:bg-neutral-900/40 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 backdrop-blur-sm"
              >
                <feature.icon
                  className="w-8 h-8 mx-auto text-primary-500 mb-4"
                  strokeWidth={1.5}
                />
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-200 mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-zinc-600 dark:text-neutral-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-linear-to-br from-primary-600 to-secondary-600 p-10 md:p-14 text-center shadow-2xl shadow-primary-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full" />

          {isLoggedIn ? (
            <>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
                Keep pushing your limits,{" "}
                {user?.name?.split(" ")[0] || "Athlete"}!
              </h2>
              <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8 relative z-10">
                You're already part of the SmartFitTrack family. Jump back into
                your dashboard and browse exercises.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <NavLink
                  to="/dashboard"
                  className="px-8 py-3.5 rounded-full bg-white text-primary-600 font-bold hover:bg-zinc-50 transition-colors shadow-lg"
                >
                  Go to Dashboard
                </NavLink>
                <NavLink
                  to="/exercises"
                  className="px-8 py-3.5 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Browse Exercises
                </NavLink>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
                Ready to track your progress?
              </h2>
              <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8 relative z-10">
                Join SmartFitTrack today and take the first step towards a
                stronger, healthier version of yourself and check out our demo
                exercises.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <NavLink
                  to="/register"
                  className="px-8 py-3.5 rounded-full bg-white text-primary-600 font-bold hover:bg-zinc-50 transition-colors shadow-lg"
                >
                  Sign Up Now
                </NavLink>
                <NavLink
                  to="/exercises-visitor"
                  className="px-8 py-3.5 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Check Exercises
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
