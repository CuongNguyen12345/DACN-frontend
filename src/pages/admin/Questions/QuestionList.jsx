import { useState, useMemo } from "react";
import { 
    Search, Plus, Filter, Database, Tag, Edit, Trash2, 
    MoreHorizontal, Download, Upload, CheckSquare, Square,
    ChevronLeft, ChevronRight, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

const QuestionList = () => {
    const navigate = useNavigate();
    // 1. States cho lọc và tìm kiếm
    const [searchTerm, setSearchTerm] = useState("");
    const [levelFilter, setLevelFilter] = useState("all");
    const [subjectFilter, setSubjectFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all"); // THÊM STATE LỌC TRẠNG THÁI
    
    // 2. States cho chọn nhiều (Bulk Action)
    const [selectedIds, setSelectedIds] = useState([]);
    
    // 3. States cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Mock Data ĐÃ THÊM TRƯỜNG STATUS
    const [questions, setQuestions] = useState([
        { id: "Q-101", content: "Đạo hàm của hàm số $y = \\ln(x)$ là gì?", subject: "Toán", level: "Dễ", type: "Trắc nghiệm", status: "Đã duyệt", createdAt: "2026-03-10" },
        { id: "Q-102", content: "Ai là tác giả của tác phẩm 'Lão Hạc'?", subject: "Ngữ Văn", level: "Dễ", type: "Trắc nghiệm", status: "Đã duyệt", createdAt: "2026-03-11" },
        { id: "Q-103", content: "Hiện tượng cộng hưởng xảy ra khi nào?", subject: "Vật Lý", level: "Khó", type: "Trắc nghiệm", status: "Cần sửa lại", createdAt: "2026-03-12" },
        { id: "Q-104", content: "Cấu hình electron của Natri (Z=11)?", subject: "Hóa Học", level: "Trung bình", type: "Trắc nghiệm", status: "Đã duyệt", createdAt: "2026-03-05" },
        { id: "Q-105", content: "Giải phương trình bậc hai: $x^2 - 5x + 6 = 0$.", subject: "Toán", level: "Trung bình", type: "Tự luận", status: "Bản nháp", createdAt: "2026-03-08" },
        { id: "Q-106", content: "Tác dụng của lực ma sát nghỉ là gì?", subject: "Vật Lý", level: "Dễ", type: "Trắc nghiệm", status: "Đã duyệt", createdAt: "2026-03-09" },
    ]);

    // --- LOGIC XỬ LÝ DỮ LIỆU ---

    // Lọc dữ liệu dựa trên search và select
    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const matchesSearch = q.content.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLevel = levelFilter === "all" || q.level === levelFilter;
            const matchesSubject = subjectFilter === "all" || q.subject === subjectFilter;
            const matchesStatus = statusFilter === "all" || q.status === statusFilter; // LOGIC LỌC TRẠNG THÁI
            
            return matchesSearch && matchesLevel && matchesSubject && matchesStatus;
        });
    }, [searchTerm, levelFilter, subjectFilter, statusFilter, questions]);

    // Phân trang
    const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
    const paginatedQuestions = filteredQuestions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Xử lý chọn nhiều
    const toggleSelectAll = () => {
        if (selectedIds.length === paginatedQuestions.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedQuestions.map(q => q.id));
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
            setQuestions(prev => prev.filter(q => q.id !== id));
            setSelectedIds(prev => prev.filter(i => i !== id));
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case "Dễ": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "Trung bình": return "bg-amber-50 text-amber-700 border-amber-200";
            case "Khó": return "bg-rose-50 text-rose-700 border-rose-200";
            default: return "bg-slate-50 text-slate-700";
        }
    };

    // HÀM LẤY MÀU CHO TRẠNG THÁI
    const getStatusColor = (status) => {
        switch (status) {
            case "Đã duyệt": return "bg-blue-50 text-blue-700 border-blue-200";
            case "Bản nháp": return "bg-slate-100 text-slate-600 border-slate-200";
            case "Cần sửa lại": return "bg-orange-50 text-orange-700 border-orange-200";
            default: return "bg-slate-50 text-slate-700";
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Database className="h-6 w-6 text-blue-600" /> Ngân hàng câu hỏi
                    </h2>
                    <p className="text-slate-500 text-sm">Quản lý và tổ chức kho câu hỏi đa phương thức.</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none gap-2">
                        <Upload className="h-4 w-4" /> Import
                    </Button>
                    <Button
                        onClick={() => navigate("/admin/questions/create")}
                        className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 gap-2">
                        <Plus className="h-4 w-4" /> Thêm câu hỏi
                    </Button>
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm text-blue-700 font-medium">Đã chọn {selectedIds.length} câu hỏi</span>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-blue-700 border-blue-300 bg-white">Gán vào đề thi</Button>
                        <Button size="sm" variant="destructive" onClick={() => alert("Xóa " + selectedIds.length + " câu")}>Xóa hàng loạt</Button>
                    </div>
                </div>
            )}

            {/* Filter Card */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input 
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="Tìm kiếm nội dung câu hỏi hoặc ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap md:flex-nowrap gap-2">
                        {/* LỌC MÔN HỌC */}
                        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                            <SelectTrigger className="w-[130px]"><SelectValue placeholder="Môn học" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả môn</SelectItem>
                                <SelectItem value="Toán">Toán</SelectItem>
                                <SelectItem value="Vật Lý">Vật Lý</SelectItem>
                                <SelectItem value="Hóa Học">Hóa Học</SelectItem>
                                <SelectItem value="Ngữ Văn">Ngữ Văn</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        {/* LỌC ĐỘ KHÓ */}
                        <Select value={levelFilter} onValueChange={setLevelFilter}>
                            <SelectTrigger className="w-[130px]"><SelectValue placeholder="Độ khó" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả mức</SelectItem>
                                <SelectItem value="Dễ">Dễ</SelectItem>
                                <SelectItem value="Trung bình">Trung bình</SelectItem>
                                <SelectItem value="Khó">Khó</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* THÊM LỌC TRẠNG THÁI */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Mọi trạng thái</SelectItem>
                                <SelectItem value="Đã duyệt">Đã duyệt</SelectItem>
                                <SelectItem value="Bản nháp">Bản nháp</SelectItem>
                                <SelectItem value="Cần sửa lại">Cần sửa lại</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Questions Table */}
            <Card className="border-none shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left whitespace-nowrap md:whitespace-normal">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 font-medium">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <Checkbox 
                                        checked={selectedIds.length === paginatedQuestions.length && paginatedQuestions.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-6 py-4 min-w-[300px]">Nội dung câu hỏi</th>
                                <th className="px-6 py-4">Phân loại</th>
                                <th className="px-6 py-4 text-center">Độ khó</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedQuestions.map((q) => (
                                <tr key={q.id} className={cn("hover:bg-slate-50/50 transition-colors group", selectedIds.includes(q.id) && "bg-blue-50/30")}>
                                    <td className="px-6 py-4">
                                        <Checkbox 
                                            checked={selectedIds.includes(q.id)}
                                            onCheckedChange={() => toggleSelectOne(q.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Cho phép click vào nội dung để xem chi tiết */}
                                        <div 
                                            className="font-medium text-slate-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                                            onClick={() => navigate(`/admin/questions/view/${q.id}`)}
                                        >
                                            {q.content}
                                        </div>

                                    </td>
                                    <td className="px-6 py-4 text-slate-500">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="flex items-center gap-1.5 text-slate-700 font-medium"><Tag className="h-3.5 w-3.5" /> {q.subject}</span>
                                            <span className="text-[11px] opacity-70">Ngày tạo: {q.createdAt}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge className={cn("font-normal border shadow-none", getLevelColor(q.level))}>
                                            {q.level}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            {/* NÚT XEM CHI TIẾT MỚI THÊM */}
                                            <Button
                                                onClick={() => navigate(`/admin/questions/view/${q.id}`)} 
                                                variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-100">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                    
                                            <Button
                                                onClick={() => navigate(`/admin/questions/edit/${q.id}`)} 
                                                variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                    
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDelete(q.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white text-slate-500">
                    <p className="text-xs">Trang {currentPage} / {totalPages || 1}</p>
                    <div className="flex gap-1">
                        <Button 
                            variant="outline" size="sm" className="h-8 w-8 p-0"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="outline" size="sm" className="h-8 w-8 p-0"
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default QuestionList;