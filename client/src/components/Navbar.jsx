import { NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import { useAuth } from "../store/auth";
import { useTheme } from "../store/theme";
import { Moon, Sun, UserRound } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const handleClick = () => navigate("/");

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-300 hover:text-primary-600 dark:hover:text-primary-400 ${
      isActive
        ? "text-primary-600 dark:text-primary-400"
        : "text-zinc-600 dark:text-neutral-300"
    }`;

  const navLinks = isLoggedIn ? (
    <>
      <NavLink to="/dashboard" className={linkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/exercises" className={linkClass}>
        Exercise
      </NavLink>
      <NavLink to="/log-workout" className={linkClass}>
        Log Workout
      </NavLink>
      <NavLink to="/history" className={linkClass}>
        History
      </NavLink>
      {user?.role === "admin" && (
        <NavLink to="/admin" className={linkClass}>
          Admin
        </NavLink>
      )}
      <NavLink to="/about" className={linkClass}>
        AboutUs
      </NavLink>
      <NavLink to="/contact" className={linkClass}>
        ContactUs
      </NavLink>
    </>
  ) : (
    <>
      <NavLink to="/" className={linkClass}>
        Home
      </NavLink>
      <NavLink to="/exercises-visitor" className={linkClass}>
        Exercise
      </NavLink>
      <NavLink to="/about" className={linkClass}>
        AboutUs
      </NavLink>
      <NavLink to="/contact" className={linkClass}>
        ContactUs
      </NavLink>
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/85 backdrop-blur-md dark:border-white/10 dark:bg-neutral-950/80">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3">
        <div
          className="flex items-center gap-2 md:gap-3 cursor-pointer group min-w-0"
          onClick={handleClick}
        >
          {logo ? (
            <img
              src={logo}
              alt=""
              className="w-12 h-8 shrink-0 group-hover:rotate-360 transition-transform duration-300"
            />
          ) : (
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-white shrink-0">
              SF
            </div>
          )}
          <span className="text-base md:text-xl font-bold tracking-tight text-zinc-900 dark:text-white truncate">
            SmartFitnessTracker
          </span>
        </div>

        <div className="flex items-center gap-6 md:gap-8">
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {!isAuthPage && (
              <div className="hidden md:flex items-center gap-4 pl-2 border-l border-zinc-200 dark:border-white/10">
                {isLoggedIn ? (
                  <>
                    <NavLink
                      to="/profile"
                      className="flex items-center gap-2 text-sm font-semibold px-1 pr-4 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-neutral-200 transition-colors border border-zinc-200 dark:border-white/10 shadow-sm"
                      title="View & Update Profile"
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-zinc-300 dark:border-white/20 shadow-sm shrink-0">
                        {user?.avatar || user?.profilePic || user?.picture ? (
                          <img
                            src={user.avatar || user.profilePic || user.picture}
                            alt="profile"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <span>{user?.name?.split(" ")[0] || "Athlete"}</span>
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-neutral-300 dark:hover:text-white"
                    >
                      Log in
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="text-sm px-5 py-2 rounded-full bg-primary-600 text-white font-bold hover:bg-primary-500 transition shadow-[0_0_16px_rgba(14,165,233,0.25)]"
                    >
                      Sign up
                    </NavLink>
                  </>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full cursor-pointer p-2 text-zinc-600 hover:bg-zinc-200/80 hover:text-zinc-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" strokeWidth={2} />
              ) : (
                <Moon className="w-5 h-5" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
