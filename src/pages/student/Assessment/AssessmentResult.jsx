import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import {
  Trophy, Target, BookOpen, Clock, ChevronDown, ChevronUp,
  CheckCircle2, XCircle, Sparkles, ArrowRight, RotateCcw, Loader2,
  AlertTriangle, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Vòng tròn điểm số
const ScoreCircle = ({ score }) => {
  const isGood = score >= 7;
  const isGreat = score >= 9;
  const color = isGreat ? "#f59e0b" : isGood ? "#3b82f6" : "#10b981";
  const pct = Math.min(score / 10, 1);
  const r = 54;
  const circ = 2 * Math.PI * r;

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-800">{score.toFixed(1)}</span>
        <span className="text-sm text-slate-400 font-medium">/ 10</span>
      </div>
    </div>
  );
};

const AssessmentResult = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("assessment_result");
    if (!saved) {
      navigate("/assessment");
      return;
    }
    const parsed = JSON.parse(saved);
    setResult(parsed);

    // Gọi AI phân tích ngay
    analyzeWithAI(parsed);
  }, []);

  const analyzeWithAI = async (data) => {
    setIsAnalyzing(true);
    try {
      const res = await api.post("/api/assessment/analyze", {
        subject: data.subject,
        grade: data.grade,
        targetScore: data.targetScore,
        totalQuestions: data.totalQuestions,
        correctCount: data.correctCount,
        score: data.score,
        wrongQuestions: data.wrongQuestions,
      });
      setAiAnalysis(res.data);
    } catch {
      setAiAnalysis("Không thể kết nối AI lúc này. Vui lòng thử lại.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!result) return null;

  const { subject, grade, targetScore, score, correctCount, totalQuestions, timeTaken, wrongQuestions, questions, userAnswers } = result;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  const targetLabel = { "5-6": "5–6", "7-8": "7–8", "9-10": "9–10" }[targetScore] || targetScore;
  const isGoalReached = (
    (targetScore === "5-6" && score >= 5) ||
    (targetScore === "7-8" && score >= 7) ||
    (targetScore === "9-10" && score >= 9)
  );

  // Gom nhóm sai theo topic
  const topicFailMap = {};
  wrongQuestions.forEach((w) => {
    const t = w.topicName || "Không xác định";
    topicFailMap[t] = (topicFailMap[t] || 0) + 1;
  });
  const topicFails = Object.entries(topicFailMap).sort((a, b) => b[1] - a[1]);

  // Format AI text thành paragraphs
  const formatAI = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <h4 key={i} className="font-bold text-slate-800 mt-4 mb-2">{line.replace(/\*\*/g, "")}</h4>;
      }
      if (line.startsWith("**")) {
        const parts = line.split("**");
        return (
          <p key={i} className="text-sm text-slate-700 leading-relaxed mb-1">
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          </p>
        );
      }
      if (line.trim().startsWith("-") || line.trim().startsWith("•")) {
        return <li key={i} className="text-sm text-slate-700 ml-4 mb-1">{line.replace(/^[-•]\s*/, "")}</li>;
      }
      if (line.trim()) {
        return <p key={i} className="text-sm text-slate-700 leading-relaxed mb-2">{line}</p>;
      }
      return null;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ─── Header ─── */}
        <div className="text-center">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-3",
            isGoalReached ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          )}>
            {isGoalReached ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {isGoalReached ? "Bạn đã đạt mục tiêu 🎉" : "Chưa đạt mục tiêu — Cần cố gắng thêm!"}
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Kết quả kiểm tra năng lực</h1>
          <p className="text-slate-500">{subject} · {grade} · Mục tiêu {targetLabel} điểm</p>
        </div>

        {/* ─── Score card ─── */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-1">
              <ScoreCircle score={score} />
              <p className="text-center text-sm text-slate-500 mt-3 font-medium">Điểm của bạn</p>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              {[
                { icon: CheckCircle2, label: "Câu đúng", value: `${correctCount}/${totalQuestions}`, color: "text-emerald-600", bg: "bg-emerald-50" },
                { icon: XCircle, label: "Câu sai", value: `${wrongQuestions.length}/${totalQuestions}`, color: "text-rose-500", bg: "bg-rose-50" },
                { icon: Trophy, label: "Độ chính xác", value: `${accuracy}%`, color: "text-amber-600", bg: "bg-amber-50" },
                { icon: Clock, label: "Thời gian", value: timeTaken, color: "text-blue-600", bg: "bg-blue-50" },
              ].map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className={cn("rounded-2xl p-4", bg)}>
                  <Icon className={cn("h-5 w-5 mb-2", color)} />
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className={cn("text-xl font-bold", color)}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Điểm yếu theo chủ đề ─── */}
        {topicFails.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-rose-500" />
              Chủ đề còn yếu ({topicFails.length} chủ đề)
            </h3>
            <div className="space-y-3">
              {topicFails.map(([topic, cnt]) => {
                const pct = Math.round((cnt / wrongQuestions.length) * 100);
                return (
                  <div key={topic}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-700 font-medium">{topic}</span>
                      <span className="text-rose-500 font-bold">Sai {cnt} câu</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-rose-400 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── AI Phân tích ─── */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            Phân tích AI
          </h3>

          {isAnalyzing ? (
            <div className="flex items-center gap-3 text-indigo-600 py-4">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">AI đang phân tích kết quả của bạn...</span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-slate-700">
              <ul className="list-none p-0 m-0 space-y-1">
                {formatAI(aiAnalysis)}
              </ul>
            </div>
          )}
        </div>

        {/* ─── Xem lại bài làm ─── */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <button
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
          >
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Xem lại đáp án ({questions?.length} câu)
            </h3>
            {showReview ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
          </button>

          {showReview && (
            <div className="border-t border-slate-100 divide-y divide-slate-100">
              {questions?.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const correctOpt = q.options.find((o) => o.correct);
                const isRight = userAns && correctOpt && userAns === correctOpt.label;

                return (
                  <div key={q.id} className={cn("p-5", isRight ? "bg-white" : "bg-rose-50/40")}>
                    <div className="flex items-start gap-3">
                      {isRight
                        ? <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        : <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                      }
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="text-xs font-bold text-slate-400">Câu {idx + 1}</span>
                          {q.topicName && (
                            <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{q.topicName}</span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-slate-800 mb-3">{q.content}</p>
                        <div className="space-y-1.5">
                          {q.options.map((opt) => {
                            const isUserChoice = userAns === opt.label;
                            const isCorrect = opt.correct;
                            return (
                              <div key={opt.label} className={cn(
                                "flex items-center gap-2 text-sm px-3 py-2 rounded-lg",
                                isCorrect ? "bg-emerald-50 text-emerald-700 font-medium" :
                                  isUserChoice ? "bg-rose-50 text-rose-600 line-through" :
                                    "text-slate-600"
                              )}>
                                <span className="font-bold w-5 shrink-0">{opt.label}.</span>
                                <span>{opt.content}</span>
                                {isCorrect && <CheckCircle2 className="h-4 w-4 ml-auto shrink-0" />}
                                {isUserChoice && !isCorrect && <XCircle className="h-4 w-4 ml-auto shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── Actions ─── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigate("/assessment")}
            variant="outline"
            className="flex-1 gap-2 h-12 rounded-xl"
          >
            <RotateCcw className="h-4 w-4" />
            Kiểm tra lại
          </Button>
          <Button
            onClick={() => navigate("/practice")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2 h-12 rounded-xl"
          >
            <TrendingUp className="h-4 w-4" />
            Luyện đề thi
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResult;
