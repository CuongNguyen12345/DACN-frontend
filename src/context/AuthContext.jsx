/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // 1. Khi vừa vào web, hỏi bộ nhớ xem trước đó đã đăng nhập chưa?
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("mock_login") === "true"
  );

  const login = () => {
    // 2. Khi đăng nhập: Lưu vào bộ nhớ + bật state
    localStorage.setItem("mock_login", "true");
    setIsLoggedIn(true);
  };

  const logout = () => {
    // 3. Khi đăng xuất: Xóa khỏi bộ nhớ + tắt state
    localStorage.removeItem("mock_login");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};