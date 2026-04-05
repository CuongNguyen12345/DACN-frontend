import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Plus,
    Filter,
    Edit,
    Trash2,
    Video,
    FileText,
    CheckCircle2,
    Clock,
    BookOpen,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

// Import Select từ shadcn
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const LessonManagement = () => {
    const navigate = useNavigate();
    const { basePath } = useAuth();
    
    // States cho Tìm kiếm và Lọc
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSubject, setFilterSubject] = useState("all");
    
    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // State Dữ liệu Bài học
    const [lessons, setLessons] = useState([
        { id: "L01", title: "Khái niệm đạo hàm", subject: "Toán 12", type: "Video", duration: "15:30", status: "Đã xuất bản" },
        { id: "L02", title: "Cực trị của hàm số", subject: "Toán 12", type: "Lý thuyết", duration: "10 phút đọc", status: "Bản nháp" },
        { id: "L03", title: "Dao động điều hòa", subject: "Vật lý 12", type: "Video", duration: "20:00", status: "Đã xuất bản" },
        { id: "L04", title: "Cấu trúc DNA", subject: "Sinh học 12", type: "Bài tập", duration: "20 câu hỏi", status: "Đã xuất bản" },
        { id: "L05", title: "Phản ứng Oxi hóa khử", subject: "Hóa học 12", type: "Video", duration: "18:45", status: "Đang ẩn" },
        { id: "L06", title: "Tích phân cơ bản", subject: "Toán 12", type: "Video", duration: "25:00", status: "Đã xuất bản" },
        { id: "L07", title: "Sóng cơ học", subject: "Vật lý 12", type: "Lý thuyết", duration: "15 phút đọc", status: "Bản nháp" },
        { id: "L08", title: "Quy luật di truyền Menden", subject: "Sinh học 12", type: "Bài tập", duration: "30 câu hỏi", status: "Đã xuất bản" },
        { id: "L09", title: "Kim loại kiềm", subject: "Hóa học 12", type: "Lý thuyết", duration: "12 phút đọc", status: "Đã xuất bản" },
        { id: "L10", title: "Hình học không gian", subject: "Toán 11", type: "Video", duration: "40:00", status: "Đang ẩn" },
        { id: "L11", title: "Giao thoa ánh sáng", subject: "Vật lý 12", type: "Video", duration: "22:15", status: "Đã xuất bản" },
        { id: "L12", title: "Đột biến gen", subject: "Sinh học 12", type: "Lý thuyết", duration: "20 phút đọc", status: "Bản nháp" },
    ]);

    // Tạo danh sách môn học duy nhất cho Dropdown lọc
    const uniqueSubjects = ["all", ...new Set(lessons.map(lesson => lesson.subject))];

    // Logic Lọc & Tìm kiếm kết hợp
    const filteredLessons = lessons.filter(lesson => {
        const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              lesson.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = filterSubject === "all" || lesson.subject === filterSubject;
        
        return matchesSearch && matchesSubject;
    });

    // Reset về trang 1 mỗi khi đổi điều kiện tìm kiếm hoặc lọc
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterSubject]);

    // Phân trang
    const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLessons = filteredLessons.slice(indexOfFirstItem, indexOfLastItem);

    // XỬ LÝ CHỨC NĂNG XÓA (Giống ExamList)
    const handleDelete = (id, title) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa bài học "${title}" không? Thao tác này không thể hoàn tác.`)) {
            const updatedLessons = lessons.filter(lesson => lesson.id !== id);
            setLessons(updatedLessons);
            
            // Xử lý lùi trang nếu trang hiện tại bị trống sau khi xóa phần tử cuối cùng của trang
            const newTotalPages = Math.ceil(updatedLessons.length / itemsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }
            
            console.log(`Đã xóa bài học: ${id}`);
        }
    };

    const renderTypeIcon = (type) => {
        switch (type) {
            case "Video": return <Video className="w-4 h-4 mr-2 text-blue-500" />;
            case "Lý thuyết": return <FileText className="w-4 h-4 mr-2 text-amber-500" />;
            case "Bài tập": return <BookOpen className="w-4 h-4 mr-2 text-purple-500" />;
            default: return <FileText className="w-4 h-4 mr-2 text-gray-500" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Quản lý Bài học</h2>
                    <p className="text-gray-500 text-sm mt-1">Quản lý, thêm mới và chỉnh sửa nội dung bài giảng.</p>
                </div>
                <Button 
                    onClick={() => navigate(`/${basePath}/lessons/create`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    <Plus className="w-4 h-4 mr-2" /> Thêm bài học mới
                </Button>
            </div>

            {/* Thanh công cụ: Tìm kiếm & Lọc */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên bài học..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="w-full sm:w-48">
                        <Select value={filterSubject} onValueChange={setFilterSubject}>
                            <SelectTrigger className="w-full bg-white">
                                <div className="flex items-center">
                                    <Filter className="w-4 h-4 mr-2 text-gray-500" />
                                    <SelectValue placeholder="Lọc môn học" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả môn học</SelectItem>
                                {uniqueSubjects.filter(sub => sub !== "all").map(subject => (
                                    <SelectItem key={subject} value={subject}>
                                        {subject}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Bảng danh sách bài học */}
            <Card className="border-none shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium">Mã bài</th>
                                <th className="px-6 py-4 font-medium">Tên bài học</th>
                                <th className="px-6 py-4 font-medium">Môn học</th>
                                <th className="px-6 py-4 font-medium">Định dạng</th>
                                <th className="px-6 py-4 font-medium text-center">Trạng thái</th>
                                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentLessons.length > 0 ? (
                                currentLessons.map((lesson) => (
                                    <tr key={lesson.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 text-gray-900 font-medium">{lesson.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 line-clamp-1">{lesson.title}</div>
                                            <div className="text-xs text-gray-500">{lesson.duration}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <Badge variant="outline" className="bg-gray-50">
                                                {lesson.subject}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-gray-700 font-medium text-xs">
                                                {renderTypeIcon(lesson.type)}
                                                {lesson.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge 
                                                variant="secondary" 
                                                className={cn(
                                                    "font-normal",
                                                    lesson.status === "Đã xuất bản" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : 
                                                    lesson.status === "Bản nháp" ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : 
                                                    "bg-gray-100 text-gray-700"
                                                )}
                                            >
                                                {lesson.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    onClick={() => navigate(`/${basePath}/lessons/edit/${lesson.id}`)}
                                                    variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button 
                                                    onClick={() => handleDelete(lesson.id, lesson.title)}
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-red-600 hover:bg-red-50"
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
                                        Không tìm thấy bài học nào phù hợp.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Phân trang */}
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

export default LessonManagement;