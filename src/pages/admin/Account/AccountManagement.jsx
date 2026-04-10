import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Search, 
    Filter, 
    Eye,
    Lock,
    Unlock,
    Mail,
    GraduationCap,
    Briefcase,
    ChevronLeft,
    ChevronRight,
    User as UserIcon,
    Shield
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AccountManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    
    // State phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Mock Data đã được cập nhật bao gồm Học viên & Giáo viên
    const [users, setUsers] = useState([
        { id: "HV001", name: "Nguyễn Văn An", email: "nguyenvana@gmail.com", role: "Học viên", unit: "Lớp 12A1", status: "Hoạt động", activity: "15 lượt thi", joinedAt: "01/09/2025" },
        { id: "GV001", name: "Phạm Trần Toán", email: "toan.pt@edu.vn", role: "Giáo viên", unit: "Tổ Toán học", status: "Hoạt động", activity: "12 bài giảng", joinedAt: "10/08/2024" },
        { id: "HV002", name: "Trần Thị Bình", email: "tranthibinh.99@gmail.com", role: "Học viên", unit: "Lớp 12A2", status: "Hoạt động", activity: "8 lượt thi", joinedAt: "05/09/2025" },
        { id: "GV002", name: "Lê Thị Ngữ Văn", email: "van.ltn@edu.vn", role: "Giáo viên", unit: "Tổ Ngữ Văn", status: "Hoạt động", activity: "5 bài giảng", joinedAt: "12/08/2024" },
        { id: "HV003", name: "Lê Văn Cường", email: "cuongle.dev@gmail.com", role: "Học viên", unit: "Lớp 11B1", status: "Bị khóa", activity: "2 lượt thi", joinedAt: "10/09/2025" },
        { id: "HV004", name: "Phạm Minh Đức", email: "ducpham2008@gmail.com", role: "Học viên", unit: "Lớp 10C1", status: "Hoạt động", activity: "12 lượt thi", joinedAt: "02/09/2025" },
        { id: "GV003", name: "Hoàng Thanh Tùng", email: "tung.ht@edu.vn", role: "Giáo viên", unit: "Tổ Vật Lý", status: "Bị khóa", activity: "0 bài giảng", joinedAt: "12/03/2026" },
        { id: "HV006", name: "Vũ Thị Yến", email: "yenvu.k12@gmail.com", role: "Học viên", unit: "Lớp 12A3", status: "Hoạt động", activity: "25 lượt thi", joinedAt: "15/08/2025" },
    ]);

    // --- XỬ LÝ CHỨC NĂNG ---

    // Chức năng Khóa / Mở khóa tài khoản
    const handleToggleLock = (user) => {
        const isCurrentlyLocked = user.status === "Bị khóa";
        const actionText = isCurrentlyLocked ? "MỞ KHÓA" : "KHÓA";
        
        if (window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản của ${user.role.toLowerCase()} ${user.name}?`)) {
            const updatedUsers = users.map(u => {
                if (u.id === user.id) {
                    return { ...u, status: isCurrentlyLocked ? "Hoạt động" : "Bị khóa" };
                }
                return u;
            });
            setUsers(updatedUsers);
        }
    };

    // Lọc dữ liệu
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = 
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || user.status === statusFilter;
            const matchesRole = roleFilter === "all" || user.role === roleFilter;
            
            return matchesSearch && matchesStatus && matchesRole;
        });
    }, [searchTerm, statusFilter, roleFilter, users]);

    // Tính toán dữ liệu cho phân trang
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case "Hoạt động": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200";
            case "Bị khóa": return "bg-red-100 text-red-700 hover:bg-red-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case "Giáo viên": return "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200";
            case "Học viên": return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quản lý Tài khoản</h2>
                    <p className="text-gray-500 text-sm mt-1">Quản lý danh sách học viên và giáo viên, tra cứu và phân quyền truy cập.</p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Input */}
                        <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                            <Search className="h-5 w-5 text-gray-400 mr-2" />
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm theo mã, tên hoặc email..." 
                                className="bg-transparent border-none outline-none text-sm w-full"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); 
                                }}
                            />
                        </div>
                        
                        {/* Dropdown Filters */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            {/* Filter Role */}
                            <Select 
                                value={roleFilter} 
                                onValueChange={(value) => {
                                    setRoleFilter(value);
                                    setCurrentPage(1); 
                                }}
                            >
                                <SelectTrigger className="w-full sm:w-[160px] bg-white border-gray-200 focus:ring-blue-500">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-gray-500" />
                                        <SelectValue placeholder="Vai trò" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả vai trò</SelectItem>
                                    <SelectItem value="Giáo viên">Giáo viên</SelectItem>
                                    <SelectItem value="Học viên">Học viên</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Filter Status */}
                            <Select 
                                value={statusFilter} 
                                onValueChange={(value) => {
                                    setStatusFilter(value);
                                    setCurrentPage(1); 
                                }}
                            >
                                <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-200 focus:ring-blue-500">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-gray-500" />
                                        <SelectValue placeholder="Tất cả trạng thái" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="Hoạt động">
                                        <div className="flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2" /> Hoạt động
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Bị khóa">
                                        <div className="flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-red-500 mr-2" /> Bị khóa
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Data Table */}
            <Card className="border-none shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4">Mã ND</th>
                                <th className="px-6 py-4">Tài khoản</th>
                                <th className="px-6 py-4">Vai trò</th>
                                <th className="px-6 py-4">Đơn vị / Lớp</th>
                                <th className="px-6 py-4 text-center">Hoạt động</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-900">{user.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 flex items-center">
                                                <UserIcon className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                                {user.name}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                                <Mail className="h-3 w-3 mr-1 text-gray-400" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={getRoleBadge(user.role)}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-gray-600">
                                                {user.role === "Giáo viên" ? (
                                                    <Briefcase className="h-4 w-4 mr-1.5 text-purple-500" />
                                                ) : (
                                                    <GraduationCap className="h-4 w-4 mr-1.5 text-blue-500" />
                                                )}
                                                {user.unit}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">Tham gia: {user.joinedAt}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">{user.activity}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="secondary" className={getStatusBadge(user.status)}>
                                                {user.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button 
                                                    onClick={() => navigate(`/admin/accounts/${user.id}`)}
                                                    variant="ghost" size="icon" 
                                                    className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                
                                                <Button 
                                                    onClick={() => handleToggleLock(user)}
                                                    variant="ghost" size="icon" 
                                                    className={cn("h-8 w-8", 
                                                        user.status === "Bị khóa" 
                                                            ? "text-emerald-600 hover:bg-emerald-50" 
                                                            : "text-red-600 hover:bg-red-50"
                                                    )}
                                                    title={user.status === "Bị khóa" ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                                                >
                                                    {user.status === "Bị khóa" ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                                        Không tìm thấy tài khoản nào phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {totalPages > 0 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                        <span className="text-sm text-gray-500">
                            Trang {currentPage} trên {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="h-8 px-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="h-8 px-2"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AccountManagement;