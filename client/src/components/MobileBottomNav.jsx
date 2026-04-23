import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Dumbbell,
  UserRound,
  Home,
  LogIn,
  UserPlus,
  Info,
  MessageSquareMore,
} from "lucide-react";
import { useAuth } from "../store/auth";

const badgeBase =
  "flex flex-col items-center justify-center gap-0.5 rounded-2xl px-1.5 py-2 min-w-0 flex-1 transition-all duration-200 active:scale-95";

const inactiveClass =
  "text-zinc-500 hover:text-primary-600 dark:text-zinc-400 dark:hover:text-primary-400";

const activeClass =
  "bg-primary-500 text-white shadow-md shadow-primary-500/35 dark:shadow-primary-500/25";

function NavBadge({ to, end, icon, label }) {
  const Icon = icon;
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `${badgeBase} ${isActive ? activeClass : inactiveClass}`
      }
    >
      <Icon className="w-5 h-5 shrink-0 mx-auto" strokeWidth={2} aria-hidden />
      <span className="text-[10px] font-semibold leading-tight text-center px-0.5 truncate max-w-full">
        {label}
      </span>
    </NavLink>
  );
}

function ActionBadge({ onClick, icon, label, variant = "default" }) {
  const Icon = icon;
  const base =
    variant === "danger"
      ? "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
      : inactiveClass;

  return (
    <button type="button" onClick={onClick} className={`${badgeBase} ${base}`}>
      <Icon className="w-5 h-5 shrink-0 mx-auto" strokeWidth={2} aria-hidden />
      <span className="text-[10px] font-semibold leading-tight text-center px-0.5 truncate max-w-full">
        {label}
      </span>
    </button>
  );
}

export default function MobileBottomNav() {
  const { isLoggedIn } = useAuth();
  const { pathname } = useLocation();

  const hideOnFocusedFlow =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/onboarding";

  if (hideOnFocusedFlow) return null;

  const loggedInPrimaryLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/log-workout", icon: PlusCircle, label: "Log" },
    { to: "/exercises", icon: Dumbbell, label: "Exercises" },
    { to: "/history", icon: History, label: "History" },
    { to: "/profile", icon: UserRound, label: "Profile" },
  ];

  const loggedInSecondaryLinks = [
    { to: "/about", icon: Info, label: "About" },
    { to: "/contact", icon: MessageSquareMore, label: "Contact" },
  ];

  const guestPrimaryLinks = [
    { to: "/", icon: Home, label: "Home", end: true },
    { to: "/exercises-visitor", icon: Dumbbell, label: "Exercises" },
    { to: "/about", icon: Info, label: "About" },
    { to: "/contact", icon: MessageSquareMore, label: "Contact" },
    { to: "/login", icon: LogIn, label: "Log in" },
    { to: "/register", icon: UserPlus, label: "Sign up" },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-60 md:hidden pointer-events-none"
      aria-label="Main navigation"
    >
      <div className="pointer-events-auto mx-3 mb-[max(0.5rem,env(safe-area-inset-bottom))] rounded-2xl border border-zinc-200/80 bg-white/90 px-1 py-2 shadow-lg shadow-zinc-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-neutral-950/90 dark:shadow-black/40">
        <div className="space-y-1.5">
          {isLoggedIn ? (
            <>
              <div className="flex items-stretch justify-between gap-0.5">
                {loggedInPrimaryLinks.map((item) => (
                  <NavBadge
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    end={item.end}
                  />
                ))}
              </div>
              <div className="flex items-stretch justify-center gap-0.5">
                {loggedInSecondaryLinks.map((item) => (
                  <NavBadge
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-stretch justify-between gap-0.5">
                {guestPrimaryLinks.map((item) => (
                  <NavBadge
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    end={item.end}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
