import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./store/auth";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Error404 from "./pages/Error404";
import Navbar from "./components/Navbar";
import MobileBottomNav from "./components/MobileBottomNav";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import WorkoutLogger from "./pages/WorkoutLogger";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import History from "./pages/History";
import Contact from "./pages/Contact";
import About from "./pages/About";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import EmailVerification from "./pages/EmailVerification";
import ExerciseVisitor from "./pages/ExerciseVisitor";
import AdminLogin from "./admin/AdminLogin";
import AdminRoute from "./admin/AdminRoute";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import AdminWorkouts from "./admin/AdminWorkouts";
import AdminContacts from "./admin/AdminContacts";
import AdminSettings from "./admin/AdminSettings";
import AdminProfile from "./admin/AdminProfile";

function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const adminSectionPath = pathname.startsWith("/admin");
  const padForMobileNav =
    pathname !== "/login" &&
    pathname !== "/admin/login" &&
    pathname !== "/register" &&
    pathname !== "/onboarding" &&
    !adminSectionPath;

  useEffect(() => {
    if (user?.role === "admin" && !adminSectionPath) {
      toast.error("You cannot access user pages without logging out", {
        id: "admin-route-protect",
      });
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, adminSectionPath, navigate]);

  return (
    <>
      <div
        className={
          padForMobileNav
            ? "min-h-dvh flex flex-col pb-20 md:pb-0"
            : "min-h-dvh flex flex-col"
        }
      >
        {!adminSectionPath && <Navbar />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-otp" element={<EmailVerification />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/exercises-visitor" element={<ExerciseVisitor />} />

            <Route
              path="/onboarding"
              element={
                <PrivateRoute>
                  <Onboarding />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/log-workout"
              element={
                <PrivateRoute>
                  <WorkoutLogger />
                </PrivateRoute>
              }
            />
            <Route
              path="/exercises"
              element={
                <PrivateRoute>
                  <ExerciseLibrary />
                </PrivateRoute>
              }
            />
            <Route
              path="/history"
              element={
                <PrivateRoute>
                  <History />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route
                  index
                  element={<Navigate to="/admin/dashboard" replace />}
                />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="workouts" element={<AdminWorkouts />} />
                <Route path="contacts" element={<AdminContacts />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="profile" element={<AdminProfile />} />
              </Route>
            </Route>

            <Route path="*" element={<Error404 />} />
          </Routes>
        </main>
      </div>
      {!adminSectionPath && <MobileBottomNav />}
    </>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
};

export default App;
