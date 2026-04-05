import { useState } from "react";
import { cn } from "@/lib/utils";
import { useParams, useNavigate } from "react-router-dom";
import { 
    ArrowLeft, 
    Printer, 
    Edit, 
    FileText, 
    CheckCircle2, 
    Clock, 
    BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const ExamView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { basePath } = useAuth();

    // Mock dữ liệu chi tiết đề thi (Trong thực tế sẽ gọi API theo ID)
    const examDetail = {
        id: id,
        title: "Đề thi thử THPT QG Môn Toán 2025 - Lần 1",
        subject: "Toán học",
        duration: 90,
        totalQuestions: 50,
        description: "Đề thi bám sát cấu trúc minh họa của Bộ Giáo dục năm 2025.",
        questions: [
            {
                number: 1,
                content: "Cho hàm số $y = f(x)$ có bảng biến thiên như sau. Hàm số đã cho đồng biến trên khoảng nào dưới đây?",
                options: ["(0; 2)", "(-∞; 0)", "(2; +∞)", "(0; +∞)"],
                correctAnswer: 0,
                explanation: "Dựa vào bảng biến thiên, ta thấy đạo hàm $f'(x) > 0$ trên khoảng (0; 2)."
            },
            {
                number: 2,
                content: "Tính thể tích khối cầu có bán kính $R = 3$.",
                options: ["$36\pi$", "$12\pi$", "$9\pi$", "$27\pi$"],
                correctAnswer: 0,
                explanation: "Công thức thể tích khối cầu: $V = \\frac{4}{3}\\pi R^3 = \\frac{4}{3}\\pi \\cdot 3^3 = 36\\pi$."
            }
        ]
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-10">
            {/* Action Header */}
            <div className="flex items-center justify-between">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate(`/${basePath}/exams`)}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Printer className="h-4 w-4" /> In đề thi
                    </Button>
                    <Button 
                        onClick={() => navigate(`/${basePath}/exams/edit/${id}`)}
                        className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
                    >
                        <Edit className="h-4 w-4" /> Chỉnh sửa
                    </Button>
                </div>
            </div>

            {/* Exam Info Card */}
            <Card className="border-none shadow-sm bg-blue-600 text-white">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-2">
                            <Badge className="bg-white/20 text-white border-none">Mã đề: {examDetail.id}</Badge>
                            <h1 className="text-3xl font-bold">{examDetail.title}</h1>
                            <p className="text-blue-100">{examDetail.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 min-w-[200px]">
                            <div className="bg-white/10 p-3 rounded-lg text-center">
                                <Clock className="h-5 w-5 mx-auto mb-1 opacity-80" />
                                <div className="text-xl font-bold">{examDetail.duration}p</div>
                                <div className="text-xs opacity-70">Thời gian</div>
                            </div>
                            <div className="bg-white/10 p-3 rounded-lg text-center">
                                <FileText className="h-5 w-5 mx-auto mb-1 opacity-80" />
                                <div className="text-xl font-bold">{examDetail.totalQuestions}</div>
                                <div className="text-xs opacity-70">Câu hỏi</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Questions List */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" /> Nội dung chi tiết
                </h3>
                
                {examDetail.questions.map((q) => (
                    <Card key={q.number} className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b py-3">
                            <CardTitle className="text-sm font-medium flex justify-between">
                                <span>Câu hỏi {q.number}</span>
                                <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                                    Độ khó: Trung bình
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <p className="text-gray-800 font-medium">{q.content}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {q.options.map((option, index) => (
                                    <div 
                                        key={index}
                                        className={cn(
                                            "p-3 rounded-md border text-sm transition-colors",
                                            index === q.correctAnswer 
                                                ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold" 
                                                : "bg-gray-50 border-gray-100 text-gray-600"
                                        )}
                                    >
                                        <span className="mr-2 font-bold">
                                            {String.fromCharCode(65 + index)}.
                                        </span>
                                        {option}
                                        {index === q.correctAnswer && (
                                            <CheckCircle2 className="h-4 w-4 inline ml-2 float-right" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                                <p className="text-xs font-bold text-amber-800 uppercase mb-1">Giải thích đáp án:</p>
                                <p className="text-sm text-amber-700 italic">{q.explanation}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ExamView;