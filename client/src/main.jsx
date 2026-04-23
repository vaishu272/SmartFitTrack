import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./store/auth.jsx";
import { ThemeProvider } from "./store/theme.jsx";
import ThemedToaster from "./components/ThemedToaster.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider
    clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}
  >
    <ThemeProvider>
      <AuthProvider>
        <App />
        <ThemedToaster />
      </AuthProvider>
    </ThemeProvider>
  </GoogleOAuthProvider>,
);
