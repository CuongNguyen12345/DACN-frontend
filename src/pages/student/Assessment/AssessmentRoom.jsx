import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "@/services/api";
import {
  Clock, AlertCircle, CheckCircle2, Flag, Menu, Sparkles, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const AssessmentRoom = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);

  // Redirect nếu không có state
  useEffect(() => {
    if (!state?.subject) {
      navigate("/assessment");
    }
  }, [state, navigate]);

  // Fetch câu hỏi từ Backend
  const fetchQuestions = useCallback(async () => {
    if (!state?.subject) return;
    setIsLoading(true);
    try {
      const res = await api.get("/api/assessment/questions", {
        params: {
          subject: state.subject,
          grade: state.grade,
          targetScore: state.targetScore,
        },
      });
      setQuestions(res.data.questions || []);
    } catch (err) {
      console.error("Lỗi tải câu hỏi:", err);
      setError("Không thể tải câu hỏi. Vui lòng kiểm tra lại.");
    } finally {
      setIsLoading(false);
    }
  }, [state]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Đếm thời gian làm bài (đếm lên, không giới hạn)
  useEffect(() => {
    if (!isLoading) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isLoading]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId, label) => {
    setAnswers((prev) => ({ ...prev, [questionId]: label }));
  };

  const answered = Object.keys(answers).length;
  const unanswered = questions.length - answered;

  const handleFinish = () => {
    clearInterval(timerRef.current);

    // Tính kết quả
    let correctCount = 0;
    const wrongQuestions = [];

    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      const correctOpt = q.options.find((o) => o.correct);
      const isCorrect = userAnswer && correctOpt && userAnswer === correctOpt.label;

      if (isCorrect) {
        correctCount++;
      } else {
        wrongQuestions.push({
          questionId: q.id,
          content: q.content,
          topicName: q.topicName,
          level: q.level,
          userAnswer: userAnswer || null,
          correctAnswer: correctOpt?.label || null,
        });
      }
    });

    const score = Number(((correctCount / questions.length) * 10).toFixed(1));

    // Lưu tạm vào localStorage
    const resultData = {
      subject: state.subject,
      grade: state.grade,
      targetScore: state.targetScore,
      totalQuestions: questions.length,
      correctCount,
      score,
      timeTaken: formatTime(elapsedSeconds),
      wrongQuestions,
      questions,
      userAnswers: answers,
    };
    localStorage.setItem("assessment_result", JSON.stringify(resultData));
    navigate("/assessment/result");
  };

  const scrollToQuestion = (id) => {
    document.getElementById(`q-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const QuestionPalette = () => (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h4 className="font-semibold text-slate-800 mb-1">Bảng câu hỏi</h4>
        <p className="text-xs text-slate-500">{answered}/{questions.length} đã trả lời</p>
      </div>
      <ScrollArea className="flex-1 pr-2">
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q) => (
            <button
              key={q.id}
              onClick={() => scrollToQuestion(q.id)}
              className={cn(
                "w-full h-8 rounded-lg text-xs font-semibold transition-all",
                answers[q.id]
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              )}
            >
              {q.orderNumber}
            </button>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-4 pt-4 border-t space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-4 h-4 rounded bg-blue-600" /> Đã trả lời
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-4 h-4 rounded bg-slate-100 border border-slate-200" /> Chưa làm
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
            <Sparkles className="h-8 w-8 text-blue-500 animate-pulse" />
          </div>
          <p className="text-slate-600 font-medium">Đang chọn câu hỏi phù hợp với bạn...</p>
          <p className="text-sm text-slate-400">Hệ thống đang phân tích mục tiêu và chọn đề thông minh</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
          <p className="text-slate-700 font-medium">{error}</p>
          <Button onClick={() => navigate("/assessment")} variant="outline">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/30">
      {/* Header */}
      <header className="sticky top-16 z-40 bg-white border-b shadow-sm px-4 md:px-8 py-3 flex justify-between items-center">
        <div>
          <h1 className="font-bold text-lg text-slate-800">
            Kiểm tra năng lực — {state?.subject}
          </h1>
          <p className="text-xs text-slate-400">{state?.grade} · Mục tiêu {state?.targetScore} điểm</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Đếm thời gian */}
          <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-mono text-sm font-semibold">
            <Clock className="h-4 w-4" />
            {formatTime(elapsedSeconds)}
          </div>

          {/* Nút nộp bài */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">Nộp bài</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận nộp bài</AlertDialogTitle>
                <AlertDialogDescription>
                  {unanswered > 0
                    ? `Bạn còn ${unanswered} câu chưa trả lời. Các câu này sẽ bị tính sai.`
                    : "Bạn đã hoàn thành tất cả câu hỏi. Sẵn sàng nộp bài?"}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Làm tiếp</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleFinish}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Nộp bài & Xem phân tích
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Mobile palette */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="pt-4 h-full">
                <QuestionPalette />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex-1 container max-w-[1400px] mx-auto p-4 md:p-6 flex gap-8">
        {/* Câu hỏi */}
        <div className="flex-1 max-w-[900px] mx-auto w-full space-y-5">
          {questions.map((q) => (
            <div
              key={q.id}
              id={`q-${q.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm scroll-mt-36"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                    Câu {q.orderNumber}
                  </Badge>
                  {q.topicName && (
                    <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                      {q.topicName}
                    </span>
                  )}
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    q.level === "Dễ" && "bg-emerald-50 text-emerald-600",
                    q.level === "Trung bình" && "bg-amber-50 text-amber-600",
                    q.level === "Khó" && "bg-rose-50 text-rose-600",
                  )}>
                    {q.level}
                  </span>
                </div>
                {answers[q.id] && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                )}
              </div>

              <p className="text-base font-medium text-slate-900 mb-5 leading-relaxed">
                {q.content}
              </p>

              <RadioGroup
                value={answers[q.id]}
                onValueChange={(val) => handleAnswerSelect(q.id, val)}
                className="space-y-2"
              >
                {q.options.map((opt) => (
                  <div
                    key={opt.label}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer transition-all",
                      answers[q.id] === opt.label
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    <RadioGroupItem value={opt.label} id={`${q.id}-${opt.label}`} />
                    <Label
                      htmlFor={`${q.id}-${opt.label}`}
                      className="flex-1 cursor-pointer font-normal text-sm"
                    >
                      <span className="font-bold text-blue-600 mr-2">{opt.label}.</span>
                      {opt.content}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          {/* Nộp bài cuối trang */}
          <div className="flex justify-center pt-4 pb-10">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-10 text-base shadow-lg shadow-blue-200">
                  Nộp bài & Xem phân tích AI
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận nộp bài</AlertDialogTitle>
                  <AlertDialogDescription>
                    {unanswered > 0
                      ? `Bạn còn ${unanswered} câu chưa trả lời.`
                      : "Bạn đã hoàn thành. Sẵn sàng nộp bài?"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Làm tiếp</AlertDialogCancel>
                  <AlertDialogAction onClick={handleFinish} className="bg-blue-600 hover:bg-blue-700">
                    Nộp bài
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Sidebar palette */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32 bg-white rounded-2xl border shadow-sm p-5 max-h-[calc(100vh-140px)] flex flex-col">
            <QuestionPalette />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentRoom;
