
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
                    className="flex items-center gap-3 cursor-pointer group" // Thêm group để làm hiệu ứng
                    onClick={() => navigate('/')}>
                    {/* Icon Container: Thêm bóng (shadow) và hiệu ứng scale khi hover */}
                    <div className="bg-[#3B82F6] rounded-xl p-2 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {/* Tăng strokeWidth lên 2 để icon dày dặn hơn */}
                        <BookOpen className="h-6 w-6 text-white" strokeWidth={2} />
                    </div>

                    {/* Text Logo: Phân chia màu sắc để tạo điểm nhấn thương hiệu */}
                    <span className="font-bold text-xl tracking-tight">
                        <span className="text-[#0F4C81]">Edu</span>
                        <span className="text-[#FF6B50]">4All</span>
                    </span>
                </div>

                {/* Navigation (Center) */}<nav className="hidden md:flex items-center gap-10">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => navigate(item.path)}
                            className="cursor-pointer text-base font-bold text-gray-500 hover:text-[#3B82F6] transition-colors"
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Right Section: Actions */}
                <div className="flex items-center gap-3">
                    <Button
                        // Thêm h-11 và px-7 để nút to bè hơn, text-base để chữ trong nút to ra
                        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-base font-bold rounded-full px-7 h-11 shadow-sm hover:shadow-md transition-all"
                        onClick={() => navigate('/login')}
                    >
                        Đăng nhập
                    </Button>
                </div>
            </div>
        </header>
    );
};
