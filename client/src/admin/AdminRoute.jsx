import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth";

export default function AdminRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-dark-950 flex items-center justify-center">
        <div className="h-10 w-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
