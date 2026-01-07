
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export const Header = ({ isLoggedIn, navigate, handleLogout, openAuthModal, userAvatar }) => {
    const navItems = [
        { key: "home", label: "Học bài", path: "/courses" },
        { key: "practice", label: "Luyện đề", path: "/practice" },
        { key: "blog", label: "Blog", path: "/blog" },
        { key: "about", label: "Về chúng tôi", path: "/about" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
            <div className="container mx-auto h-20 flex items-center justify-between px-4">
                {/* Logo */}
                <div
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <div className="bg-blue-600 rounded-lg p-1.5">
                        <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-gray-900">Edu4All</span>
                </div>

                {/* Navigation (Center) */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => navigate(item.path)}
                            className="text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors"
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Right Section: Actions */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        className="text-gray-600 font-semibold hover:bg-gray-50 rounded-full px-6"
                        onClick={() => openAuthModal("login")}
                    >
                        Đăng nhập
                    </Button>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white! font-bold rounded-full px-6 shadow-md shadow-blue-200"
                        onClick={() => openAuthModal("register")}
                    >
                        Đăng ký
                    </Button>
                </div>
            </div>
        </header>
    );
};
