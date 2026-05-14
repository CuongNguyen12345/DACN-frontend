import { useMemo, useState, useEffect, useCallback } from "react";
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
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
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
import { useAuth } from "@/context/AuthContext";
import { useTeacherScope } from "@/hooks/useTeacherScope";
import {
  GRADE_FILTER_OPTIONS,
  SUBJECT_FILTER_OPTIONS,
  getScopedGradeFilter,
  getScopedSubjectFilter,
} from "@/pages/admin/Questions/questionListFilters";
import api from "@/services/api";

const ExamList = () => {
  const navigate = useNavigate();
  const { basePath } = useAuth();
  const scope = useTeacherScope();
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // API state
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const scopedSubjectFilter = useMemo(
    () => getScopedSubjectFilter(scope, subjectFilter),
    [scope, subjectFilter],
  );
  const scopedGradeFilter = useMemo(
    () => getScopedGradeFilter(scope, classFilter),
    [scope, classFilter],
  );
  const effectiveSubjectFilter = scopedSubjectFilter.value;
  const effectiveGradeFilter = scopedGradeFilter.value;

  // Debounce cho thanh tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Hàm gọi API
  const fetchExams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("keyword", debouncedSearch);
      if (effectiveSubjectFilter !== "all") params.append("subject", effectiveSubjectFilter);
      if (effectiveGradeFilter !== "all") params.append("grade", effectiveGradeFilter);

      const res = await api.get(`/api/admin/exams?${params.toString()}`);
      setExams(res.data);
    } catch (err) {
      console.error("Lỗi tải danh sách đề thi:", err);
      setError("Không thể tải danh sách đề thi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, effectiveSubjectFilter, effectiveGradeFilter]);

  // Gọi API mỗi khi filter (hoặc debouncedSearch) thay đổi
  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleDelete = (id) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa đề thi #${id} không?`)) {
      // TODO: gọi API DELETE /api/admin/exams/:id khi có
      setExams((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const totalPages = Math.max(1, Math.ceil(exams.length / itemsPerPage));
  const paginatedExams = exams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Đề thi</h2>
          <p className="text-gray-500 text-sm mt-1">
            Quản lý danh sách đề thi, tạo mới và chỉnh sửa nội dung.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchExams}
            variant="outline"
            className="gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Làm mới
          </Button>
          <Button
            onClick={() => navigate(`${basePath}/exams/create`)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Tạo đề thi mới
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <Search className="h-5 w-5 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên đề thi..."
                className="bg-transparent border-none outline-none text-sm w-full"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Select
                value={effectiveSubjectFilter}
                onValueChange={(value) => {
                  if (scopedSubjectFilter.disabled) return;
                  setSubjectFilter(value);
                  setCurrentPage(1);
                }}
                disabled={scopedSubjectFilter.disabled}
              >
                <SelectTrigger className="w-[150px] bg-white border-gray-200">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Tất cả môn" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {SUBJECT_FILTER_OPTIONS
                    .filter((option) => option.value !== "all" || !scope.isTeacher || !scope.allowedSubject)
                    .filter((option) => option.value === "all" || scope.canUseSubject(option.value))
                    .map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Select
                value={effectiveGradeFilter}
                onValueChange={(value) => {
                  if (scopedGradeFilter.disabled) return;
                  setClassFilter(value);
                  setCurrentPage(1);
                }}
                disabled={scopedGradeFilter.disabled}
              >
                <SelectTrigger className="w-[140px] bg-white border-gray-200">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Tất cả lớp" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {GRADE_FILTER_OPTIONS
                    .filter((option) => option.value !== "all" || !scope.isTeacher || scope.allowedGrades.length === 0)
                    .filter((option) => option.value === "all" || scope.canUseGrade(option.value))
                    .map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
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
                <th className="px-6 py-4 w-16">#</th>
                <th className="px-6 py-4">Tên Đề Thi</th>
                <th className="px-6 py-4 text-center">Phân loại</th>
                <th className="px-6 py-4 text-center">Thời gian</th>
                <th className="px-6 py-4 text-center">Số câu</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-red-500"
                  >
                    {error}
                    <br />
                    <Button
                      onClick={fetchExams}
                      variant="outline"
                      className="mt-3"
                      size="sm"
                    >
                      Thử lại
                    </Button>
                  </td>
                </tr>
              ) : paginatedExams.length > 0 ? (
                paginatedExams.map((exam) => (
                  <tr
                    key={exam.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                      #{exam.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 line-clamp-1">
                        {exam.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-700 font-medium">
                        <BookOpen className="h-3 w-3 text-blue-500" />
                        {exam.subject} - {exam.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-700">
                        <Clock className="h-3 w-3 text-orange-500" />
                        {exam.duration} phút
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs text-slate-700">
                        <HelpCircle className="h-3 w-3 text-indigo-500" />
                        {exam.questionCount} câu
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() =>
                            navigate(`${basePath}/exams/view/${exam.id}`)
                          }
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() =>
                            navigate(`${basePath}/exams/edit/${exam.id}`)
                          }
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(exam.id)}
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
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Không tìm thấy đề thi nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
            <span className="text-sm text-gray-500">
              Trang {currentPage} / {totalPages} &nbsp;·&nbsp; {exams.length} đề
              thi
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
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
