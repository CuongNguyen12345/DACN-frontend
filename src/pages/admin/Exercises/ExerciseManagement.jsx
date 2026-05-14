import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Filter,
  HelpCircle,
  Layers,
  ListChecks,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useTeacherScope } from "@/hooks/useTeacherScope";
import api from "@/services/api";
import { normalizeQuizSummary } from "./exerciseCreateForm";
import {
  filterExercises,
  getExerciseStats,
  paginateExercises,
} from "./exerciseManagementFilters";
import {
  GRADE_FILTER_OPTIONS,
  SUBJECT_FILTER_OPTIONS,
  getScopedGradeFilter,
  getScopedSubjectFilter,
} from "@/pages/admin/Questions/questionListFilters";

const difficultyOptions = ["all", "Dễ", "Trung bình", "Khó"];
const getDifficultyBadgeClassName = (difficulty) => {
  switch (difficulty) {
    case "Khó":
      return "border-red-200 bg-red-50 text-red-700";
    case "Trung bình":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
};

const ExerciseManagement = () => {
  const navigate = useNavigate();
  const { basePath } = useAuth();
  const scope = useTeacherScope();
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [lessonFilter, setLessonFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const scopedSubjectFilter = useMemo(
    () => getScopedSubjectFilter(scope, subjectFilter),
    [scope, subjectFilter],
  );
  const scopedGradeFilter = useMemo(
    () => getScopedGradeFilter(scope, gradeFilter),
    [scope, gradeFilter],
  );
  const effectiveSubjectFilter = scopedSubjectFilter.value;
  const effectiveGradeFilter = scopedGradeFilter.value;

  const uniqueLessons = useMemo(
    () => [
      "all",
      ...new Set(exercises.map((exercise) => exercise.lessonTitle).filter(Boolean)),
    ],
    [exercises],
  );

  const fetchExercises = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get("/api/admin/quizzes");
      const data = Array.isArray(response.data)
        ? response.data.map(normalizeQuizSummary)
        : [];
      setExercises(data);
    } catch (err) {
      console.error("Cannot load quizzes:", err);
      setExercises([]);
      setError("Không thể tải danh sách bài tập. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const filteredExercises = useMemo(
    () =>
      filterExercises(exercises, {
        keyword: searchTerm,
        subject: effectiveSubjectFilter,
        grade: effectiveGradeFilter,
        lesson: lessonFilter,
        difficulty: difficultyFilter,
      }),
    [difficultyFilter, effectiveGradeFilter, effectiveSubjectFilter, exercises, lessonFilter, searchTerm],
  );

  const { currentItems, totalPages } = paginateExercises(
    filteredExercises,
    currentPage,
    itemsPerPage,
  );
  const stats = getExerciseStats(exercises);

  const resetToFirstPage = () => setCurrentPage(1);

  const handleDelete = async (exercise) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa bài tập "${exercise.title}" không?`,
      )
    ) {
      try {
        await api.delete(`/api/admin/quizzes/${exercise.id}`);
        setExercises((prev) => prev.filter((item) => item.id !== exercise.id));
        setCurrentPage((page) => Math.min(page, totalPages));
      } catch (err) {
        console.error("Cannot delete quiz:", err);
        alert("Không thể xóa bài tập. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpenCheck className="h-6 w-6 text-blue-600" />
            Quản lý bài tập
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Tạo bài tập trắc nghiệm sau mỗi bài học để học viên ôn lại kiến thức.
          </p>
        </div>
        <Button
          onClick={() => navigate(`${basePath}/exercises/create`)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          Tạo bài tập
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Tổng bài tập</p>
              <p className="text-xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Tổng câu hỏi</p>
              <p className="text-xl font-bold text-slate-900">{stats.questions}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-4 flex flex-col xl:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
              placeholder="Tìm kiếm theo tên bài tập hoặc bài học..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                resetToFirstPage();
              }}
            />
          </div>
          <div className="grid grid-cols-2 md:flex gap-3">
            <Select
              value={effectiveSubjectFilter}
              onValueChange={(value) => {
                if (scopedSubjectFilter.disabled) return;
                setSubjectFilter(value);
                resetToFirstPage();
              }}
              disabled={scopedSubjectFilter.disabled}
            >
              <SelectTrigger className="w-full md:w-[140px] bg-white">
                <Filter className="h-4 w-4 mr-2 text-slate-500" />
                <SelectValue placeholder="Môn học" />
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
                setGradeFilter(value);
                resetToFirstPage();
              }}
              disabled={scopedGradeFilter.disabled}
            >
              <SelectTrigger className="w-full md:w-[130px] bg-white">
                <SelectValue placeholder="Lớp" />
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
            <Select
              value={lessonFilter}
              onValueChange={(value) => {
                setLessonFilter(value);
                resetToFirstPage();
              }}
            >
              <SelectTrigger className="w-full md:w-[190px] bg-white">
                <SelectValue placeholder="Bài học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả bài học</SelectItem>
                {uniqueLessons
                  .filter((lesson) => lesson !== "all")
                  .map((lesson) => (
                  <SelectItem key={lesson} value={lesson}>
                    {lesson}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={difficultyFilter}
              onValueChange={(value) => {
                setDifficultyFilter(value);
                resetToFirstPage();
              }}
            >
              <SelectTrigger className="w-full md:w-[140px] bg-white">
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty === "all" ? "Tất cả mức" : difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 font-medium">Mã bài</th>
                <th className="px-6 py-4 font-medium">Bài tập</th>
                <th className="px-6 py-4 font-medium text-center">Bài học</th>
                <th className="px-6 py-4 font-medium text-center">Cấu hình</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    Đang tải danh sách bài tập...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((exercise) => (
                  <tr
                    key={exercise.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                      {exercise.code || exercise.id}
                    </td>
                    <td className="px-6 py-4 min-w-[260px]">
                      <div className="font-medium text-slate-900 line-clamp-1">
                        {exercise.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Cập nhật: {exercise.updatedAt}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="font-medium text-slate-800 line-clamp-1">
                        {exercise.lessonTitle}
                      </div>
                      <div className="text-xs text-slate-500">
                        {exercise.subject} - {exercise.grade}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-1 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <ListChecks className="h-3.5 w-3.5 text-indigo-500" />
                          {exercise.questionCount} câu
                        </span>
                        <span>
                          {exercise.duration} phút · Đạt {exercise.passScore}%
                        </span>
                        <span className={`inline-flex rounded-full border px-2 py-0.5 font-medium ${getDifficultyBadgeClassName(exercise.difficulty)}`}>
                          {exercise.difficulty}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          onClick={() => navigate(`${basePath}/exercises/edit/${exercise.id}`)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-600 hover:bg-slate-100"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => navigate(`${basePath}/exercises/edit/${exercise.id}`)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(exercise)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-slate-500">
                    Không tìm thấy bài tập nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white">
          <span className="text-sm text-slate-500">
            Trang {currentPage} / {totalPages} · {filteredExercises.length} bài tập
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
              className="h-8 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="h-8 px-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExerciseManagement;
