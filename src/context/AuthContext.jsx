/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = React.useCallback(async () => {
    try {
      const response = await api.get("/api/auth/profile");
      if (response.data.result) {
        setUser(response.data.result);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  const role = user?.role?.toLowerCase() || null;

  const getBasePath = (r) => {
    switch (r) {
      case "admin": return "/admin";
      case "teacher": return "/teacher";
      default: return "/";
    }
  };

  const basePath = getBasePath(role);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, role, basePath, loading, login, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};