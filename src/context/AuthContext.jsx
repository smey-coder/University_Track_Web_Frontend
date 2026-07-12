import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==============================
  // CHECK LOGIN SESSION
  // ==============================

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await api.get("/user");

          const userData = {
            ...response.data,

            role: response.data.roles?.[0] || null,
          };

          setUser(userData);

          localStorage.setItem("user", JSON.stringify(userData));

          localStorage.setItem(
            "permissions",
            JSON.stringify(userData.permissions || []),
          );
        } catch (error) {
          console.log("Session expired");

          localStorage.clear();

          setUser(null);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // ==============================
  // LOGIN
  // ==============================

  const login = async (email, password) => {
    const response = await api.post("/login", {
      email,
      password,
    });

    const userData = {
      ...response.data.user,

      role: response.data.user.roles?.[0] || null,
    };

    localStorage.setItem("token", response.data.token);

    localStorage.setItem("user", JSON.stringify(userData));

    localStorage.setItem(
      "permissions",
      JSON.stringify(userData.permissions || []),
    );

    setUser(userData);

    console.log("LOGIN USER:", userData);

    return response.data;
  };

  // ==============================
  // REGISTER
  // ==============================

  const register = async (username, email, password) => {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });

    const userData = {
      ...response.data.user,

      role: response.data.user.roles?.[0] || null,
    };

    localStorage.setItem("token", response.data.token);

    localStorage.setItem("user", JSON.stringify(userData));

    localStorage.setItem(
      "permissions",
      JSON.stringify(userData.permissions || []),
    );

    setUser(userData);

    return response.data;
  };

  // ==============================
  // LOGOUT
  // ==============================

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.clear();

      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
