import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import AuthModal from "./components/AuthModal";
import { BookOpen } from "lucide-react";

const StudentLayout = () => {
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state

  const navigate = useNavigate();

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
    setIsAuthModalVisible(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalVisible(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-white ${isDarkMode ? 'dark' : ''}`}>
      <Header
        isLoggedIn={isLoggedIn}
        navigate={navigate}
        handleLogout={handleLogout}
        openAuthModal={openAuthModal}
        userAvatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`}
      />

      {/* Main Content */}
      <main className="flex-1 w-full bg-gray-50/30">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white pt-16 pb-8 border-t border-gray-100">
        <div className="container mx-auto px-4">
          {/* Top Footer */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 rounded-lg p-1.5">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900">EduPlatform</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
                Nền tảng tự học toàn diện cho học sinh cấp 3, giúp bạn nắm vững kiến thức và tự tin đạt điểm cao.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">Khám phá</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><a href="#" className="hover:text-blue-600">Học bài</a></li>
                <li><a href="#" className="hover:text-blue-600">Luyện đề</a></li>
                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">Về chúng tôi</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><a href="#" className="hover:text-blue-600">Sứ mệnh</a></li>
                <li><a href="#" className="hover:text-blue-600">Liên hệ</a></li>
                <li><a href="#" className="hover:text-blue-600">Điều khoản</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-sm">Hỗ trợ</h4>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><a href="#" className="hover:text-blue-600">Câu hỏi thường gặp</a></li>
                <li><a href="#" className="hover:text-blue-600">Góp ý</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-100 pt-8 text-center">
            <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Edu4All. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal
        isVisible={isAuthModalVisible}
        onClose={closeAuthModal}
        initialMode={authModalMode}
      />
    </div>
  );
};

export default StudentLayout;
