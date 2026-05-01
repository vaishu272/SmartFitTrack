import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  MessageSquare,
  Settings,
  LogOut,
  User,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../store/auth";
import { useTheme } from "../store/theme";

const linkBase =
  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/workouts", label: "Workouts", icon: Dumbbell },
  { to: "/admin/contacts", label: "Contacts", icon: MessageSquare },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/profile", label: "Profile", icon: User },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { LogoutUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleAdminLogout = async () => {
    localStorage.setItem("adminLogoutRedirect", "true");
    await LogoutUser();
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside className="w-full md:w-64 md:min-h-screen md:sticky md:top-0 border-r border-zinc-200 dark:border-dark-800 bg-white dark:bg-dark-900 p-4">
      <div className="mb-0 md:mb-6 flex items-center justify-between">
        <div className="text-center md:text-left">
          <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-neutral-500 hidden md:block">
            SmartFitTrack
          </p>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Admin Panel
          </h2>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-neutral-400 dark:hover:bg-dark-800 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <nav className="hidden md:block space-y-1 mt-6 md:mt-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-zinc-700 dark:text-neutral-300 hover:bg-zinc-100 dark:hover:bg-dark-800"
                }`
              }
            >
              <Icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
        <button
          type="button"
          onClick={handleAdminLogout}
          className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <LogOut size={17} />
          <span>Logout Admin</span>
        </button>
      </nav>
    </aside>
  );
}
