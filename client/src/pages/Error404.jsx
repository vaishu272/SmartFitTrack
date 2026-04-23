import { NavLink } from "react-router-dom";

const Error404 = () => {
  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 relative overflow-hidden bg-zinc-100 dark:bg-dark-950">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />

      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-orange-500 dark:from-rose-400 dark:to-orange-400 drop-shadow-lg mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Page Not Found</h2>
        <p className="text-lg text-zinc-600 dark:text-neutral-400 max-w-md mx-auto mb-10 leading-relaxed">
          Oops! It seems like the page you are looking for doesn&apos;t exist. If you believe there&apos;s
          an issue, feel free to report it — we&apos;ll look into it.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NavLink
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20"
          >
            Return Home
          </NavLink>
          <NavLink
            to="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-white font-medium hover:bg-zinc-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Go to app
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default Error404;
