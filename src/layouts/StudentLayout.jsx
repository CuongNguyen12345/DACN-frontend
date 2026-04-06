import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import Footer from "./components/Footer";

const StudentLayout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state

  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-white ${isDarkMode ? 'dark' : ''}`}>
      <Header
        isLoggedIn={isLoggedIn}
        navigate={navigate}
        handleLogout={handleLogout}
        userAvatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`}
      />

      {/* Main Content */}
      <main className="flex-1 w-full bg-gray-50/30">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default StudentLayout;