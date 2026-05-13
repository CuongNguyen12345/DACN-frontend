import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  Database,
  Save,
  Search,
  Tag,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import {
  buildBankQuestionParams,
  buildQuizPayload,
  buildTopicParams,
  defaultExerciseForm,
  getDifficultyBadgeClassName,
  mergeBankQuestionsIntoFormQuestions,
  normalizeBankQuestionSummary,
  normalizeQuizDetailToForm,
  normalizeTopicOptions,
  paginateBankQuestions,
} from "./exerciseCreateForm";

const inputClasses =
  "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
const bankQuestionsPerPage = 5;
const bankSubjectOptions = ["all", "Toán", "Vật Lý", "Hóa Học", "Tiếng Anh", "Sinh học"];
const bankGradeOptions = ["all", "Lớp 10", "Lớp 11", "Lớp 12"];
const bankLevelOptions = ["all", "Dễ", "Trung bình", "Khó"];
const subjectOptions = bankSubjectOptions;
const gradeOptions = bankGradeOptions;
const subjectToCourseParam = {
  Toán: "Toán",
  "Vật Lý": "Lý",
  "Hóa Học": "Hóa",
  "Tiếng Anh": "Anh",
  "Sinh học": "Sinh học",
};

const getCourseGradeParam = (grade) => String(grade || "").replace(/\D/g, "");

const normalizeCourseLessons = (payload) => {
  const chapters = Array.isArray(payload?.data) ? payload.data : [];

  return chapters.flatMap((chapter) =>
    (chapter.lessons || []).map((lesson) => ({
      id: String(lesson.id),
      title: lesson.lessonName,
      chapterName: chapter.chapterName,
    })),
  );
};

const ExerciseCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { basePath } = useAuth();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState({
    ...defaultExerciseForm,
    lessonId: "",
    questions: [],
  });
  const [isExerciseLoading, setIsExerciseLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [isBankOpen, setIsBankOpen] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState("");
  const [bankSubjectFilter, setBankSubjectFilter] = useState("all");
  const [bankGradeFilter, setBankGradeFilter] = useState("all");
  const [bankTopicFilter, setBankTopicFilter] = useState("all");
  const [bankLevelFilter, setBankLevelFilter] = useState("all");
  const [bankCurrentPage, setBankCurrentPage] = useState(1);
  const [bankQuestions, setBankQuestions] = useState([]);
  const [bankTopics, setBankTopics] = useState([]);
  const [isBankLoading, setIsBankLoading] = useState(false);
  const [isAddingBankQuestions, setIsAddingBankQuestions] = useState(false);
  const [bankError, setBankError] = useState("");
  const [selectedBankQuestionIds, setSelectedBankQuestionIds] = useState([]);
  const [assignmentTopics, setAssignmentTopics] = useState([]);
  const [isAssignmentTopicLoading, setIsAssignmentTopicLoading] = useState(false);
  const [assignableLessons, setAssignableLessons] = useState([]);
  const [isAssignableLessonsLoading, setIsAssignableLessonsLoading] = useState(false);

  const assignmentTopicParams = useMemo(
    () =>
      buildTopicParams({
        subject: formData.subject,
        grade: formData.grade,
      }),
    [formData.grade, formData.subject],
  );
  const canSelectAssignmentTopic = Boolean(assignmentTopicParams);
  const canLoadTopics = bankSubjectFilter !== "all" && bankGradeFilter !== "all";
  const topicOptions = useMemo(
    () => ["all", ...bankTopics.map((topic) => topic.name)],
    [bankTopics],
  );
  const {
    currentItems: paginatedBankQuestions,
    totalPages: bankTotalPages,
  } = paginateBankQuestions(bankQuestions, bankCurrentPage, bankQuestionsPerPage);
  const currentPageQuestionIds = useMemo(
    () => paginatedBankQuestions.map((question) => question.id),
    [paginatedBankQuestions],
  );
  const selectedCurrentPageCount = currentPageQuestionIds.filter((id) =>
    selectedBankQuestionIds.includes(id),
  ).length;
  const isCurrentPageFullySelected =
    currentPageQuestionIds.length > 0 &&
    selectedCurrentPageCount === currentPageQuestionIds.length;
  const isCurrentPagePartiallySelected =
    selectedCurrentPageCount > 0 && !isCurrentPageFullySelected;
  const goBackToList = useCallback(
    () => navigate(`${basePath}/exercises`),
    [basePath, navigate],
  );

  const fetchBankQuestions = useCallback(async () => {
    setIsBankLoading(true);
    setBankError("");

    try {
      const response = await api.get("/api/admin/questions", {
        params: buildBankQuestionParams({
          keyword: bankSearchTerm,
          subject: bankSubjectFilter,
          grade: bankGradeFilter,
          topic: bankTopicFilter,
          level: bankLevelFilter,
        }),
      });
      const questions = Array.isArray(response.data)
        ? response.data.map(normalizeBankQuestionSummary)
        : [];
      setBankQuestions(questions);
      setBankCurrentPage(1);
    } catch (error) {
      console.error("Lỗi tải ngân hàng câu hỏi:", error);
      setBankQuestions([]);
      setBankError("Không thể tải ngân hàng câu hỏi. Vui lòng thử lại.");
    } finally {
      setIsBankLoading(false);
    }
  }, [
    bankGradeFilter,
    bankLevelFilter,
    bankSearchTerm,
    bankSubjectFilter,
    bankTopicFilter,
  ]);

  useEffect(() => {
    if (!isBankOpen) return undefined;

    const timer = window.setTimeout(fetchBankQuestions, 300);
    return () => window.clearTimeout(timer);
  }, [fetchBankQuestions, isBankOpen]);

  useEffect(() => {
    if (!isBankOpen || !canLoadTopics) return undefined;

    const timer = window.setTimeout(async () => {
      try {
        const response = await api.get("/api/admin/topics", {
          params: {
            subject: bankSubjectFilter,
            grade: bankGradeFilter,
          },
        });
        setBankTopics(normalizeTopicOptions(response.data));
      } catch (error) {
        console.error("Lỗi tải chủ đề:", error);
        setBankTopics([]);
      }
    }, 200);

    return () => window.clearTimeout(timer);
  }, [bankGradeFilter, bankSubjectFilter, canLoadTopics, isBankOpen]);

  useEffect(() => {
    if (!assignmentTopicParams) {
      setAssignmentTopics([]);
      setIsAssignmentTopicLoading(false);
      return undefined;
    }

    let shouldIgnore = false;
    setAssignmentTopics([]);
    setIsAssignmentTopicLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const response = await api.get("/api/admin/topics", {
          params: assignmentTopicParams,
        });

        if (!shouldIgnore) {
          setAssignmentTopics(normalizeTopicOptions(response.data));
        }
      } catch (error) {
        console.error("Cannot load assignment topics:", error);
        if (!shouldIgnore) {
          setAssignmentTopics([]);
        }
      } finally {
        if (!shouldIgnore) {
          setIsAssignmentTopicLoading(false);
        }
      }
    }, 200);

    return () => {
      shouldIgnore = true;
      window.clearTimeout(timer);
    };
  }, [assignmentTopicParams]);

  useEffect(() => {
    const subject = subjectToCourseParam[formData.subject];
    const grade = getCourseGradeParam(formData.grade);

    if (!subject || !grade) {
      setAssignableLessons([]);
      setIsAssignableLessonsLoading(false);
      return undefined;
    }

    let shouldIgnore = false;
    setIsAssignableLessonsLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const response = await api.get("/api/learning/course", {
          params: {
            subject,
            grade,
            page: 1,
            size: 100,
          },
        });
        const lessons = normalizeCourseLessons(response.data);

        if (!shouldIgnore) {
          setAssignableLessons(lessons);
          setFormData((prev) => {
            if (!prev.lessonId || lessons.some((lesson) => lesson.id === String(prev.lessonId))) {
              return prev;
            }
            return { ...prev, lessonId: "" };
          });
        }
      } catch (error) {
        console.error("Cannot load assignable lessons:", error);
        if (!shouldIgnore) {
          setAssignableLessons([]);
        }
      } finally {
        if (!shouldIgnore) {
          setIsAssignableLessonsLoading(false);
        }
      }
    }, 200);

    return () => {
      shouldIgnore = true;
      window.clearTimeout(timer);
    };
  }, [formData.grade, formData.subject]);

  useEffect(() => {
    if (!isEditMode) return undefined;

    let shouldIgnore = false;
    const fetchExercise = async () => {
      setIsExerciseLoading(true);
      try {
        const response = await api.get(`/api/admin/quizzes/${id}`);
        if (!shouldIgnore) {
          setFormData(normalizeQuizDetailToForm(response.data));
        }
      } catch (error) {
        console.error("Cannot load quiz:", error);
        if (!shouldIgnore) {
          alert("Không thể tải bài tập. Vui lòng thử lại.");
          goBackToList();
        }
      } finally {
        if (!shouldIgnore) {
          setIsExerciseLoading(false);
        }
      }
    };

    fetchExercise();

    return () => {
      shouldIgnore = true;
    };
  }, [goBackToList, id, isEditMode]);

  const updateQuestion = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, [field]: value } : question,
      ),
    }));
  };

  const toggleBankQuestion = (id) => {
    setSelectedBankQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleCurrentPageQuestions = () => {
    setSelectedBankQuestionIds((prev) => {
      if (isCurrentPageFullySelected) {
        return prev.filter((id) => !currentPageQuestionIds.includes(id));
      }

      return Array.from(new Set([...prev, ...currentPageQuestionIds]));
    });
  };

  const resetBankPage = () => setBankCurrentPage(1);
  const resetBankTopic = () => {
    setBankTopicFilter("all");
    setBankTopics([]);
  };

  const updateAssignment = (changes) => {
    setFormData((prev) => ({
      ...prev,
      ...changes,
      lessonId: "",
    }));
  };

  const getQuestionApiId = (id) => String(id).replace(/^Q-?/, "");

  const handleAddBankQuestions = async () => {
    if (selectedBankQuestionIds.length === 0) {
      alert("Vui lòng chọn ít nhất một câu hỏi.");
      return;
    }

    setIsAddingBankQuestions(true);
    try {
      const selectedQuestionDetails = await Promise.all(
        selectedBankQuestionIds.map(async (id) => {
          const response = await api.get(`/api/admin/questions/${getQuestionApiId(id)}`);
          return response.data;
        }),
      );

      setFormData((prev) => ({
        ...prev,
        questions: mergeBankQuestionsIntoFormQuestions(
          prev.questions,
          selectedQuestionDetails,
        ),
      }));
      setSelectedBankQuestionIds([]);
      setIsBankOpen(false);
    } catch (error) {
      console.error("Lỗi lấy chi tiết câu hỏi:", error);
      alert("Không thể lấy chi tiết câu hỏi đã chọn. Vui lòng thử lại.");
    } finally {
      setIsAddingBankQuestions(false);
    }
  };

  const removeQuestion = (index) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, questionIndex) => questionIndex !== index),
    }));
  };

  const handleSave = async () => {
    try {
      const payload = buildQuizPayload(formData);
      setIsSaving(true);
      if (isEditMode) {
        await api.put(`/api/admin/quizzes/${id}`, payload);
      } else {
        await api.post("/api/admin/quizzes", payload);
      }
      alert(isEditMode ? "Cập nhật bài tập thành công!" : "Tạo bài tập thành công!");
      goBackToList();
    } catch (error) {
      console.error("Cannot save quiz:", error);
      alert(error.response?.data?.message || error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isExerciseLoading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center text-sm text-slate-500">
        Đang tải bài tập...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpenCheck className="h-6 w-6 text-blue-600" />
              Tạo bài tập trắc nghiệm
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Gắn bài tập với một bài học và nhập các câu hỏi ôn tập sau bài học.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={goBackToList}>
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            Lưu bài tập
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg font-semibold">
                Thông tin bài tập
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">
                  Tên bài tập <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputClasses}
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  placeholder="VD: Luyện tập sau bài khái niệm đạo hàm"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4 border-b flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Danh sách câu hỏi
              </CardTitle>
              <div className="flex gap-2">
                <Dialog open={isBankOpen} onOpenChange={setIsBankOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                    >
                      <Database className="h-4 w-4 mr-1" />
                      Ngân hàng câu hỏi
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[92vw] lg:max-w-5xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Ngân hàng câu hỏi</DialogTitle>
                    </DialogHeader>

                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(220px,1fr)_repeat(4,140px)] gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none transition-all focus:ring-2 focus:ring-blue-500"
                          placeholder="Tìm nội dung hoặc chủ đề..."
                          value={bankSearchTerm}
                          onChange={(event) => {
                            setBankSearchTerm(event.target.value);
                            resetBankPage();
                          }}
                        />
                      </div>
                      <Select
                        value={bankSubjectFilter}
                        onValueChange={(value) => {
                          setBankSubjectFilter(value);
                          resetBankTopic();
                          resetBankPage();
                        }}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Môn học" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankSubjectOptions.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject === "all" ? "Tất cả môn" : subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={bankGradeFilter}
                        onValueChange={(value) => {
                          setBankGradeFilter(value);
                          resetBankTopic();
                          resetBankPage();
                        }}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Lớp" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankGradeOptions.map((grade) => (
                            <SelectItem key={grade} value={grade}>
                              {grade === "all" ? "Tất cả lớp" : grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={bankTopicFilter}
                        onValueChange={(value) => {
                          setBankTopicFilter(value);
                          resetBankPage();
                        }}
                        disabled={!canLoadTopics}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Chủ đề" />
                        </SelectTrigger>
                        <SelectContent>
                          {topicOptions.map((topic) => (
                            <SelectItem key={topic} value={topic}>
                              {topic === "all" ? "Tất cả chủ đề" : topic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={bankLevelFilter}
                        onValueChange={(value) => {
                          setBankLevelFilter(value);
                          resetBankPage();
                        }}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Độ khó" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankLevelOptions.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level === "all" ? "Tất cả mức" : level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1 overflow-y-auto border border-slate-200 rounded-lg mt-4 min-h-[330px]">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-600">
                          <tr>
                            <th className="px-4 py-3 w-10">
                              <Checkbox
                                checked={
                                  isCurrentPagePartiallySelected
                                    ? "indeterminate"
                                    : isCurrentPageFullySelected
                                }
                                onCheckedChange={toggleCurrentPageQuestions}
                                aria-label="Chọn tất cả câu hỏi trong trang này"
                              />
                            </th>
                            <th className="px-4 py-3">Nội dung câu hỏi</th>
                            <th className="px-4 py-3 text-center">Phân loại</th>
                            <th className="px-4 py-3 text-center">Mức độ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {isBankLoading ? (
                            <tr>
                              <td
                                colSpan="4"
                                className="px-4 py-8 text-center text-slate-500"
                              >
                                Đang tải ngân hàng câu hỏi...
                              </td>
                            </tr>
                          ) : bankError ? (
                            <tr>
                              <td
                                colSpan="4"
                                className="px-4 py-8 text-center text-red-500"
                              >
                                {bankError}
                              </td>
                            </tr>
                          ) : paginatedBankQuestions.length > 0 ? (
                            paginatedBankQuestions.map((question) => (
                              <tr key={question.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">
                                  <Checkbox
                                    checked={selectedBankQuestionIds.includes(
                                      question.id,
                                    )}
                                    onCheckedChange={() =>
                                      toggleBankQuestion(question.id)
                                    }
                                  />
                                </td>
                                <td className="px-4 py-3">
                                  <div className="font-medium text-slate-900 line-clamp-2">
                                    {question.content}
                                  </div>
                                  <div className="text-xs text-slate-500 mt-1">
                                    Chủ đề: {question.topicName}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="inline-flex items-center gap-1 text-xs text-slate-700">
                                    <Tag className="h-3.5 w-3.5 text-slate-400" />
                                    {question.subject} - {question.grade}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className={getDifficultyBadgeClassName(question.level)}>
                                    {question.level}
                                  </span>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="4"
                                className="px-4 py-8 text-center text-slate-500"
                              >
                                Không tìm thấy câu hỏi phù hợp.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-between pt-3 text-sm text-slate-500">
                      <span>
                        Trang {bankCurrentPage} / {bankTotalPages} ·{" "}
                        {bankQuestions.length} câu hỏi
                      </span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setBankCurrentPage((page) => Math.max(page - 1, 1))
                          }
                          disabled={bankCurrentPage === 1}
                          className="h-8 px-2"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setBankCurrentPage((page) =>
                              Math.min(page + 1, bankTotalPages),
                            )
                          }
                          disabled={bankCurrentPage === bankTotalPages}
                          className="h-8 px-2"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <DialogFooter className="pt-4">
                      <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <span className="text-sm font-medium text-blue-600">
                          Đã chọn {selectedBankQuestionIds.length} câu hỏi
                        </span>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsBankOpen(false)}
                          >
                            Hủy
                          </Button>
                          <Button
                            onClick={handleAddBankQuestions}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={isAddingBankQuestions}
                          >
                            {isAddingBankQuestions ? "Đang thêm..." : "Thêm vào bài tập"}
                          </Button>
                        </div>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {formData.questions.map((question, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-4 bg-slate-50/60 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800">
                      Câu {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:bg-red-50"
                      onClick={() => removeQuestion(index)}
                      disabled={formData.questions.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <Textarea
                    readOnly
                    value={question.content}
                    onChange={(event) =>
                      updateQuestion(index, "content", event.target.value)
                    }
                    placeholder="Nhập nội dung câu hỏi..."
                    className="min-h-20 bg-white"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {["A", "B", "C", "D"].map((option) => (
                      <input
                        readOnly
                        key={option}
                        className={inputClasses}
                        value={question[`option${option}`]}
                        onChange={(event) =>
                          updateQuestion(index, `option${option}`, event.target.value)
                        }
                        placeholder={`Đáp án ${option}`}
                      />
                    ))}
                  </div>

                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg font-semibold">
                Gắn với bài học
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">
                    Môn học
                  </label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) =>
                      updateAssignment({
                        subject: value,
                        topic: "all",
                      })
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Chọn môn" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject === "all" ? "Chọn môn" : subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">
                    Lớp
                  </label>
                  <Select
                    value={formData.grade}
                    onValueChange={(value) =>
                      updateAssignment({
                        grade: value,
                        topic: "all",
                      })
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Chọn lớp" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade === "all" ? "Chọn lớp" : grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">
                  Chủ đề
                </label>
                <Select
                  value={formData.topic}
                  onValueChange={(value) => updateAssignment({ topic: value })}
                  disabled={!canSelectAssignmentTopic}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Chọn chủ đề" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả chủ đề</SelectItem>
                    {isAssignmentTopicLoading ? (
                      <SelectItem value="loading" disabled>
                        Äang táº£i chá»§ Ä‘á»...
                      </SelectItem>
                    ) : (
                      assignmentTopics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.name}>
                          {topic.name}
                        </SelectItem>
                      ))
                    )}
                    {!isAssignmentTopicLoading &&
                    canSelectAssignmentTopic &&
                    assignmentTopics.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        KhÃ´ng cÃ³ chá»§ Ä‘á»
                      </SelectItem>
                    ) : null}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-800">
                  Bài học
                </label>
                <Select
                  value={formData.lessonId || "unassigned"}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      lessonId: value === "unassigned" ? "" : value,
                    }))
                  }
                  disabled={isAssignableLessonsLoading || assignableLessons.length === 0}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Chọn bài học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned" disabled>
                      {isAssignableLessonsLoading
                        ? "Đang tải bài học..."
                        : "Chọn bài học"}
                    </SelectItem>
                    {assignableLessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={lesson.id}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                    {!isAssignableLessonsLoading && assignableLessons.length === 0 ? (
                      <SelectItem value="empty" disabled>
                        Không có bài học phù hợp
                      </SelectItem>
                    ) : null}
                  </SelectContent>
                </Select>
                {formData.lessonId ? (
                  <p className="text-xs text-slate-500">
                    Nếu không chọn bài học, bài tập vẫn hiện theo topic/chương.
                  </p>
                ) : null}
              </div>

            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="text-lg font-semibold">Cấu hình</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">
                    Thời gian
                  </label>
                  <input
                    type="number"
                    min="1"
                    className={inputClasses}
                    value={formData.duration}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">
                    Điểm đạt
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className={inputClasses}
                    value={formData.passScore}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        passScore: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-medium text-slate-800">
                    Độ khó
                  </label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        difficulty: value,
                      }))
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Chọn độ khó" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dễ">Dễ</SelectItem>
                      <SelectItem value="Trung bình">Trung bình</SelectItem>
                      <SelectItem value="Khó">Khó</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCreate;
