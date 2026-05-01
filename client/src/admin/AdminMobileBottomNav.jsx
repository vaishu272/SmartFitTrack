import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  MessageSquare,
  MoreHorizontal,
  Settings,
  User,
  LogOut,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../store/auth";
import { useTheme } from "../store/theme";

export default function AdminMobileBottomNav() {
  const { LogoutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close menu when navigating
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMoreMenuOpen(false);
  }

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMoreMenuOpen(false);
      }
    }
    if (isMoreMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMoreMenuOpen]);

  const handleLogout = async () => {
    localStorage.setItem("adminLogoutRedirect", "true");
    await LogoutUser();
    setIsMoreMenuOpen(false);
    navigate("/admin/login", { replace: true });
  };

  const navItemClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 w-16 h-12 transition-all duration-200 ${
      isActive
        ? "text-primary-600 dark:text-primary-400 scale-110 font-bold"
        : "text-zinc-500 dark:text-zinc-400 hover:text-primary-500 dark:hover:text-primary-400 font-medium active:scale-95"
    }`;

  const centerButtonClass = ({ isActive }) =>
    `flex items-center justify-center -mt-6 w-14 h-14 rounded-full shadow-lg transition-all duration-200 active:scale-95 border-[4px] border-white dark:border-neutral-900 ${
      isActive
        ? "bg-primary-600 text-white shadow-primary-500/40"
        : "bg-primary-500 text-white hover:bg-primary-600 shadow-primary-500/30"
    }`;

  const moreMenuClass = `absolute left-4 right-4 bottom-24 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-zinc-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-4 transition-all duration-300 origin-bottom ${
    isMoreMenuOpen
      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
      : "opacity-0 scale-95 translate-y-4 pointer-events-none"
  }`;

  return (
    <>
      {/* Overlay to catch clicks outside menu */}
      {isMoreMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsMoreMenuOpen(false)}
        />
      )}

      <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-t border-zinc-200 dark:border-neutral-800 rounded-t-2xl pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        {/* More Menu Popover */}
        <div ref={menuRef} className={moreMenuClass}>
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-zinc-100 dark:border-neutral-800">
            <h3 className="font-bold text-zinc-900 dark:text-white">
              Admin Options
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-full bg-zinc-100 dark:bg-neutral-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1.5 rounded-full bg-zinc-100 dark:bg-neutral-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NavLink
              to="/admin/profile"
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-neutral-800/50 text-zinc-700 dark:text-zinc-300 active:bg-zinc-100 dark:active:bg-neutral-800 transition-colors"
            >
              <User size={24} className="text-primary-500" />
              <span className="font-medium text-sm">Profile</span>
            </NavLink>
            <NavLink
              to="/admin/settings"
              className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-zinc-50 dark:bg-neutral-800/50 text-zinc-700 dark:text-zinc-300 active:bg-zinc-100 dark:active:bg-neutral-800 transition-colors"
            >
              <Settings size={24} className="text-primary-500" />
              <span className="font-medium text-sm">Settings</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className="col-span-2 flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 active:bg-red-100 dark:active:bg-red-900/30 transition-colors"
            >
              <LogOut size={24} />
              <span className="font-medium text-sm">Log out Admin</span>
            </button>
          </div>
        </div>

        {/* Bottom Nav Items */}
        <div className="flex items-center justify-around px-2 pt-2 pb-1 relative z-50">
          <NavLink to="/admin/dashboard" className={navItemClass}>
            <LayoutDashboard size={24} strokeWidth={2.2} />
            <span className="text-[10px]">Dashboard</span>
          </NavLink>

          <NavLink to="/admin/users" className={navItemClass}>
            <Users size={24} strokeWidth={2.2} />
            <span className="text-[10px]">Users</span>
          </NavLink>

          <div className="w-16 flex justify-center">
            <NavLink to="/admin/workouts" className={centerButtonClass}>
              <Dumbbell size={24} strokeWidth={2.2} />
            </NavLink>
          </div>

          <NavLink to="/admin/contacts" className={navItemClass}>
            <MessageSquare size={24} strokeWidth={2.2} />
            <span className="text-[10px]">Contacts</span>
          </NavLink>

          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`flex flex-col items-center justify-center gap-1 w-16 h-12 transition-all duration-200 active:scale-95 ${
              isMoreMenuOpen
                ? "text-primary-600 dark:text-primary-400 scale-110 font-bold"
                : "text-zinc-500 dark:text-zinc-400 font-medium"
            }`}
          >
            <MoreHorizontal size={24} strokeWidth={2.2} />
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
