import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search, Filter, Eye, Lock, Unlock, Mail,
    GraduationCap, Briefcase, ChevronLeft, ChevronRight,
    User as UserIcon, Shield, Plus, BookOpen, Loader2,
} from "lucide-react";

import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useDebounce(value, delay = 400) {
    const [deb, setDeb] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDeb(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return deb;
}

const ROLE_MAP = {
    TEACHER: "Giáo viên",
    STUDENT: "Học viên",
    teacher: "Giáo viên",
    student: "Học viên",
};

const displayRole = (role) => ROLE_MAP[role] || role;

const getRoleBadge = (role) => {
    const r = role?.toUpperCase();
    if (r === "TEACHER") return "bg-violet-100 text-violet-700 border-violet-200";
    if (r === "STUDENT") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-gray-100 text-gray-700";
};

const getStatusBadge = (locked) =>
    locked
        ? "bg-red-100 text-red-700 hover:bg-red-200"
        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200";

// ─── Component ────────────────────────────────────────────────────────────────

const AccountManagement = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const debouncedSearch = useDebounce(searchTerm, 400);

    // ── Fetch ──
    const fetchAccounts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {};
            if (debouncedSearch) params.keyword = debouncedSearch;
            if (roleFilter !== "all") params.role = roleFilter;
            const res = await api.get("/api/admin/accounts", { params });
            setUsers(res.data || []);
            setCurrentPage(1);
        } catch (err) {
            console.error("Lấy danh sách tài khoản thất bại:", err);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, roleFilter]);

    useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

    // ── Pagination ──
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const paginatedUsers = users.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quản lý Tài khoản</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Quản lý danh sách học viên và giáo viên, tra cứu và phân quyền truy cập.
                    </p>
                </div>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-2"
                    onClick={() => navigate("/admin/accounts/create-teacher")}
                >
                    <Plus className="h-4 w-4" />
                    Tạo tài khoản giáo viên
                </Button>
            </div>

            {/* Filter & Search */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search */}
                        <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                            <Search className="h-4 w-4 text-gray-400 mr-2 shrink-0" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên hoặc email..."
                                className="bg-transparent border-none outline-none text-sm w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {isLoading && (
                                <Loader2 className="h-4 w-4 text-blue-500 animate-spin ml-2 shrink-0" />
                            )}
                        </div>

                        {/* Role filter */}
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-full sm:w-[175px] bg-white border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-gray-500" />
                                    <SelectValue placeholder="Vai trò" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả vai trò</SelectItem>
                                <SelectItem value="TEACHER">Giáo viên</SelectItem>
                                <SelectItem value="STUDENT">Học viên</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Result count */}
                    {!isLoading && (
                        <p className="text-xs text-gray-400 mt-3">
                            Tìm thấy <strong className="text-gray-600">{users.length}</strong> tài khoản
                            {searchTerm && <> cho "<em>{searchTerm}</em>"</>}
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-none shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4">Tài khoản</th>
                                <th className="px-6 py-4">Vai trò</th>
                                <th className="px-6 py-4">Đơn vị / Khối học</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        Không tìm thấy tài khoản nào phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user) => {
                                    const isTeacher = user.role?.toUpperCase() === "TEACHER";
                                    const isLocked  = user.locked;
                                    return (
                                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                                            {/* Tài khoản */}
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 flex items-center gap-1.5">
                                                    <UserIcon className="h-3.5 w-3.5 text-gray-400" />
                                                    {user.userName}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                    <Mail className="h-3 w-3 text-gray-400" />
                                                    {user.email}
                                                </div>
                                                {user.createdDate && (
                                                    <div className="text-xs text-gray-400 mt-0.5">
                                                        Tham gia: {new Date(user.createdDate).toLocaleDateString("vi-VN")}
                                                    </div>
                                                )}
                                            </td>

                                            {/* Vai trò */}
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={getRoleBadge(user.role)}>
                                                    {displayRole(user.role)}
                                                </Badge>
                                            </td>

                                            {/* Đơn vị / Khối học */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-gray-700">
                                                    {isTeacher
                                                        ? <Briefcase className="h-4 w-4 text-violet-500 shrink-0" />
                                                        : <GraduationCap className="h-4 w-4 text-blue-500 shrink-0" />
                                                    }
                                                    <span className="font-medium">{user.unit}</span>
                                                </div>
                                                {isTeacher && (
                                                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1 ml-5">
                                                        <BookOpen className="h-3 w-3" />
                                                        Giáo viên phụ trách
                                                    </div>
                                                )}
                                            </td>

                                            {/* Trạng thái — dùng locked field nếu có, fallback Hoạt động */}
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant="secondary" className={getStatusBadge(isLocked)}>
                                                    {isLocked ? "Bị khóa" : "Hoạt động"}
                                                </Badge>
                                            </td>

                                            {/* Thao tác */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        onClick={() => navigate(`/admin/accounts/${user.id}`)}
                                                        variant="ghost" size="icon"
                                                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost" size="icon"
                                                        className={cn("h-8 w-8",
                                                            isLocked
                                                                ? "text-emerald-600 hover:bg-emerald-50"
                                                                : "text-red-600 hover:bg-red-50"
                                                        )}
                                                        title={isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                                                    >
                                                        {isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
                        <span className="text-sm text-gray-500">
                            Trang {currentPage} trên {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm"
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1} className="h-8 px-2">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm"
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages} className="h-8 px-2">
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