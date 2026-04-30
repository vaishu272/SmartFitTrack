import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminMobileBottomNav from "./AdminMobileBottomNav";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-dark-950 text-zinc-900 dark:text-white md:flex pb-20 md:pb-0">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8">
        <Outlet />
      </main>
      <AdminMobileBottomNav />
    </div>
  );
}
