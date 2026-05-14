import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/services/api";
import {
    Clock,
    AlertCircle,
    CheckCircle2,
    Flag,
    Menu
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // For mobile question list
import { useExamSecurityGuard } from "@/hooks/useExamSecurityGuard";
import { useExamSecuritySettings } from "@/hooks/useExamSecuritySettings";
import { shouldRevealExamResult } from "@/lib/examSecuritySettings";
import { normalizeExamResultDetail } from "@/pages/student/History/examHistoryView";

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const PracticeRoom = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { questionId: 'A' }
    const [timeLeft, setTimeLeft] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
    const isSubmittingRef = useRef(false);
    const examSecuritySettings = useExamSecuritySettings();
    const handleTabSwitchWarning = useCallback(() => {
        setTabSwitchWarnings((count) => count + 1);
    }, []);

    useExamSecurityGuard({
        settings: examSecuritySettings,
        enabled: !isLoading && questions.length > 0,
        onTabSwitch: handleTabSwitchWarning,
    });

    const fetchExam = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/api/exam/${examId}`);
            const data = res.data;
            setExam(data);
            setQuestions(data.questions || []);
            
            // Khôi phục answers từ localStorage
            const savedAnswers = localStorage.getItem(`exam_answers_${examId}`);
            if (savedAnswers) {
                try {
                    setAnswers(JSON.parse(savedAnswers));
                } catch (e) {
                    console.error("Lỗi parse answers:", e);
                }
            }

            // Khôi phục thời gian từ localStorage
            const savedEndTime = localStorage.getItem(`exam_endTime_${examId}`);
            if (savedEndTime) {
                const remaining = Math.floor((parseInt(savedEndTime) - Date.now()) / 1000);
                // Nếu đã hết giờ trong lúc offline, gán là 1 giây để useEffect tự động kích hoạt nộp bài
                setTimeLeft(remaining > 0 ? remaining : 1); 
            } else {
                const newEndTime = Date.now() + data.duration * 60 * 1000;
                localStorage.setItem(`exam_endTime_${examId}`, newEndTime.toString());
                setTimeLeft(data.duration * 60);
            }
        } catch (error) {
            console.error("Lỗi tải thông tin đề thi:", error);
            alert("Không thể tải thông tin đề thi.");
            navigate("/practice");
        } finally {
            setIsLoading(false);
        }
    }, [examId, navigate]);

    useEffect(() => {
        fetchExam();
    }, [fetchExam]);

    const handleAnswerSelect = (questionId, optionKey) => {
        const newAnswers = { ...answers, [questionId]: optionKey };
        setAnswers(newAnswers);
        localStorage.setItem(`exam_answers_${examId}`, JSON.stringify(newAnswers));
    };

    const calculateUnanswered = () => {
        return questions.length - Object.keys(answers).length;
    };

    const handleFinish = useCallback(async () => {
        if (!exam || isSubmittingRef.current) return;

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        try {
            const response = await api.post(`/api/exam/${examId}/submit`, {
                answers,
                durationSeconds: Math.max(0, (exam.duration * 60) - timeLeft),
            });

            localStorage.removeItem(`exam_endTime_${examId}`);
            localStorage.removeItem(`exam_answers_${examId}`);

            const resultData = {
                ...normalizeExamResultDetail(response.data),
                showResultImmediately: shouldRevealExamResult(examSecuritySettings),
            };

            navigate(`/practice/result/${examId}`, { state: resultData });
        } catch (error) {
            console.error("Lỗi lưu kết quả bài thi:", error);
            alert("Không thể lưu kết quả bài thi. Vui lòng thử lại.");
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    }, [answers, exam, examId, examSecuritySettings, navigate, timeLeft]);

    useEffect(() => {
        if (!isLoading && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleFinish();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
        return undefined;
    }, [handleFinish, isLoading, timeLeft]);

    const scrollToQuestion = (id) => {
        const element = document.getElementById(`question-${id}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const QuestionPalette = () => (
        <div className="h-full flex flex-col">
            <h4 className="font-semibold mb-4 px-1">Danh sách câu hỏi</h4>
            <ScrollArea className="flex-1 pr-4">
                <div className="grid grid-cols-5 gap-2">
                    {questions.map(q => (
                        <Button
                            key={q.id}
                            variant={answers[q.id] ? "default" : "outline"}
                            size="sm"
                            className={cn(
                                "w-full h-8 text-xs font-normal",
                                answers[q.id] ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200"
                            )}
                            onClick={() => scrollToQuestion(q.id)}
                        >
                            {q.orderNumber}
                        </Button>
                    ))}
                </div>
            </ScrollArea>
            <div className="mt-6 pt-4 border-t space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-600"></div>
                    <span className="text-sm text-gray-600">Đã làm</span>
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
            <header className="sticky top-20 z-40 bg-white border-b shadow-sm px-4 md:px-8 py-3 flex justify-between items-center">
                <h1 className="font-bold text-lg md:text-xl truncate max-w-[50%]" title={exam?.title}>
                    {exam?.title || "Đang tải..."}
                </h1>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full border border-red-100 font-mono font-bold">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(timeLeft)}</span>
                    </div>

                    {examSecuritySettings.preventTabSwitch && tabSwitchWarnings > 0 && (
                        <Badge variant="destructive" className="hidden sm:inline-flex">
                            Rời màn: {tabSwitchWarnings}
                        </Badge>
                    )}

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="default" className="bg-primary hover:bg-primary/90" disabled={isLoading || isSubmitting}>
                                {isSubmitting ? "Đang nộp..." : "Nộp bài"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Bạn chắc chắn muốn nộp bài?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {calculateUnanswered() > 0
                                        ? `Bạn còn ${calculateUnanswered()} câu chưa làm. Bạn có chắc chắn muốn kết thúc bài thi không?`
                                        : "Bạn đã hoàn thành tất cả câu hỏi. Bạn có muốn nộp bài ngay?"}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Làm tiếp</AlertDialogCancel>
                                <AlertDialogAction onClick={handleFinish} disabled={isSubmitting}>
                                    {isSubmitting ? "Đang nộp..." : "Nộp bài"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

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
                {/* Main Content - Questions */}
                <div className="flex-1 max-w-[900px] mx-auto w-full">
                    {questions.map((q) => (
                        <div
                            key={q.id}
                            id={`question-${q.id}`}
                            className="bg-white rounded-xl border p-6 mb-6 shadow-sm scroll-mt-36"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                    Câu {q.orderNumber}
                                </Badge>
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500 h-8 px-2">
                                    <Flag className="h-4 w-4 mr-1" /> Báo lỗi
                                </Button>
                            </div>

                            <p className="text-base font-medium text-gray-900 mb-6 leading-relaxed">
                                {q.content}
                            </p>

                            <RadioGroup
                                value={answers[q.id]}
                                onValueChange={(val) => handleAnswerSelect(q.id, val)}
                                className="space-y-3"
                            >
                                {q.options.map(opt => (
                                    <div key={opt.label} className={cn(
                                        "flex items-center space-x-3 space-y-0 rounded-lg border p-3 cursor-pointer transition-all",
                                        answers[q.id] === opt.label
                                            ? "border-blue-500 bg-blue-50 shadow-sm"
                                            : "border-gray-200 hover:bg-gray-50"
                                    )}>
                                        <RadioGroupItem value={opt.label} id={`${q.id}-${opt.label}`} />
                                        <Label htmlFor={`${q.id}-${opt.label}`} className="flex-1 cursor-pointer font-normal text-base">
                                            <span className="font-bold mr-2 text-primary">{opt.label}.</span> {opt.content}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    ))}
                </div>

                {/* Desktop Question Palette */}
                <div className="hidden lg:block w-80 shrink-0 sticky top-[160px] self-start z-10">
                    <div className="bg-white rounded-xl border shadow-sm p-4 max-h-[calc(100vh-180px)] flex flex-col">
                        <QuestionPalette />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PracticeRoom;
