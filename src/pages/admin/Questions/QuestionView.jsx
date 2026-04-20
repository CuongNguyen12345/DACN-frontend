import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/services/api";
import {
  ArrowLeft,
  Edit,
  CheckCircle2,
  Circle,
  ExternalLink,
  Tag,
  Calendar,
  FileText,
  Layers,
  Link as LinkIcon,
  Loader2,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const QuestionView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        // id in frontend is like "Q-101", let's extract the actual ID by removing "Q-"
        const actualId = id.replace("Q-", "");
        const res = await api.get(`/api/admin/questions/${actualId}`);
        const data = res.data;
        data.createdAt = data.createdAt
          ? String(data.createdAt).substring(0, 10)
          : "N/A";

        // Mock linked exams for now since it's not in BE yet
        data.linkedExams = [
          {
            id: "EX-2024-01",
            title: "Đề kiểm tra 15p Toán Giải Tích",
            status: "Đang diễn ra",
            date: "2026-03-12",
          },
          {
            id: "EX-2024-05",
            title: "Đề thi Giữa kỳ I - Khối 12",
            status: "Đã đóng",
            date: "2026-01-15",
          },
        ];

        setQuestion(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết câu hỏi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id]);

  const getLevelColor = (level) => {
    switch (level) {
      case "Dễ":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Trung bình":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Khó":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã duyệt":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Bản nháp":
        return "bg-slate-100 text-slate-600 border-slate-200";
      case "Cần sửa lại":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };

  const getExamStatusColor = (status) => {
    switch (status) {
      case "Đang diễn ra":
        return "bg-emerald-100 text-emerald-700";
      case "Đã đóng":
        return "bg-slate-100 text-slate-600";
      case "Bản nháp":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Đang tải chi tiết câu hỏi...
      </div>
    );
  }

  if (!question) {
    return (
      <div className="p-10 text-center text-red-500">
        Không tìm thấy câu hỏi này.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/${basePath}/questions`)}
            className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">
                Chi tiết câu hỏi
              </h2>
              <Badge variant="outline" className="text-slate-500 bg-white">
                {question.id}
              </Badge>
            </div>
            <p className="text-sm text-slate-500">
              Xem trước nội dung hiển thị và thông tin liên kết.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleDelete}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Xóa
        </Button>

        <Button
          onClick={() => navigate(`/${basePath}/questions/edit/${question.id}`)}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <Edit className="h-4 w-4" />
          Chỉnh sửa câu hỏi
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Nội dung hiển thị
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-slate-800 text-base leading-relaxed bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                <span className="font-semibold mr-2">Câu hỏi:</span>
                {question.content}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {question.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border transition-all",
                      opt.isCorrect
                        ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                        : "border-slate-200 bg-slate-50",
                    )}
                  >
                    <div className="mt-0.5">
                      {opt.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 mr-2">
                        {opt.id}.
                      </span>
                      <span className="text-slate-800">{opt.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              {question.explanation && (
                <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">
                    Lời giải chi tiết:
                  </h4>
                  <p className="text-sm text-slate-700">
                    {question.explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-indigo-500" />
                Đề thi sử dụng câu hỏi này
              </CardTitle>
              <Badge
                variant="secondary"
                className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100"
              >
                {question.linkedExams.length} đề thi
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              {question.linkedExams.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {question.linkedExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                          <Layers className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900 line-clamp-1">
                            {exam.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span>Mã: {exam.id}</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {exam.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "font-normal border-transparent",
                            getExamStatusColor(exam.status),
                          )}
                        >
                          {exam.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          title="Xem đề thi"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">
                  <LinkIcon className="h-8 w-8 mx-auto text-slate-300 mb-3" />
                  <p>Câu hỏi này chưa được gán vào đề thi nào.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cột phải */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                <Tag className="h-5 w-5 text-amber-500" />
                Thuộc tính câu hỏi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Lớp</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "font-medium border",
                    getStatusColor(question.status),
                  )}
                >
                  {question.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Môn học</span>
                <span className="font-medium text-slate-900">
                  {question.subject}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Độ khó</span>
                <Badge
                  className={cn(
                    "font-normal border shadow-none",
                    getLevelColor(question.level),
                  )}
                >
                  {question.level}
                </Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500 text-sm">Loại câu hỏi</span>
                <span className="font-medium text-slate-900">
                  {question.type}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-500 text-sm">Ngày tạo</span>
                <span className="text-sm text-slate-700">
                  {question.createdAt}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuestionView;
