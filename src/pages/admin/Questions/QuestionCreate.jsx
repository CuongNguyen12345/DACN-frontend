import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle2, Circle, Sparkles, Send } from "lucide-react";
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
  const { basePath } = useAuth();

  // Khởi tạo State trống cho câu hỏi mới
  const [questionData, setQuestionData] = useState({
    content: "",
    subject: "Toán",
    difficulty: "Trung Bình",
    explanation: "",
    status: "Đã duyệt",
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
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: 'Xin chào! Hãy mô tả câu hỏi bạn muốn tạo, tôi sẽ giúp bạn soạn thảo nhanh chóng.',
      type: "text",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSendMessage = async () => {
    const userMessage = chatInput.trim();
    if (!userMessage || isChatLoading) return;

    const newMessages = [...chatMessages, { role: "user", content: userMessage, type: "text" }];
    setChatMessages(newMessages);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await api.post("/api/admin/ai/generate-questions", {
        message: `${userMessage}\n\nHãy trả về một câu hỏi trắc nghiệm theo định dạng JSON sau (và KHÔNG thêm bất kỳ text nào khác ngoài JSON):\n{\n  "question": "Nội dung câu hỏi",\n  "options": { "A": "Đáp án A", "B": "Đáp án B", "C": "Đáp án C", "D": "Đáp án D" },\n  "answer": "A",\n  "explanation": "Lời giải chi tiết",\n  "level": "Dễ | Trung Bình | Khó"\n}`,
      });

      const data = response.data;
      const aiText = data?.result ?? data?.message ?? "Không nhận được phản hồi.";

      let parsedQuestion = null;
      try {
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsedQuestion = JSON.parse(jsonMatch[0]);
      } catch (e) { }

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiText,
          type: parsedQuestion ? "question" : "text",
          parsed: parsedQuestion,
        },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Lỗi kết nối AI.", type: "text" },
      ]);
    } finally {
      setIsChatLoading(false);
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
      })),
    );
    setIsAIModalOpen(false); // Close modal after applying
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
            <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
              <DialogHeader className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white shrink-0">
                <DialogTitle className="flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5" />
                  AI Assistant
                </DialogTitle>
                <p className="text-indigo-100 text-xs">Mô tả câu hỏi bạn muốn tạo và AI sẽ giúp bạn.</p>
              </DialogHeader>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === "user" ? "bg-blue-100" : "bg-indigo-600"}`}>
                      {msg.role === "assistant" ? <Sparkles className="h-4 w-4 text-white" /> : <span className="text-[10px] font-bold text-blue-700">ME</span>}
                    </div>
                    <div className={`max-w-[85%] space-y-2`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm shadow-sm border ${msg.role === "user" ? "bg-blue-600 text-white border-blue-500 rounded-tr-none" : "bg-white text-gray-800 border-gray-100 rounded-tl-none"}`}>
                        {msg.type === "question" && msg.parsed ? (
                          <div className="space-y-4">
                            <p className="font-bold border-b pb-2">📝 {msg.parsed.question}</p>
                            <div className="grid grid-cols-1 gap-2">
                              {["A", "B", "C", "D"].map((letter) => (
                                <div key={letter} className={`p-2 rounded-lg text-xs border ${letter === msg.parsed.answer ? "bg-green-50 border-green-200 text-green-700 font-semibold" : "bg-gray-50 border-gray-100 text-gray-500"}`}>
                                  <span className="mr-2">{letter}.</span> {msg.parsed.options?.[letter]}
                                </div>
                              ))}
                            </div>
                            <Button onClick={() => handleApplyQuestion(msg.parsed)} size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2">
                              <CheckCircle2 className="h-4 w-4" /> Áp dụng vào Form
                            </Button>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isChatLoading && <div className="flex justify-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center animate-pulse"><Sparkles className="h-4 w-4 text-white" /></div>
                  <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex gap-1 items-center">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>}
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                <div className="flex gap-2 p-1 pl-4 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-500 transition-all bg-gray-50/50">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    placeholder="Nhập yêu cầu..."
                    className="flex-1 bg-transparent py-3 border-none focus:ring-0 outline-none text-sm resize-none"
                    rows="1"
                    disabled={isChatLoading}
                  />
                  <Button onClick={handleSendMessage} disabled={isChatLoading || !chatInput.trim()} className="h-10 w-10 mt-1 mr-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 shrink-0 p-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
            <h3 className="font-bold text-gray-900 border-b pb-4">Phân loại & Trạng thái</h3>

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

              <SelectGroup label="Trạng thái" icon="✅">
                <Select value={questionData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                  <SelectTrigger className="w-full rounded-xl border-gray-200 focus:ring-blue-500"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bản nháp">Bản nháp</SelectItem>
                    <SelectItem value="Đã duyệt">Đã duyệt</SelectItem>
                    <SelectItem value="Cần sửa lại">Cần sửa lại</SelectItem>
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
