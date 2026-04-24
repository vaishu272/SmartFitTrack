import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

function AppShell() {
  const { pathname } = useLocation();
  const padForMobileNav =
    pathname !== "/login" &&
    pathname !== "/register" &&
    pathname !== "/onboarding";

  return (
    <>
      <div
        className={
          padForMobileNav
            ? "min-h-dvh flex flex-col pb-20 md:pb-0"
            : "min-h-dvh flex flex-col"
        }
      >
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<EmailVerification />} />
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

            <Route path="*" element={<Error404 />} />
          </Routes>
        </main>
      </div>
      <MobileBottomNav />
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
