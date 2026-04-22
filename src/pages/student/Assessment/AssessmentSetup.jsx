import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target, GraduationCap, ArrowRight, Sparkles, ChevronRight } from "lucide-react";

const SUBJECTS = ["Toán", "Vật Lý", "Hóa Học", "Tiếng Anh"];
const GRADES = ["Lớp 10", "Lớp 11", "Lớp 12"];
const SCORE_TARGETS = [
  {
    id: "5-6",
    label: "5 – 6 điểm",
    desc: "Mức cơ bản — Nắm chắc kiến thức nền",
    color: "from-emerald-400 to-teal-500",
    badge: "Cơ bản",
    badgeBg: "bg-emerald-100 text-emerald-700",
    ratio: "80% Dễ · 20% Trung bình",
  },
  {
    id: "7-8",
    label: "7 – 8 điểm",
    desc: "Mức khá — Hiểu sâu và vận dụng tốt",
    color: "from-blue-400 to-indigo-500",
    badge: "Khá",
    badgeBg: "bg-blue-100 text-blue-700",
    ratio: "40% Dễ · 40% TB · 20% Khó",
  },
  {
    id: "9-10",
    label: "9 – 10 điểm",
    desc: "Mức xuất sắc — Chinh phục điểm cao",
    color: "from-amber-400 to-orange-500",
    badge: "Xuất sắc",
    badgeBg: "bg-amber-100 text-amber-700",
    ratio: "20% Dễ · 40% TB · 40% Khó",
  },
];

const AssessmentSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: chọn môn+lớp, 2: chọn mục tiêu
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [targetScore, setTargetScore] = useState("");

  const handleStart = () => {
    if (!subject || !grade || !targetScore) return;
    navigate("/assessment/room", {
      state: { subject, grade, targetScore },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 shadow-sm px-4 py-1.5 rounded-full text-sm font-medium text-blue-600 mb-4">
            <Sparkles className="h-4 w-4" />
            Được hỗ trợ bởi AI
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Kiểm tra năng lực
          </h1>
          <p className="text-slate-500 text-lg">
            Hệ thống sẽ tự động chọn {" "}
            <span className="text-blue-600 font-semibold">30 câu hỏi</span>
            {" "} phù hợp với mục tiêu của bạn và phân tích điểm yếu sau khi làm bài.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                step >= s
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-white border-2 border-slate-200 text-slate-400"
              }`}>
                {s}
              </div>
              {s < 2 && (
                <div className={`w-16 h-0.5 transition-all duration-300 ${step > s ? "bg-blue-600" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

          {/* ─── STEP 1: Môn + Lớp ─── */}
          {step === 1 && (
            <div className="p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Chọn môn học
                </h2>
                <p className="text-sm text-slate-500 mb-4">Bạn muốn kiểm tra môn nào?</p>
                <div className="grid grid-cols-2 gap-3">
                  {SUBJECTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSubject(s)}
                      className={`py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all ${
                        subject === s
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  Chọn lớp
                </h2>
                <p className="text-sm text-slate-500 mb-4">Bạn đang học lớp mấy?</p>
                <div className="grid grid-cols-3 gap-3">
                  {GRADES.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGrade(g)}
                      className={`py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all ${
                        grade === g
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!subject || !grade}
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
              >
                Tiếp theo
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* ─── STEP 2: Mục tiêu điểm ─── */}
          {step === 2 && (
            <div className="p-8 space-y-5">
              <div>
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1 transition-colors"
                >
                  ← Quay lại
                </button>
                <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Mục tiêu điểm số
                </h2>
                <p className="text-sm text-slate-500 mb-1">
                  Bạn đang ôn thi <span className="font-semibold text-slate-700">{subject} — {grade}</span>
                </p>
                <p className="text-sm text-slate-500 mb-5">Hệ thống sẽ tự điều chỉnh tỉ lệ khó/dễ phù hợp.</p>

                <div className="space-y-3">
                  {SCORE_TARGETS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTargetScore(t.id)}
                      className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                        targetScore === t.id
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center shrink-0`}>
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900">{t.label}</span>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${t.badgeBg}`}>
                              {t.badge}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-0.5">{t.desc}</p>
                          <p className="text-xs text-slate-400 mt-1 font-medium">{t.ratio}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                          targetScore === t.id ? "border-blue-500 bg-blue-500" : "border-slate-300"
                        }`}>
                          {targetScore === t.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={!targetScore}
                onClick={handleStart}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white text-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
              >
                <Sparkles className="h-5 w-5" />
                Bắt đầu kiểm tra
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Bài kiểm tra gồm 30 câu · Không giới hạn thời gian · Kết quả được phân tích bởi AI
        </p>
      </div>
    </div>
  );
};

export default AssessmentSetup;
