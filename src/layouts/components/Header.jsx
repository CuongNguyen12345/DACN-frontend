import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, LogOut, User, Key, Palette, Sun, Moon } from "lucide-react"; 
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
    const { isLoggedIn, logout } = useAuth();
    
    // State để điều khiển việc Đóng/Mở Popup Đổi mật khẩu
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

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

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
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

                {/* Right Section */}
                <div className="flex items-center gap-3">
                    {!isLoggedIn ? (
                        <Button
                            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-base font-bold rounded-full px-7 h-11 shadow-sm hover:shadow-md transition-all"
                            onClick={() => navigate("/login")}
                        >
                            Đăng nhập
                        </Button>
                    ) : (
                        <>
                            {/* MENU DROPDOWN */}
                            <DropdownMenu>
                                <DropdownMenuTrigger className="outline-none focus:ring-0">
                                    <img
                                        src={userAvatar || "/avatar.png"}
                                        alt="User Avatar"
                                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent hover:border-[#3B82F6] transition-all"
                                    />
                                </DropdownMenuTrigger>
                                
                                <DropdownMenuContent align="end" className="w-56 mt-2">
                                    <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    
                                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/profile")}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Trang cá nhân</span>
                                    </DropdownMenuItem>
                                    
                                    {/* Nút kích hoạt mở Dialog Đổi mật khẩu */}
                                    <DropdownMenuItem 
                                        className="cursor-pointer" 
                                        onSelect={(e) => {
                                            e.preventDefault(); // Ngăn DropdownMenu tự động đóng khi vừa bấm
                                            setIsPasswordDialogOpen(true);
                                        }}
                                    >
                                        <Key className="mr-2 h-4 w-4" />
                                        <span>Đổi mật khẩu</span>
                                    </DropdownMenuItem>
                                    
                                    {/* Nút Đổi Theme */}
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger className="cursor-pointer">
                                            <Palette className="mr-2 h-4 w-4" />
                                            <span>Giao diện</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent className="w-36">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Sun className="mr-2 h-4 w-4" />
                                                    <span>Sáng</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Moon className="mr-2 h-4 w-4" />
                                                    <span>Tối</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                    
                                    <DropdownMenuSeparator />
                                    
                                    <DropdownMenuItem 
                                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50" 
                                        onClick={logout}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Đăng xuất</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* DIALOG (POPUP) ĐỔI MẬT KHẨU NẰM ĐỘC LẬP TẠI ĐÂY */}
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