import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    LayoutDashboard, FileText, Database, Users, BarChart3, Settings,
    LogOut, Menu, Search, Bell, MessageCircleQuestion
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const AdminLayout = () => {
    const navigate = useNavigate();
    const { role, logout } = useAuth();
    const location = useLocation(); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const sidebarItems = [
        // Admin + Teacher
        { icon: LayoutDashboard, label: "Tổng quan", path: "/admin", roles: ["admin", "teacher"] },
        { icon: FileText, label: "Quản lý Đề thi", path: "/admin/exams", roles: ["admin", "teacher"] },
        { icon: Database, label: "Ngân hàng Câu hỏi", path: "/admin/questions", roles: ["admin", "teacher"] },
        { icon: MessageCircleQuestion, label: "Hỏi đáp", path: "/admin/qna", roles: ["admin", "teacher"] },

        // Admin
        { icon: Users, label: "Học viên", path: "/admin/users", roles: ["admin"] }, 
        { icon: BarChart3, label: "Báo cáo", path: "/admin/reports", roles: ["admin"] },
        { icon: Settings, label: "Cài đặt", path: "/admin/settings", roles: ["admin"] },
    ];

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar Admin */}
            <aside className={cn(
                "bg-[#0f172a] text-slate-300 transition-all duration-300 flex flex-col fixed md:relative z-50 h-full",
                isSidebarOpen ? "w-64" : "w-0 md:w-20"
            )}>
                <div className="h-16 flex items-center justify-center border-b border-slate-800 px-4 shrink-0">
                    {isSidebarOpen ? (
                        <h1 className="text-white font-bold text-xl tracking-wider flex items-center gap-2">
                            <Database className="h-6 w-6 text-blue-500" /> EDU {role === "admin" ? "ADMIN" : "Giáo Viên"}
                        </h1>
                    ) : (
                        <Database className="h-6 w-6 text-blue-500 hidden md:block" />
                    )}
                </div>

                {/* Main Nav Items */}
                <div className="flex-1 overflow-y-auto py-4 flex flex-col">
                    <nav className="space-y-1 px-2 flex-1">
                        {sidebarItems
                            .filter(item => item.roles.includes(role))
                            .map((item, index) => {
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
                                        title={!isSidebarOpen ? item.label : undefined}
                                    >
                                        <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                                        <span className={cn("ml-3 text-sm font-medium", !isSidebarOpen && "md:hidden")}>{item.label}</span>
                                    </button>
                                );
                        })}
                    </nav>

                    {/* Nút Đăng xuất ghim ở đáy */}
                    <div className="px-2 pb-4 mt-auto">
                        <button
                            onClick={() => {
                                logout();
                                navigate("/login");
                            }}
                            className={cn(
                                "flex items-center w-full px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-colors group",
                                !isSidebarOpen && "md:justify-center"
                            )}
                            title={!isSidebarOpen ? "Đăng xuất" : undefined}
                        >
                            <LogOut className="h-5 w-5 shrink-0" />
                            <span className={cn("ml-3 text-sm font-medium", !isSidebarOpen && "md:hidden")}>
                                Đăng xuất
                            </span>
                        </button>
                    </div>
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
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600 relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
                        </Button>

                        <div className="h-6 w-px bg-gray-200 mx-2"></div>

                        <div 
                            onClick={() => navigate('/admin/profile')}
                            className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                            title="Hồ sơ cá nhân"
                        >
                            {role === "admin" ? "AD" : "GV"}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 lg:p-8">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;