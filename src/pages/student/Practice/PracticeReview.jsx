import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Menu,
    Lightbulb
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const PracticeReview = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Nhận dữ liệu thực từ state do PracticeResult truyền sang
    const data = location.state || {};
    const { 
        examId, 
        examTitle = "Giải đáp đề thi", 
        score = 0, 
        correct = 0, 
        total = 0, 
        userAnswers = {},
        questions = [] 
    } = data;

    // Nếu không có dữ liệu, quay lại trang trước
    if (!examId) {
        useEffect(() => {
            navigate("/practice");
        }, [navigate]);
        return null;
    }

    const scrollToQuestion = (id) => {
        const element = document.getElementById(`question-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    // Component Sidebar: Hiển thị trạng thái các câu hỏi (Đúng/Sai/Bỏ trống)
    const QuestionPalette = () => (
        <div className="h-full flex flex-col">
            <h4 className="font-semibold mb-4 px-1">Kết quả bài làm</h4>
            <ScrollArea className="flex-1 pr-4">
                <div className="grid grid-cols-5 gap-2">
                    {questions.map(q => {
                        const isAnswered = !!userAnswers[q.id];
                        const correctOption = q.options.find(o => o.correct);
                        const isCorrect = userAnswers[q.id] === correctOption?.label;
                        
                        let btnClass = "bg-gray-50 text-gray-400 border-gray-200"; // Chưa làm
                        if (isAnswered) {
                            btnClass = isCorrect 
                                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200" // Đúng
                                : "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"; // Sai
                        }

                        return (
                            <Button
                                key={q.id}
                                variant="outline"
                                size="sm"
                                className={cn("w-full h-8 text-xs font-semibold", btnClass)}
                                onClick={() => scrollToQuestion(q.id)}
                            >
                                {q.orderNumber}
                            </Button>
                        )
                    })}
                </div>
            </ScrollArea>
            <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
                    <span className="text-sm text-gray-600">Câu trả lời đúng</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div>
                    <span className="text-sm text-gray-600">Câu trả lời sai</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-50 border border-gray-200"></div>
                    <span className="text-sm text-gray-600">Chưa làm</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-50/30">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b shadow-sm px-4 md:px-8 py-3 flex justify-between items-center h-16">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="font-bold text-lg md:text-xl truncate" title={examTitle}>
                        Giải đáp: {examTitle}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full border border-blue-100 font-semibold">
                        <span>Điểm: {score}</span>
                        <span className="mx-2">|</span>
                        <span>Đúng: {correct}/{total}</span>
                    </div>

                    {/* Mobile Question Palette Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="lg:hidden">
                                <Menu className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <QuestionPalette />
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            <div className="flex-1 container max-w-[1400px] mx-auto p-4 md:p-6 flex gap-8">
                {/* Main Content - Questions Review */}
                <div className="flex-1 max-w-[900px] mx-auto w-full">
                    {questions.map((q) => {
                        const userAnswer = userAnswers[q.id];
                        const correctOption = q.options.find(o => o.correct);
                        const isCorrect = userAnswer === correctOption?.label;
                        const isUnanswered = !userAnswer;

                        return (
                            <div
                                key={q.id}
                                id={`question-${q.id}`}
                                className={cn(
                                    "bg-white rounded-xl border p-6 mb-6 shadow-sm scroll-mt-24 transition-colors",
                                    isCorrect && !isUnanswered ? "border-green-200" : "",
                                    !isCorrect && !isUnanswered ? "border-red-200" : ""
                                )}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                        Câu {q.orderNumber}
                                    </Badge>
                                    
                                    {/* Hiển thị Icon trạng thái đúng/sai */}
                                    {!isUnanswered && (
                                        <div className="flex items-center gap-1 font-semibold">
                                            {isCorrect ? (
                                                <span className="text-green-600 flex items-center gap-1">
                                                    <CheckCircle2 className="h-5 w-5" /> Đúng
                                                </span>
                                            ) : (
                                                <span className="text-red-500 flex items-center gap-1">
                                                    <XCircle className="h-5 w-5" /> Sai
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {isUnanswered && (
                                        <span className="text-gray-400 font-medium italic">Chưa trả lời</span>
                                    )}
                                </div>

                                <p className="text-base font-medium text-gray-900 mb-6 leading-relaxed">
                                    {q.content}
                                </p>

                                {/* Options List */}
                                <div className="space-y-3">
                                    {q.options.map(opt => {
                                        const isThisOptionCorrect = opt.correct;
                                        const isThisOptionUserPicked = opt.label === userAnswer;

                                        let optionClass = "border-gray-200 bg-white text-gray-600"; // Mặc định
                                        let icon = null;

                                        if (isThisOptionCorrect) {
                                            // Đáp án đúng luôn tô xanh
                                            optionClass = "border-green-500 bg-green-50 text-green-800 shadow-sm";
                                            icon = <CheckCircle2 className="h-5 w-5 text-green-600 ml-auto" />;
                                        } else if (isThisOptionUserPicked && !isThisOptionCorrect) {
                                            // Đáp án user chọn mà sai thì tô đỏ
                                            optionClass = "border-red-500 bg-red-50 text-red-800 shadow-sm";
                                            icon = <XCircle className="h-5 w-5 text-red-500 ml-auto" />;
                                        }

                                        return (
                                            <div key={opt.label} className={cn(
                                                "flex items-center space-x-3 rounded-lg border p-3 transition-all",
                                                optionClass
                                            )}>
                                                {/* Giả lập Radio bị disable */}
                                                <div className={cn(
                                                    "h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                                                    isThisOptionUserPicked ? (isCorrect ? "border-green-600 bg-green-600" : "border-red-600 bg-red-600") : "border-gray-300",
                                                    isThisOptionCorrect && !isThisOptionUserPicked && "border-green-600"
                                                )}>
                                                    {isThisOptionUserPicked && <div className="h-2 w-2 bg-white rounded-full"></div>}
                                                </div>
                                                
                                                <Label className="flex-1 cursor-default font-normal text-base flex items-center">
                                                    <span className="font-bold mr-2">{opt.label}.</span> {opt.content}
                                                    {icon}
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Khối Lời giải chi tiết */}
                                <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                                    <div className="flex items-center gap-2 text-blue-800 font-semibold mb-2">
                                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                                        Lời giải chi tiết
                                    </div>
                                    <p className="text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-line">
                                        {q.explanation}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Desktop Question Palette */}
                <div className="hidden lg:block w-80 shrink-0">
                    <div className="sticky top-24 bg-white rounded-xl border shadow-sm p-4 max-h-[calc(100vh-120px)] flex flex-col">
                        <QuestionPalette />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PracticeReview;