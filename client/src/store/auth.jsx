/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const authorizationToken = useMemo(
    () => (accessToken ? `Bearer ${accessToken}` : ""),
    [accessToken],
  );

  const refreshToken = useCallback(async () => {
    try {
      const res = await axios.post(
        `${API_BASE}/api/auth/refresh`,
        {},
        { withCredentials: true },
      );

      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    } catch {
      setAccessToken(null);
      setUser(null);
      return null;
    }
  }, []);

  const userAuthentication = async () => {
    try {
      setIsLoading(true);

      let token = accessToken;

      if (!token) {
        token = await refreshToken();
      }

      if (!token) {
        setUser(null);
        return;
      }

      const response = await axios.get(`${API_BASE}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setUser(response.data.userData);
    } catch (error) {
      console.log(
        "Error fetching user:",
        error.response?.data || error.message,
      );
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const LoginUserWithGoogle = async (token) => {
    setAccessToken(token);

    try {
      const res = await axios.get(`${API_BASE}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setUser(res.data.userData);
    } catch (error) {
      console.error("Google auth failed:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    userAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (
          accessToken &&
          !config.url?.includes("/refresh") &&
          !config.url?.includes("/login") &&
          !config.url?.includes("/register")
        ) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/refresh") &&
          !originalRequest.url?.includes("/login")
        ) {
          originalRequest._retry = true;
          try {
            const newToken = await refreshToken();
            if (newToken && typeof newToken === "string") {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error("Refresh token failed", refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshToken]);

  const LoginUser = async (email, password) => {
    const res = await axios.post(
      `${API_BASE}/api/auth/login`,
      { email, password },
      { withCredentials: true },
    );

    const token = res.data.accessToken;

    setAccessToken(token);

    const response = await axios.get(`${API_BASE}/api/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    setUser(response.data.userData);

    return res.data;
  };

  const LogoutUser = async () => {
    try {
      await axios.post(
        `${API_BASE}/api/auth/logout`,
        {},
        { withCredentials: true },
      );

      setAccessToken(null);
      setUser(null);
    } catch (error) {
      console.log("Logout error:", error.response?.data || error.message);
    }
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        accessToken,
        API: API_BASE,
        authorizationToken,
        LoginUser,
        LoginUserWithGoogle,
        LogoutUser,
        userAuthentication,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);

  if (!authContextValue) {
    throw new Error("useAuth used outside provider");
  }

  return authContextValue;
};
