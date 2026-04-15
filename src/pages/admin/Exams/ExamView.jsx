import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Edit,
    FileText,
    CheckCircle2,
    Clock,
    BarChart3,
    BookOpen,
    HelpCircle,
    RefreshCw,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";

const getLevelColor = (level) => {
    switch (level) {
        case "Dễ": return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "Trung bình": return "bg-amber-50 text-amber-700 border-amber-200";
        case "Khó": return "bg-rose-50 text-rose-700 border-rose-200";
        default: return "bg-slate-50 text-slate-700";
    }
};

const ExamView = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedQuestions, setExpandedQuestions] = useState({});

    const fetchExam = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await api.get(`/api/admin/exams/${id}`);
            setExam(res.data);
        } catch (err) {
            console.error("Lỗi tải chi tiết đề thi:", err);
            setError("Không thể tải thông tin đề thi. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExam();
    }, [id]);

    const toggleQuestion = (qId) => {
        setExpandedQuestions((prev) => ({ ...prev, [qId]: !prev[qId] }));
    };

    // --- Loading State ---
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500 gap-3">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                <p>Đang tải chi tiết đề thi...</p>
            </div>
        );
    }

    // --- Error State ---
    if (error || !exam) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-red-500 gap-3">
                <p>{error || "Không tìm thấy đề thi."}</p>
                <div className="flex gap-2">
                    <Button onClick={fetchExam} variant="outline" size="sm">Thử lại</Button>
                    <Button onClick={() => navigate("/admin/exams")} variant="outline" size="sm">Quay lại</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-10">
            {/* Action Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => navigate("/admin/exams")}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
                </Button>
                <div className="flex gap-2">
                    <Button
                        onClick={() => navigate(`/admin/exams/edit/${id}`)}
                        className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
                    >
                        <Edit className="h-4 w-4" /> Chỉnh sửa
                    </Button>
                </div>
            </div>

            {/* Exam Info Card */}
            <Card className="border-none shadow-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-2 flex-1">
                            <Badge className="bg-white/20 text-white border-none text-xs">
                                Đề thi #{exam.id}
                            </Badge>
                            <h1 className="text-2xl font-bold leading-snug">{exam.title}</h1>
                            <p className="text-blue-100 flex items-center gap-1.5 text-sm">
                                <BookOpen className="h-4 w-4" /> {exam.subject}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 min-w-[180px]">
                            <div className="bg-white/10 p-3 rounded-xl text-center">
                                <Clock className="h-5 w-5 mx-auto mb-1 opacity-80" />
                                <div className="text-xl font-bold">{exam.duration}</div>
                                <div className="text-xs opacity-70">phút</div>
                            </div>
                            <div className="bg-white/10 p-3 rounded-xl text-center">
                                <HelpCircle className="h-5 w-5 mx-auto mb-1 opacity-80" />
                                <div className="text-xl font-bold">{exam.questions?.length ?? 0}</div>
                                <div className="text-xs opacity-70">câu hỏi</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Questions List */}
            <div className="space-y-3">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Danh sách câu hỏi ({exam.questions?.length ?? 0} câu)
                </h3>

                {exam.questions?.length === 0 && (
                    <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
                        Đề thi chưa có câu hỏi nào.
                    </div>
                )}

                {exam.questions?.map((q) => {
                    const isExpanded = expandedQuestions[q.id] ?? false;
                    return (
                        <Card key={q.id} className="border-none shadow-sm overflow-hidden">
                            {/* Question Header - always visible, click to expand */}
                            <CardHeader
                                className="bg-slate-50 border-b py-3 cursor-pointer hover:bg-slate-100 transition-colors"
                                onClick={() => toggleQuestion(q.id)}
                            >
                                <CardTitle className="text-sm font-medium flex justify-between items-center gap-3">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <span className="shrink-0 bg-blue-100 text-blue-700 text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">
                                            {q.orderNumber}
                                        </span>
                                        <span className="line-clamp-1 text-gray-800">{q.content}</span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Badge variant="outline" className={cn("text-xs border", getLevelColor(q.level))}>
                                            {q.level}
                                        </Badge>
                                        {isExpanded
                                            ? <ChevronUp className="h-4 w-4 text-gray-400" />
                                            : <ChevronDown className="h-4 w-4 text-gray-400" />}
                                    </div>
                                </CardTitle>
                            </CardHeader>

                            {/* Expandable content */}
                            {isExpanded && (
                                <CardContent className="p-6 space-y-4">
                                    <p className="text-gray-800 font-medium">{q.content}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {q.options?.map((opt) => (
                                            <div
                                                key={opt.label}
                                                className={cn(
                                                    "p-3 rounded-lg border text-sm transition-colors flex items-start gap-2",
                                                    opt.correct
                                                        ? "bg-emerald-50 border-emerald-400 text-emerald-800 font-semibold"
                                                        : "bg-gray-50 border-gray-200 text-gray-600"
                                                )}
                                            >
                                                <span className="font-bold shrink-0">{opt.label}.</span>
                                                <span className="flex-1">{opt.content}</span>
                                                {opt.correct && (
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {q.explanation && (
                                        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                                            <p className="text-xs font-bold text-amber-800 uppercase mb-1">
                                                Giải thích đáp án:
                                            </p>
                                            <p className="text-sm text-amber-700">{q.explanation}</p>
                                        </div>
                                    )}
                                </CardContent>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default ExamView;