import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-dark-950 flex flex-col items-center justify-center gap-3 text-primary-600 dark:text-primary-500">
        <div className="h-10 w-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-zinc-500 dark:text-neutral-400">Loading…</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user && !user.onboardingComplete && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default PrivateRoute;
