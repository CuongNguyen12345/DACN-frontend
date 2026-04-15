import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle2, Circle, Sparkles, Send, Type, BookOpen, Image as ImageIcon, Loader2, Lightbulb } from "lucide-react";
import api from "@/services/api";

// Import components từ shadcn/ui
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const QuestionCreate = () => {
  const navigate = useNavigate();

  // Khởi tạo State trống cho câu hỏi mới
  const [questionData, setQuestionData] = useState({
    content: "",
    subject: "Toán",
    difficulty: "Trung Bình",
    explanation: "",
    status: "Lớp 10",
  });

  // Khởi tạo 4 đáp án trống
  const [options, setOptions] = useState([
    { id: "A", text: "", isCorrect: false },
    { id: "B", text: "", isCorrect: false },
    { id: "C", text: "", isCorrect: false },
    { id: "D", text: "", isCorrect: false },
  ]);

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setQuestionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionTextChange = (id, newText) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, text: newText } : opt)),
    );
  };

  const handleSetCorrectOption = (id) => {
    setOptions((prev) =>
      prev.map((opt) => ({
        ...opt,
        isCorrect: opt.id === id,
      })),
    );
  };

  const handleSave = () => {
    if (!questionData.content.trim()) {
      alert("Vui lòng nhập nội dung đề bài!");
      return;
    }
    const hasCorrectAnswer = options.some((opt) => opt.isCorrect);
    if (!hasCorrectAnswer) {
      alert("Vui lòng chọn ít nhất một đáp án đúng!");
      return;
    }
    console.log("Dữ liệu câu hỏi mới tạo:", { ...questionData, options });
    alert("Tạo câu hỏi mới thành công!");
    navigate("/admin/questions");
  };

  // =============================================
  // AI CHAT LOGIC
  // =============================================
  const [prompt, setPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("topic");
  const [generatedQuestions, setGeneratedQuestions] = useState(null);

  const handleGenerate = async () => {
    const userMessage = prompt.trim();
    if (!userMessage || isAiLoading) return;

    setIsAiLoading(true);
    setGeneratedQuestions(null);

    try {
      const response = await api.post("/api/admin/ai/generate-questions", {
        message: `${userMessage}
        Hãy tạo các câu hỏi trắc nghiệm và trả về dưới dạng JSON array (KHÔNG thêm bất kỳ text nào ngoài JSON):
        [
          {
            "question": "Nội dung câu hỏi",
            "options": { "A": "Đáp án A", "B": "Đáp án B", "C": "Đáp án C", "D": "Đáp án D" },
            "answer": "A",
            "explanation": "Lời giải chi tiết",
            "subject": "Toán | Lý | Hóa | Anh",
            "class": "10 | 11 | 12",
            "level": "Dễ | Trung Bình | Khó"
          }
        ]
        Quy tắc xác định độ khó (BẮT BUỘC tuân thủ):
        1. Trước khi gán "level", phải xác định dạng câu hỏi thuộc loại nào:
          - Lý thuyết / nhận biết
          - Áp dụng trực tiếp công thức
          - Biến đổi công thức (1-2 bước)
          - Bài toán nhiều bước / kết hợp nhiều kiến thức
        2. Mapping level theo đúng quy tắc:
          - "Dễ": Lý thuyết hoặc áp dụng trực tiếp công thức
          - "Trung Bình": Biến đổi công thức, suy luận 1-2 bước
          - "Khó": Nhiều bước giải, kết hợp nhiều kiến thức
        3. Không được gán level ngẫu nhiên. Level phải phù hợp với bản chất câu hỏi.
        Yêu cầu:
        - Câu hỏi rõ ràng, chính xác
        - Đáp án đúng khớp với lời giải
        - Phân loại subject và class phù hợp
        - Không thêm bất kỳ văn bản nào ngoài JSON
        QUY TẮC ĐỊNH DẠNG (BẮT BUỘC):
        - Không sử dụng LaTeX hoặc ký hiệu dạng \frac, \sqrt, \alpha, $...$
        - Không dùng dấu backslash (\)
        - Viết công thức bằng text Unicode:
          + α thay cho \alpha
          + √ thay cho \sqrt
          + 1/3 thay cho \frac{1}{3}
        - Output phải hiển thị được trực tiếp trên giao diện web không cần render toán,
        `,
      });

      const data = response.data;
      console.log("Data nhận được từ AI:", data);
      const aiText = data?.result ?? data?.message ?? "[]";

      let parsedQuestions = [];
      try {
        let cleanedText = aiText;
        if (typeof aiText === 'string') {
          cleanedText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        }

        const arrayMatch = cleanedText.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          parsedQuestions = JSON.parse(arrayMatch[0]);
        } else {
          const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
          if (jsonMatch) parsedQuestions = [JSON.parse(jsonMatch[0])];
        }
      } catch (e) {
        console.error("Lỗi parse JSON:", e);
      }

      setGeneratedQuestions(parsedQuestions || []);
    } catch (err) {
      alert("Lỗi kết nối AI.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyQuestion = (parsed) => {
    if (!parsed) return;
    setQuestionData((prev) => ({
      ...prev,
      content: parsed.question ?? prev.content,
      explanation: parsed.explanation ?? prev.explanation,
    }));
    const letters = ["A", "B", "C", "D"];
    setOptions(
      letters.map((letter) => ({
        id: letter,
        text: parsed.options?.[letter] ?? "",
        isCorrect: letter === parsed.answer,
      }))
    );
    setIsAIModalOpen(false);
  };

  const handleAddAll = async () => {
    if (!generatedQuestions || generatedQuestions.length === 0) return;

    try {
      const firstQ = generatedQuestions[0];
      const payloadSubject = firstQ.subject || questionData.subject;
      const payloadGrade = firstQ.class ? `Lớp ${firstQ.class}` : questionData.status;

      const payload = {
        subject: payloadSubject,
        grade: payloadGrade,
        questions: generatedQuestions.map((q) => {
          const optLetters = ["A", "B", "C", "D"];
          const options = optLetters.map((l) => ({
            content: q.options?.[l] || "",
            isCorrect: q.answer === l,
          }));

          return {
            content: q.question,
            explanation: q.explanation || "",
            level: q.level || "Dễ",
            options: options,
          };
        }),
      };

      await api.post("/api/admin/questions", payload);
      alert(`Đã thêm thành công ${generatedQuestions.length} câu hỏi vào ngân hàng!`);
      setIsAIModalOpen(false);
      setGeneratedQuestions(null);
      setPrompt("");
      navigate("/admin/questions"); // Chuyển về trang danh sách
    } catch (error) {
      console.error("Lưu câu hỏi thất bại:", error);
      alert("Đã xảy ra lỗi khi lưu danh sách câu hỏi.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/questions")}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-all border border-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Tạo câu hỏi mới
            </h2>
            <p className="text-sm text-gray-500">Soạn thảo câu hỏi trắc nghiệm chất lượng cao.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* AI MODAL TRIGGER */}
          <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100">
                <Sparkles className="h-4 w-4" />
                Soạn bằng AI
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-6 overflow-hidden rounded-2xl border-none shadow-2xl bg-white">
              <DialogHeader className="flex flex-row justify-between items-center border-b pb-4 mb-4 shrink-0">
                <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
                  <Sparkles className="h-6 w-6 text-indigo-600" />
                  Tạo câu hỏi với AI
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                <div>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Tạo câu hỏi với AI..."
                    className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none resize-none text-gray-700"
                    disabled={isAiLoading}
                  />
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500 px-2">
                    <span className="flex items-center gap-1">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      Nhập tên chủ đề để AI tạo câu hỏi về chủ đề đó.
                    </span>
                    <span>{prompt.length}/1000</span>
                  </div>
                </div>

                {!isAiLoading && !generatedQuestions && (
                  <Button
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-semibold rounded-xl shadow-md gap-2 transition-all shadow-indigo-500/20"
                  >
                    <Sparkles className="h-5 w-5" />
                    Tạo câu hỏi với AI
                  </Button>
                )}

                {isAiLoading && (
                  <div className="space-y-4">
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-8 flex flex-col items-center justify-center space-y-4">
                      <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2.5 h-2.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        <div className="w-2.5 h-2.5 bg-indigo-200 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="font-bold text-indigo-600 flex items-center justify-center gap-2">
                          <Sparkles className="h-4 w-4 text-indigo-400" /> Đang xử lý yêu cầu...
                        </p>
                        <p className="text-xs text-gray-400">AI đang trực tiếp xử lý...</p>
                      </div>
                    </div>
                    <Button
                      disabled
                      className="w-full bg-indigo-200 text-indigo-700 py-6 text-lg font-semibold rounded-xl gap-2"
                    >
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Đang tạo...
                    </Button>
                  </div>
                )}

                {generatedQuestions && generatedQuestions.length > 0 && (
                  <div className="space-y-6 pt-4 border-t border-gray-100">
                    <h3 className="font-bold text-gray-800 text-lg">Kết quả ({generatedQuestions.length} câu hỏi)</h3>

                    <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
                      {generatedQuestions.map((q, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                          <div className="flex gap-3">
                            <Circle className="h-5 w-5 text-gray-300 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-gray-900">{q.question}</p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {q.subject || questionData.subject} - Lớp {q.class || questionData.status.replace("Lớp ", "")}
                                </span>
                                <span className="text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full">
                                  {q.level || "Dễ"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-2 pl-8">
                            {["A", "B", "C", "D"].map((letter) => (
                              <div key={letter} className={`flex items-center gap-2 p-2.5 rounded-lg text-sm border transition-colors ${letter === q.answer ? "bg-green-50 border-green-200 text-green-700 font-medium" : "bg-gray-50 border-gray-100 text-gray-600"}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${letter === q.answer ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                                  {letter}
                                </div>
                                <span>{q.options?.[letter]}</span>
                                {letter === q.answer && <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />}
                              </div>
                            ))}
                          </div>

                          {q.explanation && (
                            <div className="pl-8 pt-2">
                              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800">
                                <span className="font-bold">✨ Giải thích:</span> {q.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {generatedQuestions && generatedQuestions.length > 0 && (
                <div className="pt-4 border-t border-gray-100 mt-4 shrink-0">
                  <Button
                    onClick={handleAddAll}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-semibold rounded-xl shadow-md gap-2 transition-all shadow-indigo-500/20"
                  >
                    Thêm tất cả
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Button variant="ghost" onClick={() => navigate("/admin/questions")} className="text-gray-500 hover:text-gray-700">Hủy</Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6">
            <Save className="h-4 w-4" />
            Lưu câu hỏi
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ======================== CỘT CHÍNH ======================== */}
        <div className="lg:col-span-2 space-y-6">
          <CardLayout title="Nội dung câu hỏi" subtitle="Bắt buộc">
            <textarea
              name="content"
              value={questionData.content}
              onChange={handleChange}
              rows="4"
              placeholder="Nhập đề bài vào đây..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y min-h-[120px]"
            />
          </CardLayout>

          <CardLayout title="Các phương án đáp án" subtitle="Chọn ít nhất một đáp án đúng">
            <div className="grid grid-cols-1 gap-4 mt-2">
              {options.map((opt) => (
                <div key={opt.id} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${opt.isCorrect ? "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300" : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"}`}>
                  <button onClick={() => handleSetCorrectOption(opt.id)} className={`mt-2 shrink-0 transition-transform active:scale-95 ${opt.isCorrect ? "text-emerald-600" : "text-gray-300 hover:text-gray-400"}`}>
                    {opt.isCorrect ? <CheckCircle2 className="h-7 w-7" /> : <Circle className="h-7 w-7" />}
                  </button>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-400">Phương án {opt.id}</span>
                      {opt.isCorrect && <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Đáp án đúng</span>}
                    </div>
                    <textarea
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(opt.id, e.target.value)}
                      rows="2"
                      placeholder={`Nội dung đáp án ${opt.id}...`}
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-700 outline-none resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardLayout>

          <CardLayout title="Lời giải chi tiết" subtitle="Không bắt buộc">
            <textarea
              name="explanation"
              value={questionData.explanation}
              onChange={handleChange}
              rows="3"
              placeholder="Giải thích tại sao đáp án đó lại đúng..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y min-h-[100px]"
            />
          </CardLayout>
        </div>

        {/* ======================== CỘT PHỤ (SETTING) ======================== */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-900 border-b pb-4">Phân loại & Lớp</h3>

            <div className="space-y-4">
              <SelectGroup label="Môn học" icon="📚">
                <Select value={questionData.subject} onValueChange={(v) => handleSelectChange("subject", v)}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 focus:ring-blue-500"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Toán", "Vật Lý", "Hóa Học", "Tiếng Anh", "Ngữ Văn"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </SelectGroup>

              <SelectGroup label="Độ khó" icon="⚡">
                <Select value={questionData.difficulty} onValueChange={(v) => handleSelectChange("difficulty", v)}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 focus:ring-blue-500"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Dễ", "Trung Bình", "Khó"].map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </SelectGroup>

              <SelectGroup label="Lớp" icon="🏫">
                <Select value={questionData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 focus:ring-blue-500"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lớp 10">Lớp 10</SelectItem>
                    <SelectItem value="Lớp 11">Lớp 11</SelectItem>
                    <SelectItem value="Lớp 12">Lớp 12</SelectItem>
                  </SelectContent>
                </Select>
              </SelectGroup>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 space-y-3">
            <h4 className="text-sm font-bold text-blue-900">💡 Hướng dẫn nhanh</h4>
            <ul className="text-xs text-blue-700/80 space-y-2 list-none p-0">
              <li className="flex gap-2"><span>1.</span> <span>Sử dụng AI để sinh câu hỏi giúp tiết kiệm thời gian tới 80%.</span></li>
              <li className="flex gap-2"><span>2.</span> <span>Đảm bảo lời giải chi tiết rõ ràng để hỗ trợ học sinh học tập.</span></li>
              <li className="flex gap-2"><span>3.</span> <span>Luôn gắn thẻ môn học để quản lý ngân hàng câu hỏi dễ dàng.</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const CardLayout = ({ title, subtitle, children }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
    <div className="flex flex-col">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 font-medium italic">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const SelectGroup = ({ label, icon, children }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
      <span className="text-xs">{icon}</span> {label}
    </label>
    {children}
  </div>
);

export default QuestionCreate;
