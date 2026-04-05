import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const USER_STORAGE_KEY = "auth_user";
const TOKEN_STORAGE_KEY = "auth_token";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
  });

  const isLoggedIn = !!user && !!token;

  const login = ({ token, user }) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);

    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => {
      const role = user?.role || null;
      
      // Khởi tạo basePath dựa trên role
      const basePath = role === "admin" ? "/admin" : "/teacher";
      
      return {
      user,
      token,
      role,
      basePath,
      isLoggedIn,
      login,
      logout,
      }
    },
    [user, token, isLoggedIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};