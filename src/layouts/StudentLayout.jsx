import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import { ChatWidget } from "./components/ChatWidget";
import { useAuth } from "@/context/AuthContext";

const StudentLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        navigate={navigate}
        userAvatar={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "Felix"}`}
      />

      {/* Main Content */}
      <main className="flex-1 w-full bg-gray-50/30">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default StudentLayout;
