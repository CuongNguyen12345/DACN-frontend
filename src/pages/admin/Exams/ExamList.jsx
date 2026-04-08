import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Search, 
    Plus, 
    Filter, 
    Edit, 
    Trash2, 
    Eye,
    BookOpen,
    Clock,
    ChevronLeft,
    ChevronRight
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
import { useAuth } from "@/context/AuthContext";

const ExamList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    
    // Thêm state cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const { basePath } = useAuth();

    // Mock Data ban đầu
    const [exams, setExams] = useState([
        { id: "EX01", title: "Đề thi thử THPT QG Môn Toán 2025 - Lần 1", subject: "Toán", questions: 50, duration: 90, status: "Đang mở", attempts: 1245, createdAt: "10/03/2026" },
        { id: "EX02", title: "Kiểm tra 15 phút Vật Lý Chương 1", subject: "Vật Lý", questions: 15, duration: 15, status: "Đang mở", attempts: 342, createdAt: "11/03/2026" },
        { id: "EX03", title: "Đề thi thử THPT QG Môn Tiếng Anh - Đề chuẩn", subject: "Tiếng Anh", questions: 50, duration: 60, status: "Bản nháp", attempts: 0, createdAt: "12/03/2026" },
        { id: "EX04", title: "Kiểm tra 1 tiết Hóa Học Hữu Cơ", subject: "Hóa Học", questions: 40, duration: 45, status: "Đã đóng", attempts: 890, createdAt: "05/03/2026" },
        { id: "EX05", title: "Đề rèn luyện Toán 12 - Hàm số", subject: "Toán", questions: 30, duration: 45, status: "Đang mở", attempts: 560, createdAt: "08/03/2026" },
        { id: "EX06", title: "Khảo sát năng lực Tiếng Anh đầu vào", subject: "Tiếng Anh", questions: 40, duration: 60, status: "Bản nháp", attempts: 12, createdAt: "13/03/2026" },
    ]);

    // --- XỬ LÝ CHỨC NĂNG ---

    const handleDelete = (id) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa đề thi ${id} không? Thao tác này không thể hoàn tác.`)) {
            const updatedExams = exams.filter(exam => exam.id !== id);
            setExams(updatedExams);
            console.log(`Đã xóa đề thi: ${id}`);
        }
    };

    const handleView = (id) => {
        navigate(`/${basePath}/exams/view/${id}`); 
    };

    // Lọc dữ liệu (dùng useMemo để tối ưu hiệu suất giống QuestionList)
    const filteredExams = useMemo(() => {
        return exams.filter(exam => {
            const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) || exam.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || exam.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter, exams]);

    // Tính toán dữ liệu cho phân trang
    const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
    const paginatedExams = filteredExams.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case "Đang mở": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200";
            case "Bản nháp": return "bg-slate-100 text-slate-700 hover:bg-slate-200";
            case "Đã đóng": return "bg-red-100 text-red-700 hover:bg-red-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quản lý Đề thi</h2>
                    <p className="text-gray-500 text-sm mt-1">Quản lý danh sách đề thi, tạo mới và chỉnh sửa nội dung.</p>
                </div>
                <Button 
                    onClick={() => navigate(`/${basePath}/exams/create`)} 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <Plus className="h-4 w-4 mr-2" /> Tạo đề thi mới
                </Button>
            </div>

            {/* Filter & Search Bar */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                            <Search className="h-5 w-5 text-gray-400 mr-2" />
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm theo mã hoặc tên đề thi..." 
                                className="bg-transparent border-none outline-none text-sm w-full"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                                }}
                            />
                        </div>
                        <div className="w-full md:w-[200px]">
                            <Select 
                                value={statusFilter} 
                                onValueChange={(value) => {
                                    setStatusFilter(value);
                                    setCurrentPage(1); // Reset về trang 1 khi lọc
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
                                    <SelectItem value="Đang mở">
                                        <div className="flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2" /> Đang mở
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Bản nháp">
                                        <div className="flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-slate-400 mr-2" /> Bản nháp
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="Đã đóng">
                                        <div className="flex items-center">
                                            <span className="h-2 w-2 rounded-full bg-red-500 mr-2" /> Đã đóng
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
                                <th className="px-6 py-4">Mã Đề</th>
                                <th className="px-6 py-4">Tên Đề Thi</th>
                                <th className="px-6 py-4">Cấu trúc</th>
                                <th className="px-6 py-4 text-center">Lượt thi</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedExams.length > 0 ? (
                                paginatedExams.map((exam) => (
                                    <tr key={exam.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-gray-900">{exam.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 line-clamp-1">{exam.title}</div>
                                            <div className="text-xs text-gray-500">Ngày tạo: {exam.createdAt}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="flex items-center text-xs"><BookOpen className="h-3 w-3 mr-1 text-blue-500" />{exam.subject}</span>
                                                <span className="flex items-center text-xs"><Clock className="h-3 w-3 mr-1 text-orange-500" />{exam.duration}p</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium">{exam.attempts}</td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="secondary" className={getStatusBadge(exam.status)}>{exam.status}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button 
                                                    onClick={() => handleView(exam.id)}
                                                    variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    onClick={() => navigate(`/${basePath}/exams/edit/${exam.id}`)}
                                                    variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    onClick={() => handleDelete(exam.id)}
                                                    variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                        Không tìm thấy đề thi nào phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phần Phân trang (Pagination) */}
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

export default ExamList;