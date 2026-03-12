import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard, FileText, Database, Users, BarChart3, Settings,
    LogOut, Menu, Search, Bell, MessageCircleQuestion // Thêm icon MessageCircleQuestion
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation(); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // ĐÃ SỬA LẠI ĐƯỜNG DẪN VÀ ICON CHO CHUẨN
    const sidebarItems = [
        { icon: LayoutDashboard, label: "Tổng quan", path: "/admin" },
        { icon: FileText, label: "Quản lý Đề thi", path: "/admin/exams" },
        { icon: Database, label: "Ngân hàng Câu hỏi", path: "/admin/questions" },
        { icon: Users, label: "Học viên", path: "/admin/users" }, 
        { icon: MessageCircleQuestion, label: "Hỏi đáp", path: "/admin/qna" }, 
        { icon: BarChart3, label: "Báo cáo", path: "/admin/reports" },
        { icon: Settings, label: "Cài đặt", path: "/admin/settings" },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar Admin */}
            <aside className={cn(
                "bg-[#0f172a] text-slate-300 transition-all duration-300 flex flex-col fixed md:relative z-50 h-full",
                isSidebarOpen ? "w-64" : "w-0 md:w-20"
            )}>
                <div className="h-16 flex items-center justify-center border-b border-slate-800 px-4">
                    {isSidebarOpen ? (
                        <h1 className="text-white font-bold text-xl tracking-wider flex items-center gap-2">
                            <Database className="h-6 w-6 text-blue-500" /> EDU ADMIN
                        </h1>
                    ) : (
                        <Database className="h-6 w-6 text-blue-500 hidden md:block" />
                    )}
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <nav className="space-y-1 px-2">
                        {sidebarItems.map((item, index) => {
                            // Cải thiện logic active: kiểm tra nếu pathname bắt đầu bằng path của item (để các trang con cũng sáng menu)
                            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                            
                            return (
                                <button
                                    key={index}
                                    onClick={() => navigate(item.path)}
                                    className={cn(
                                        "flex items-center w-full px-3 py-2.5 rounded-lg transition-colors group",
                                        isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 hover:text-white",
                                        !isSidebarOpen && "md:justify-center"
                                    )}
                                >
                                    <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                                    <span className={cn("ml-3 text-sm font-medium", !isSidebarOpen && "md:hidden")}>{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header Admin */}
                <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-8 shadow-sm z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <Menu className="h-5 w-5 text-gray-600" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Các icon tiện ích (bạn đã import nhưng chưa dùng, mình thêm vào cho đẹp) */}
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600 relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                        </Button>

                        <div className="h-6 w-px bg-gray-200 mx-2"></div>

                        {/* Link tới trang Profile */}
                        <div 
                            onClick={() => navigate('/admin/profile')}
                            className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                            title="Hồ sơ cá nhân"
                        >
                            AD
                        </div>
                    </div>
                </header>

                {/* Khu vực chứa nội dung thay đổi */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 lg:p-8">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;