import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, User, Key, Palette, Sun, Moon, Bell, History, Trophy } from "lucide-react"; // Đã thêm icon Bell
import { useAuth } from "../../context/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Header = ({ navigate, userAvatar }) => {
    const { isLoggedIn, logout, role } = useAuth();

    // Lấy thông tin URL hiện tại
    const location = useLocation();
    const currentPath = location.pathname;
    
    // State để điều khiển việc Đóng/Mở Popup Đổi mật khẩu
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

    // Mock Data cho Thông báo (Sau này bạn thay bằng API)
    const [notifications, setNotifications] = useState([
        { id: 1, title: "Hệ thống", message: "Chào mừng bạn đến với Edu4All!", time: "Vừa xong", unread: true },
        { id: 2, title: "Bài tập mới", message: "Giáo viên vừa giao bài tập môn Toán.", time: "2 giờ trước", unread: true },
        { id: 3, title: "Nhắc nhở", message: "Đề thi thử THPT Quốc gia môn Lý sắp đóng.", time: "1 ngày trước", unread: false },
    ]);

    // Đếm số lượng thông báo chưa đọc
    const unreadCount = notifications.filter(n => n.unread).length;

    const navItems = [
        { key: "home", label: "Học bài", path: "/course" },
        { key: "practice", label: "Luyện đề", path: "/practice" },
        { key: "blog", label: "Blog", path: "/blog" },
        { key: "about", label: "Về chúng tôi", path: "/about" },
    ];

    const handlePasswordSubmit = () => {
        // Xử lý logic gọi API đổi mật khẩu ở đây
        console.log("Đã bấm lưu mật khẩu mới!");
        // Sau khi lưu xong thì đóng Popup
        setIsPasswordDialogOpen(false);
    };

    // Hàm đánh dấu đã đọc thông báo
    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
            <div className="container mx-auto h-20 flex items-center justify-between px-4">
                {/* Logo */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate("/")}
                >
                    <div className="bg-[#3B82F6] rounded-xl p-2 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <BookOpen className="h-6 w-6 text-white" strokeWidth={2} />
                    </div>
                    <span className="font-bold text-xl tracking-tight">
                        <span className="text-[#0F4C81]">Edu</span>
                        <span className="text-[#FF6B50]">4All</span>
                    </span>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-10">
                    {navItems.map((item) => {
                        const isActive = currentPath.startsWith(item.path);
                        return (
                            <button
                                key={item.key}
                                onClick={() => navigate(item.path)}
                                className={`cursor-pointer text-base font-bold transition-colors ${
                                    isActive 
                                    ? "text-[#3B82F6] border-b-2 border-[#3B82F6] pb-1" 
                                    : "text-gray-500 hover:text-[#3B82F6]" 
                                }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {!isLoggedIn ? (
                        <Button
                            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-base font-bold rounded-full px-7 h-11 shadow-sm hover:shadow-md transition-all"
                            onClick={() => navigate("/login")}
                        >
                            Đăng nhập
                        </Button>
                    ) : (
                        <>
                            {/* MENU THÔNG BÁO (CHUÔNG) */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none focus:ring-0">
                                    <div className="relative p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                                        <Bell className="h-6 w-6 text-gray-600" />
                                        {/* Chấm đỏ báo có thông báo mới */}
                                        {unreadCount > 0 && (
                                            <span className="absolute top-1 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                        )}
                                    </div>
                                </DropdownMenuTrigger>
                                
                                <DropdownMenuContent align="end" className="w-80 mt-2 p-0">
                                    <div className="p-3 border-b flex justify-between items-center bg-gray-50 rounded-t-md">
                                        <span className="font-bold text-gray-800">Thông báo</span>
                                        {unreadCount > 0 && (
                                            <span className="text-xs text-blue-600 cursor-pointer hover:underline" onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}>
                                                Đánh dấu đã đọc
                                            </span>
                                        )}
                                    </div>
                                    <div className="max-h-[350px] overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif) => (
                                                <div 
                                                    key={notif.id} 
                                                    className={`p-3 border-b last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${notif.unread ? "bg-blue-50/50" : ""}`}
                                                    onClick={() => markAsRead(notif.id)}
                                                >
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className={`text-sm font-semibold ${notif.unread ? "text-blue-700" : "text-gray-800"}`}>
                                                            {notif.title}
                                                        </span>
                                                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                                            {notif.time}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {notif.message}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-6 text-center text-gray-500 text-sm">
                                                Bạn không có thông báo nào.
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2 border-t text-center bg-gray-50 rounded-b-md">
                                        <span className="text-sm text-blue-600 hover:underline cursor-pointer font-medium"
                                            onClick={() => navigate("/notification")}
                                        >
                                            Xem tất cả thông báo
                                        </span>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* MENU DROPDOWN TÀI KHOẢN */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none focus:ring-0">
                                    <img
                                        src={userAvatar || "/avatar.png"}
                                        alt="User Avatar"
                                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent hover:border-[#3B82F6] transition-all object-cover"
                                    />
                                </DropdownMenuTrigger>
                                
                                <DropdownMenuContent align="end" className="w-56 mt-2">
                                    <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Trang cá nhân</span>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/studyhistory")}>
                                        <History className="mr-2 h-4 w-4" />
                                        <span>Lịch sử học tập</span>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/leaderboard")}>
                                        <History className="mr-2 h-4 w-4" />
                                        <span>Bảng xếp hạng</span>
                                    </DropdownMenuItem>
                                    
                                    {role === "admin" ? (
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/admin")}>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Giao diện Admin</span>
                                        </DropdownMenuItem>
                                    ) : role === "teacher" ? (
                                        <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/teacher")}>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Giao diện giáo viên</span>
                                        </DropdownMenuItem>
                                    ) : null}
                                    
                                    <DropdownMenuItem 
                                        className="cursor-pointer" 
                                        onSelect={(e) => {
                                            e.preventDefault();
                                            setIsPasswordDialogOpen(true);
                                        }}
                                    >
                                        <Key className="mr-2 h-4 w-4" />
                                        <span>Đổi mật khẩu</span>
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuSeparator />
                                    
                                    <DropdownMenuItem 
                                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" 
                                        onClick={() => {
                                            logout();
                                            navigate("/");
                                        }}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Đăng xuất</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* DIALOG (POPUP) ĐỔI MẬT KHẨU */}
                            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl">Đổi mật khẩu</DialogTitle>
                                        <DialogDescription>
                                            Nhập mật khẩu hiện tại và mật khẩu mới để bảo mật tài khoản.
                                        </DialogDescription>
                                    </DialogHeader>
                                    
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current">Mật khẩu hiện tại</Label>
                                            <Input id="current" type="password" placeholder="••••••••" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new">Mật khẩu mới</Label>
                                            <Input id="new" type="password" placeholder="••••••••" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm">Xác nhận mật khẩu mới</Label>
                                            <Input id="confirm" type="password" placeholder="••••••••" />
                                        </div>
                                    </div>
                                    
                                    <DialogFooter className="gap-2 sm:gap-0">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setIsPasswordDialogOpen(false)}
                                        >
                                            Hủy
                                        </Button>
                                        <Button 
                                            className="bg-[#3B82F6] hover:bg-[#2563EB]"
                                            onClick={handlePasswordSubmit}
                                        >
                                            Lưu thay đổi
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};