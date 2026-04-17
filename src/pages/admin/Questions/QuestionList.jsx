import { useState, useMemo, useEffect, useCallback } from "react";
import {
    MoreHorizontal, Download, Upload, CheckSquare, Square, Database, Plus, Search, Tag, Edit, Save,
    ChevronLeft, ChevronRight, Eye, Trash2, HelpCircle, PlusCircle, Info, FileSpreadsheet, FileText, ChevronDown, Sparkles
} from "lucide-react";
import * as XLSX from "xlsx";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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

    // Theo Mock Data nhưng giờ chúng ta lấy từ BE
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Batch Add States
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isInstructionOpen, setIsInstructionOpen] = useState(false);
    const [importSettings, setImportSettings] = useState({
        subject: "Toán",
        grade: "Lớp 10",
    });
    const [batchQuestions, setBatchQuestions] = useState([
        { id: Date.now(), content: "", a: "", b: "", c: "", d: "", correct: "A", explanation: "" }
    ]);

    const handleAddBatchRow = () => {
        setBatchQuestions(prev => [
            ...prev,
            { id: Date.now(), content: "", a: "", b: "", c: "", d: "", correct: "A", explanation: "" }
        ]);
    };

    const handleRemoveBatchRow = (id) => {
        if (batchQuestions.length > 1) {
            setBatchQuestions(prev => prev.filter(q => q.id !== id));
        }
    };

    const handleUpdateBatchRow = (id, field, value) => {
        setBatchQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
    };

    const handleSaveBatch = async () => {
        const validQuestions = batchQuestions.filter(q => q.content.trim() !== "");
        if (validQuestions.length === 0) {
            alert("Vui lòng nhập ít nhất một câu hỏi có nội dung!");
            return;
        }

        try {
            const payload = {
                subject: importSettings.subject,
                grade: importSettings.grade,
                questions: validQuestions.map(q => ({
                    content: q.content,
                    options: [
                        { content: q.a, isCorrect: q.correct === "A" },
                        { content: q.b, isCorrect: q.correct === "B" },
                        { content: q.c, isCorrect: q.correct === "C" },
                        { content: q.d, isCorrect: q.correct === "D" },
                    ],
                    explanation: q.explanation,
                    level: "Trung Bình"
                }))
            };

            await api.post("/api/admin/questions", payload);
            alert(`Đã thêm thành công ${validQuestions.length} câu hỏi vào ngân hàng!`);
            setIsImportModalOpen(false);
            fetchQuestions(); // Refresh list
        }
        catch (error) {
            console.error("Lưu batch thất bại:", error);
            alert("Đã xảy ra lỗi khi lưu danh sách câu hỏi.");
        }
    };

    const handleImportFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

            // Skip header row and map data
            const importedQuestions = data.slice(1).map((row, index) => {
                if (!row[0]) return null; // Skip empty rows
                return {
                    id: Date.now() + index,
                    content: row[0] || "",
                    a: row[1] || "",
                    b: row[2] || "",
                    c: row[3] || "",
                    d: row[4] || "",
                    correct: (row[5] || "A").toString().toUpperCase().trim(),
                    explanation: row[6] || ""
                };
            }).filter(q => q !== null);

            if (importedQuestions.length > 0) {
                setBatchQuestions(prev => {
                    // If first row is empty, replace it, otherwise append
                    const firstRowEmpty = prev.length === 1 && !prev[0].content;
                    return firstRowEmpty ? importedQuestions : [...prev, ...importedQuestions];
                });
                alert(`Đã nhập thành công ${importedQuestions.length} câu hỏi!`);
            }
        };
        reader.readAsBinaryString(file);
        // Reset input
        e.target.value = null;
    };

    // 4. Custom Hook để Debounce search term
    function useDebounce(value, delay) {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            return () => clearTimeout(handler);
        }, [value, delay]);
        return debouncedValue;
    }

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // --- LOGIC XỬ LÝ DỮ LIỆU ---
    const fetchQuestions = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {};
            if (debouncedSearchTerm) params.keyword = debouncedSearchTerm;
            if (subjectFilter !== "all") params.subject = subjectFilter;
            if (levelFilter !== "all") params.level = levelFilter;
            if (statusFilter !== "all") params.grade = statusFilter;

            const res = await api.get("/api/admin/questions", { params });

            const formatted = res.data.map(q => ({
                ...q,
                createdAt: q.createdAt ? String(q.createdAt).substring(0, 10) : "N/A"
            }));

            // Xếp mới nhất lên đầu (hoặc BE có thể làm điều này với Sort)
            setQuestions(formatted.reverse());
            setCurrentPage(1); // Reset về trang 1 khi lọc
        } catch (error) {
            console.error("Lỗi lấy danh sách câu hỏi:", error);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearchTerm, subjectFilter, levelFilter, statusFilter]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    // Không cần dùng useMemo lọc ở client nữa, server đã lọc rồi
    const filteredQuestions = questions;

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

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa câu hỏi này?")) {
            try {
                // frontend id is like "Q-10"
                const actualId = id.toString().replace("Q-", "");
                await api.delete(`/api/admin/questions/${actualId}`);

                // Update internal state
                setQuestions(prev => prev.filter(q => q.id !== id));
                setSelectedIds(prev => prev.filter(i => i !== id));
            } catch (error) {
                console.error("Lỗi xóa câu hỏi:", error);
                alert("Xóa không thành công!");
            }
        }
    };

    const getLevelColor = (level) => {
        switch (level) {
            case "Dễ": return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50";
            case "Trung bình": return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50";
            case "Khó": return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50";
            default: return "bg-slate-50 text-slate-700 hover:bg-slate-50";
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
                            placeholder="Tìm kiếm nội dung câu hỏi..."
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
                                <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
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

                        {/* THÊM LỌC LỚP */}
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Lớp" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả lớp</SelectItem>
                                <SelectItem value="Lớp 10">Lớp 10</SelectItem>
                                <SelectItem value="Lớp 11">Lớp 11</SelectItem>
                                <SelectItem value="Lớp 12">Lớp 12</SelectItem>
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
                                <th className="px-6 py-4 text-center">Môn học</th>
                                <th className="px-6 py-4 text-center">Lớp</th>
                                <th className="px-6 py-4 text-center">Độ khó</th>
                                <th className="px-6 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-slate-500">Đang tải dữ liệu...</td>
                                </tr>
                            ) : paginatedQuestions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-6 text-slate-500">Không tìm thấy dữ liệu.</td>
                                </tr>
                            ) : paginatedQuestions.map((q) => (
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
                                        <span className="text-[11px] text-slate-500 mt-1 block">Ngày tạo: {q.createdAt}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
                                            <Tag className="h-3.5 w-3.5 text-slate-400" /> {q.subject}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-slate-700 font-medium">{q.status}</span>
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