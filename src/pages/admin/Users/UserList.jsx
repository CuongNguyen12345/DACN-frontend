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
    ChevronLeft,
    ChevronRight,
    User
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

const StudentList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    
    // State phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Mock Data Học viên (Đã đổi HV005 thành Hoạt động)
    const [students, setStudents] = useState([
        { id: "HV001", name: "Nguyễn Văn An", email: "nguyenvana@gmail.com", classGroup: "Lớp 12A1", status: "Hoạt động", examsTaken: 15, joinedAt: "01/09/2025" },
        { id: "HV002", name: "Trần Thị Bình", email: "tranthibinh.99@gmail.com", classGroup: "Lớp 12A2", status: "Hoạt động", examsTaken: 8, joinedAt: "05/09/2025" },
        { id: "HV003", name: "Lê Văn Cường", email: "cuongle.dev@gmail.com", classGroup: "Lớp 11B1", status: "Bị khóa", examsTaken: 2, joinedAt: "10/09/2025" },
        { id: "HV004", name: "Phạm Minh Đức", email: "ducpham2008@gmail.com", classGroup: "Lớp 10C1", status: "Hoạt động", examsTaken: 12, joinedAt: "02/09/2025" },
        { id: "HV005", name: "Hoàng Thanh Tùng", email: "thanhtung.hoang@gmail.com", classGroup: "Lớp 12A1", status: "Hoạt động", examsTaken: 0, joinedAt: "12/03/2026" },
        { id: "HV006", name: "Vũ Thị Yến", email: "yenvu.k12@gmail.com", classGroup: "Lớp 12A3", status: "Hoạt động", examsTaken: 25, joinedAt: "15/08/2025" },
    ]);

    // --- XỬ LÝ CHỨC NĂNG ---

    // Chức năng Xem chi tiết
    const handleView = (id) => {
        navigate(`/admin/students/view/${id}`); 
    };

    // Chức năng Khóa / Mở khóa tài khoản
    const handleToggleLock = (student) => {
        const isCurrentlyLocked = student.status === "Bị khóa";
        const actionText = isCurrentlyLocked ? "MỞ KHÓA" : "KHÓA";
        
        if (window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản của học viên ${student.name}?`)) {
            const updatedStudents = students.map(s => {
                if (s.id === student.id) {
                    return { ...s, status: isCurrentlyLocked ? "Hoạt động" : "Bị khóa" };
                }
                return s;
            });
            setStudents(updatedStudents);
        }
    };

    // Lọc dữ liệu
    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch = 
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || student.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter, students]);

    // Tính toán dữ liệu cho phân trang
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginatedStudents = filteredStudents.slice(
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

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quản lý Học viên</h2>
                    <p className="text-gray-500 text-sm mt-1">Quản lý danh sách tài khoản học viên, tra cứu và khóa/mở khóa tài khoản.</p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                            <Search className="h-5 w-5 text-gray-400 mr-2" />
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm theo mã, tên hoặc email học viên..." 
                                className="bg-transparent border-none outline-none text-sm w-full"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); 
                                }}
                            />
                        </div>
                        <div className="w-full md:w-[200px]">
                            <Select 
                                value={statusFilter} 
                                onValueChange={(value) => {
                                    setStatusFilter(value);
                                    setCurrentPage(1); 
                                }}
                            >
                                <SelectTrigger className="w-full bg-white border-gray-200 focus:ring-blue-500">
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
                                <th className="px-6 py-4">Mã HV</th>
                                <th className="px-6 py-4">Học viên</th>
                                <th className="px-6 py-4">Lớp/Khối</th>
                                <th className="px-6 py-4 text-center">Lượt thi</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedStudents.length > 0 ? (
                                paginatedStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-900">{student.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 flex items-center">
                                                <User className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                                {student.name}
                                            </div>
                                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                                <Mail className="h-3 w-3 mr-1 text-gray-400" />
                                                {student.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-gray-600">
                                                <GraduationCap className="h-4 w-4 mr-1.5 text-blue-500" />
                                                {student.classGroup}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">Tham gia: {student.joinedAt}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium">{student.examsTaken}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="secondary" className={getStatusBadge(student.status)}>
                                                {student.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button 
                                                    onClick={() => handleView(student.id)}
                                                    variant="ghost" size="icon" 
                                                    className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                
                                                {/* Nút Khóa / Mở khóa thay đổi theo trạng thái hiện tại */}
                                                <Button 
                                                    onClick={() => handleToggleLock(student)}
                                                    variant="ghost" size="icon" 
                                                    className={cn("h-8 w-8", 
                                                        student.status === "Bị khóa" 
                                                            ? "text-emerald-600 hover:bg-emerald-50" 
                                                            : "text-red-600 hover:bg-red-50"
                                                    )}
                                                    title={student.status === "Bị khóa" ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                                                >
                                                    {student.status === "Bị khóa" ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                        Không tìm thấy học viên nào phù hợp.
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

export default StudentList;