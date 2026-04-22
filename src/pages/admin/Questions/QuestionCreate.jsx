import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Circle,
  Sparkles,
  ChevronRight,
  Loader2,
  Lightbulb,
  Upload,
  Info,
  Download,
  X,
  FileText,
  Trash2,
  HelpCircle,
  PlusCircle,
  Paperclip,
} from "lucide-react";
import * as XLSX from "xlsx";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
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
    status: "Lớp 10",
    topicName: "",
  });

  // Topic state
  const [topics, setTopics] = useState([]);

  const fetchTopics = useCallback(async (subject, grade) => {
    try {
      const res = await api.get("/api/admin/topics", {
        params: { subject, grade },
      });
      setTopics(res.data || []);
    } catch {
      setTopics([]);
    }
  }, []);

  useEffect(() => {
    fetchTopics(questionData.subject, questionData.status);
  }, [questionData.subject, questionData.status, fetchTopics]);

  // Khởi tạo 4 đáp án trống
  const [options, setOptions] = useState([
    { id: "A", text: "", isCorrect: false },
    { id: "B", text: "", isCorrect: false },
    { id: "C", text: "", isCorrect: false },
    { id: "D", text: "", isCorrect: false },
  ]);

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);
  const [importSettings, setImportSettings] = useState({
    subject: "Toán",
    grade: "Lớp 10",
  });

  // Batch Questions State
  const [batchQuestions, setBatchQuestions] = useState([
    {
      id: Date.now(),
      content: "",
      a: "",
      b: "",
      c: "",
      d: "",
      correct: "A",
      explanation: "",
      level: "Trung Bình",
    },
  ]);

  const handleAddBatchRow = () => {
    setBatchQuestions((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: "",
        a: "",
        b: "",
        c: "",
        d: "",
        correct: "A",
        explanation: "",
        level: "Trung Bình",
      },
    ]);
  };

  const handleRemoveBatchRow = (id) => {
    if (batchQuestions.length > 1) {
      setBatchQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const handleUpdateBatchRow = (id, field, value) => {
    setBatchQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  };

  const handleSaveBatch = async () => {
    const validQuestions = batchQuestions.filter(
      (q) => q.content.trim() !== "",
    );
    if (validQuestions.length === 0) {
      alert("Vui lòng nhập ít nhất một câu hỏi có nội dung!");
      return;
    }

    try {
      const payload = {
        subject: importSettings.subject,
        grade: importSettings.grade,
        questions: validQuestions.map((q) => ({
          content: q.content,
          options: [
            { content: q.a, isCorrect: q.correct === "A" },
            { content: q.b, isCorrect: q.correct === "B" },
            { content: q.c, isCorrect: q.correct === "C" },
            { content: q.d, isCorrect: q.correct === "D" },
          ],
          explanation: q.explanation,
          level: q.level || "Trung Bình",
        })),
      };

      await api.post("/api/admin/questions", payload);
      alert(
        `Đã thêm thành công ${validQuestions.length} câu hỏi vào ngân hàng!`,
      );
      setIsImportModalOpen(false);
      navigate("/admin/questions");
    } catch (error) {
      console.error("Lưu batch thất bại:", error);
      alert("Đã xảy ra lỗi khi lưu danh sách câu hỏi.");
    }
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      // Skip header row and map data
      // Cột: Nội dung | A | B | C | D | Đúng | Độ khó | Giải thích
      const importedQuestions = data
        .slice(1)
        .map((row, index) => {
          if (!row[0]) return null; // Skip empty rows
          const rawLevel = (row[6] || "").toString().trim();
          const levelMap = {
            de: "Dễ",
            dễ: "Dễ",
            easy: "Dễ",
            "trung binh": "Trung Bình",
            "trung bình": "Trung Bình",
            medium: "Trung Bình",
            kho: "Khó",
            khó: "Khó",
            hard: "Khó",
          };
          const level =
            levelMap[rawLevel.toLowerCase()] || rawLevel || "Trung Bình";
          return {
            id: Date.now() + index,
            content: row[0] || "",
            a: row[1] || "",
            b: row[2] || "",
            c: row[3] || "",
            d: row[4] || "",
            correct: (row[5] || "A").toString().toUpperCase().trim(),
            level,
            explanation: row[7] || "",
          };
        })
        .filter((q) => q !== null);

      if (importedQuestions.length > 0) {
        setBatchQuestions((prev) => {
          // If first row is empty, replace it, otherwise append
          const firstRowEmpty = prev.length === 1 && !prev[0].content;
          return firstRowEmpty
            ? importedQuestions
            : [...prev, ...importedQuestions];
        });
        alert(`Đã nhập thành công ${importedQuestions.length} câu hỏi!`);
      }
    };
    reader.readAsBinaryString(file);
    // Reset input
    e.target.value = null;
  };

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

  const handleSave = async () => {
    if (!questionData.content.trim()) {
      alert("Vui lòng nhập nội dung đề bài!");
      return;
    }
    const hasCorrectAnswer = options.some((opt) => opt.isCorrect);
    if (!hasCorrectAnswer) {
      alert("Vui lòng chọn ít nhất một đáp án đúng!");
      return;
    }

    try {
      const payload = {
        subject: questionData.subject,
        grade: questionData.status,
        questions: [
          {
            content: questionData.content,
            explanation: questionData.explanation,
            level: questionData.difficulty,
            topicName: questionData.topicName || "",
            options: options.map((opt) => ({
              content: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        ],
      };

      await api.post("/api/admin/questions", payload);
      alert("Tạo câu hỏi mới thành công!");
      navigate(`${basePath}/questions`);
    } catch (error) {
      console.error("Lưu câu hỏi thất bại:", error);
      alert("Đã xảy ra lỗi khi lưu câu hỏi.");
    }
  };

  // =============================================
  // AI CHAT LOGIC
  // =============================================
  const [prompt, setPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState(null);

  // File attachment state for AI chat
  const [attachedFile, setAttachedFile] = useState(null);
  const [attachedFileContent, setAttachedFileContent] = useState("");
  const [isReadingFile, setIsReadingFile] = useState(false);

  // Handle file attachment for AI
  const handleFileAttach = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(txt|pdf|doc|docx)$/i)
    ) {
      alert("Chỉ hỗ trợ file TXT, PDF, DOC, DOCX!");
      e.target.value = null;
      return;
    }
    if (file.size > maxSize) {
      alert("File quá lớn! Tối đa 5MB.");
      e.target.value = null;
      return;
    }

    setAttachedFile(file);
    setIsReadingFile(true);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target.result;
      // Truncate if too long to avoid exceeding token limits
      const truncated =
        content.length > 8000
          ? content.slice(0, 8000) + "\n...(nội dung bị cắt ngắn)"
          : content;
      setAttachedFileContent(truncated);
      setIsReadingFile(false);
    };
    reader.onerror = () => {
      alert("Không thể đọc file. Vui lòng thử lại!");
      setAttachedFile(null);
      setIsReadingFile(false);
    };

    // Read as text (works for TXT; PDF/DOCX will give raw bytes but we try best-effort)
    if (file.type === "text/plain" || file.name.match(/\.txt$/i)) {
      reader.readAsText(file, "UTF-8");
    } else {
      // For PDF/DOCX attempt reading as text (limited support)
      reader.readAsText(file, "UTF-8");
    }

    e.target.value = null;
  };

  const handleRemoveAttachedFile = () => {
    setAttachedFile(null);
    setAttachedFileContent("");
  };

  const handleGenerate = async () => {
    const userMessage = prompt.trim();
    if ((!userMessage && !attachedFile) || isAiLoading) return;

    setIsAiLoading(true);
    setGeneratedQuestions(null);

    try {
      // Build message with optional file content
      const fileContext = attachedFileContent
        ? `\n\n--- NỘI DUNG FILE: ${attachedFile?.name} ---\n${attachedFileContent}\n--- KẾT THÚC FILE ---\n`
        : "";

      const response = await api.post("/api/admin/ai/generate-questions", {
        message: `${userMessage}${fileContext}
      Hãy tạo các câu hỏi trắc nghiệm và trả về dưới dạng JSON array (KHÔNG thêm bất kỳ text nào ngoài JSON):
      [
        {
          "question": "Nội dung câu hỏi",
          "options": { "A": "Đáp án A", "B": "Đáp án B", "C": "Đáp án C", "D": "Đáp án D" },
          "answer": "A",
          "explanation": "Lời giải chi tiết",
          "subject": "Toán | Lý | Hóa | Anh",
          "topic": "Tên chương cụ thể",
          "class": "10 | 11 | 12",
          "level": "Dễ | Trung Bình | Khó"
        }
      ]
      
      RÀNG BUỘC TOPIC (BẮT BUỘC):
      Trường "topic" CHỈ ĐƯỢC PHÉP chọn một trong các giá trị sau đây tùy theo môn học:
      - Nếu môn Toán: [Mệnh đề và Tập hợp, Bất phương trình và Hệ bất phương trình, Hệ thức lượng trong tam giác, Vectơ và các phép toán, Thống kê cơ bản, Hàm số và Đồ thị, Phương pháp tọa độ trong mặt phẳng, Đại số tổ hợp và Xác suất, Lượng giác, Dãy số và Cấp số, Giới hạn và Liên tục, Hình học không gian, Mũ và Lôgarit, Đạo hàm, Khảo sát hàm số, Nguyên hàm và Tích phân, Tọa độ Oxyz]
      - Nếu môn Lý: [Động học, Động lực học, Năng lượng và Công, Động lượng, Chuyển động tròn, Dao động cơ, Sóng cơ và Sóng điện từ, Điện trường, Dòng điện, Vật lí nhiệt, Từ trường và Cảm ứng điện từ, Vật lí hạt nhân]
      - Nếu môn Hóa: [Cấu tạo nguyên tử, Liên kết hóa học, Phản ứng Oxi hóa - Khử, Tốc độ phản ứng, Halogen, Cân bằng hóa học, Nitrogen và Sulfur, Đại cương hữu cơ, Hydrocarbon, Dẫn xuất Halogen - Alcohol - Phenol, Carbonyl và Carboxylic acid, Ester - Lipid - Carbohydrate, Polyme, Amine - Amino acid - Protein, Điện hóa học, Đại cương kim loại]

      QUY TẮC XÁC ĐỊNH ĐỘ KHÓ:
      1. Mapping level theo đúng bản chất:
        - "Dễ": Nhận biết lý thuyết hoặc áp dụng 1 công thức cơ bản.
        - "Trung Bình": Thông hiểu, suy luận 1-2 bước hoặc biến đổi công thức.
        - "Khó": Vận dụng cao, kết hợp nhiều mảng kiến thức.

      QUY TẮC ĐỊNH DẠNG (BẮT BUỘC):
      - Tuyệt đối không sử dụng LaTeX ($...$, \frac, \sqrt).
      - Sử dụng ký tự Unicode trực tiếp: α, β, √, π, ±, x², x³, 1/2, 3/4...
      - Output phải hiển thị được trực tiếp trên giao diện web không cần thư viện render toán.
      `,
      });

      const data = response.data;
      console.log("Data nhận được từ AI:", data);
      const aiText = data?.result ?? data?.message ?? "[]";

      let parsedQuestions = [];
      try {
        let cleanedText = aiText;
        if (typeof aiText === "string") {
          cleanedText = aiText
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
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
    } catch {
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
      })),
    );
    setIsAIModalOpen(false);
  };

  const handleAddAll = async () => {
    if (!generatedQuestions || generatedQuestions.length === 0) return;

    try {
      const firstQ = generatedQuestions[0];
      const payloadSubject = firstQ.subject || questionData.subject;
      const payloadGrade = firstQ.class
        ? `Lớp ${firstQ.class}`
        : questionData.status;

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
            topicName: q.topic || "",
            options: options,
          };
        }),
      };

      await api.post("/api/admin/questions", payload);
      alert(
        `Đã thêm thành công ${generatedQuestions.length} câu hỏi vào ngân hàng!`,
      );
      setIsAIModalOpen(false);
      setGeneratedQuestions(null);
      setPrompt("");
      navigate("/admin/questions"); // Chuyển về trang danh sách
    } catch (error) {
      console.error("Lưu câu hỏi thất bại:", error);
      alert("Đã xảy ra lỗi khi lưu danh sách câu hỏi.");
    }
  };

  // Helper Components
  const CardLayout = ({ title, subtitle, children }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
      <div className="flex flex-col">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {subtitle && (
          <p className="text-xs text-gray-400 font-medium italic">{subtitle}</p>
        )}
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
            <p className="text-sm text-gray-500">
              Soạn thảo câu hỏi trắc nghiệm chất lượng cao.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* IMPORT MODAL */}
          <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100 gap-2"
              >
                <Upload className="h-4 w-4" /> Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] w-[1400px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-white max-h-[90vh] flex flex-col">
              {/* Header logic from image */}
              <div className="p-6 border-b flex flex-wrap items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    Thêm câu hỏi hàng loạt
                  </h3>
                  <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 px-3">
                    <span className="text-sm font-bold text-gray-600">
                      Môn:
                    </span>
                    <Select
                      value={importSettings.subject}
                      onValueChange={(v) =>
                        setImportSettings((prev) => ({ ...prev, subject: v }))
                      }
                    >
                      <SelectTrigger className="w-[140px] h-9 rounded-xl border-none bg-white shadow-sm font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Toán", "Vật Lý", "Hóa Học", "Tiếng Anh"].map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="w-px h-5 bg-gray-200" />
                    <span className="text-sm font-bold text-gray-600">
                      Lớp:
                    </span>
                    <Select
                      value={importSettings.grade}
                      onValueChange={(v) =>
                        setImportSettings((prev) => ({ ...prev, grade: v }))
                      }
                    >
                      <SelectTrigger className="w-[120px] h-9 rounded-xl border-none bg-white shadow-sm font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["Lớp 10", "Lớp 11", "Lớp 12"].map((g) => (
                          <SelectItem key={g} value={g}>
                            {g}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Nhập file button with dropdown feel */}
                  <div className="relative group">
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-5 py-2.5 flex items-center gap-2 h-11 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
                      <Upload className="h-4 w-4" /> Nhập file{" "}
                      <ChevronRight className="h-4 w-4 rotate-90" />
                    </Button>
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept=".xlsx, .xls, .csv"
                      onChange={handleImportFile}
                    />
                  </div>

                  {/* Hướng dẫn button */}
                  <Button
                    variant="outline"
                    className="rounded-full h-11 px-5 font-bold border-gray-200 text-gray-600 gap-2 hover:bg-gray-50 shadow-sm"
                    onClick={() => setIsInstructionOpen(true)}
                  >
                    <HelpCircle className="h-4 w-4" /> Hướng dẫn
                  </Button>

                  {/* Thêm nhanh button */}
                  <Button
                    className="bg-accent hover:bg-accent/90 text-white rounded-full h-11 px-5 font-bold gap-2 shadow-lg shadow-accent/20"
                    onClick={() => {
                      setIsImportModalOpen(false);
                      setIsAIModalOpen(true);
                    }}
                  >
                    <Sparkles className="h-4 w-4" /> Thêm nhanh
                  </Button>
                </div>
              </div>

              {/* Table Body Area */}
              <div className="flex-1 overflow-auto p-0 min-h-[400px]">
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0 bg-slate-50 z-10 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-4 text-center w-12">#</th>
                      <th className="px-4 py-4 text-left min-w-[300px]">
                        NỘI DUNG CÂU HỎI *
                      </th>
                      <th className="px-4 py-4 text-left w-40">ĐÁP ÁN A *</th>
                      <th className="px-4 py-4 text-left w-40">ĐÁP ÁN B *</th>
                      <th className="px-4 py-4 text-left w-40">ĐÁP ÁN C *</th>
                      <th className="px-4 py-4 text-left w-40">ĐÁP ÁN D *</th>
                      <th className="px-4 py-4 text-center w-28">ĐÚNG *</th>
                      <th className="px-4 py-4 text-center w-32">ĐỘ KHÓ</th>
                      <th className="px-4 py-4 text-left min-w-[200px]">
                        GIẢI THÍCH
                      </th>
                      <th className="px-4 py-4 text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {batchQuestions.map((q, index) => (
                      <tr
                        key={q.id}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="px-4 py-3 text-center text-gray-400 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-2 py-3">
                          <textarea
                            className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none min-h-[60px]"
                            placeholder="Nhập đề bài..."
                            value={q.content}
                            onChange={(e) =>
                              handleUpdateBatchRow(
                                q.id,
                                "content",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-2 py-3">
                          <input
                            className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                            placeholder="Đáp án A"
                            value={q.a}
                            onChange={(e) =>
                              handleUpdateBatchRow(q.id, "a", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-3">
                          <input
                            className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                            placeholder="Đáp án B"
                            value={q.b}
                            onChange={(e) =>
                              handleUpdateBatchRow(q.id, "b", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-3">
                          <input
                            className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                            placeholder="Đáp án C"
                            value={q.c}
                            onChange={(e) =>
                              handleUpdateBatchRow(q.id, "c", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-3">
                          <input
                            className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                            placeholder="Đáp án D"
                            value={q.d}
                            onChange={(e) =>
                              handleUpdateBatchRow(q.id, "d", e.target.value)
                            }
                          />
                        </td>
                        <td className="px-2 py-3">
                          <Select
                            value={q.correct}
                            onValueChange={(v) =>
                              handleUpdateBatchRow(q.id, "correct", v)
                            }
                          >
                            <SelectTrigger className="w-full rounded-xl border-gray-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["A", "B", "C", "D"].map((l) => (
                                <SelectItem key={l} value={l}>
                                  {l}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-2 py-3">
                          <Select
                            value={q.level}
                            onValueChange={(v) =>
                              handleUpdateBatchRow(q.id, "level", v)
                            }
                          >
                            <SelectTrigger className="w-full rounded-xl border-gray-100 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["Dễ", "Trung Bình", "Khó"].map((l) => (
                                <SelectItem key={l} value={l}>
                                  {l}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-2 py-3">
                          <input
                            className="w-full bg-white border border-gray-100 rounded-xl px-3 py-2 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                            placeholder="Giải thích đáp án"
                            value={q.explanation}
                            onChange={(e) =>
                              handleUpdateBatchRow(
                                q.id,
                                "explanation",
                                e.target.value,
                              )
                            }
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleRemoveBatchRow(q.id)}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="10" className="p-4">
                        <button
                          onClick={handleAddBatchRow}
                          className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 font-bold hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                        >
                          <PlusCircle className="h-5 w-5" /> Thêm dòng
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Footer */}
              <div className="p-6 bg-white border-t flex justify-end items-center gap-4 shrink-0">
                <Button
                  variant="ghost"
                  className="rounded-xl text-blue-500 font-bold px-8 hover:bg-blue-50"
                  onClick={() => setIsImportModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-12 py-6 h-auto text-lg font-bold shadow-xl shadow-primary/20"
                  onClick={handleSaveBatch}
                >
                  Lưu{" "}
                  {batchQuestions.filter((q) => q.content.trim() !== "").length}{" "}
                  câu hỏi
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* INSTRUCTION SUB-MODAL */}
          <Dialog open={isInstructionOpen} onOpenChange={setIsInstructionOpen}>
            <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl bg-white">
              <div className="p-6 space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-800">
                    Hướng dẫn nhập câu hỏi
                  </DialogTitle>
                </DialogHeader>

                <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-blue-700 font-bold">
                    <Info className="h-5 w-5" />
                    <span>Quy trình nhập dữ liệu:</span>
                  </div>

                  <ul className="space-y-3 text-sm text-blue-800/90">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <span>
                        <strong>Nhập trực tiếp:</strong> Bạn có thể gõ nội dung
                        câu hỏi và các đáp án trực tiếp vào bảng.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <span>
                        <strong>Import Excel:</strong> Sử dụng nút "Nhập file"
                        để tải lên file Excel/CSV theo đúng mẫu.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <div className="space-y-2">
                        <strong>Cấu trúc file Excel mẫu:</strong>
                        <ol className="list-decimal list-inside space-y-1 ml-2 text-blue-700/80 font-medium">
                          <li>nội dung (Bắt buộc)</li>
                          <li>đáp án A, B, C, D (Bắt buộc)</li>
                          <li>đáp án đúng (A, B, C hoặc D)</li>
                        </ol>
                      </div>
                    </li>
                  </ul>

                  <Button
                    variant="secondary"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-5 font-bold shadow-sm shadow-blue-200 gap-2 border-none"
                    onClick={() => alert("Đang tải file mẫu...")}
                  >
                    <Download className="h-4 w-4" /> Tải file mẫu .xlsx
                  </Button>
                </div>
              </div>
              <div className="p-4 bg-gray-50 border-t flex justify-end">
                <Button
                  className="bg-gray-900 text-white rounded-xl px-8"
                  onClick={() => setIsInstructionOpen(false)}
                >
                  Đã hiểu
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {/* AI MODAL TRIGGER */}
          <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100"
              >
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
                  {/* Textarea with file attachment UI */}
                  <div className="relative border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all bg-white overflow-hidden">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={
                        attachedFile
                          ? "Thêm yêu cầu cụ thể (VD: tạo 5 câu hỏi trắc nghiệm từ file)..."
                          : "Nhập chủ đề hoặc đính kèm file để AI tạo câu hỏi..."
                      }
                      className="w-full h-28 p-4 pb-2 border-none outline-none resize-none text-gray-700 bg-transparent"
                      disabled={isAiLoading}
                    />

                    {/* Attached file preview inside box */}
                    {attachedFile && (
                      <div className="mx-4 mb-3 flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2">
                        {isReadingFile ? (
                          <Loader2 className="h-4 w-4 text-indigo-500 animate-spin shrink-0" />
                        ) : (
                          <FileText className="h-4 w-4 text-indigo-600 shrink-0" />
                        )}
                        <span className="text-xs font-semibold text-indigo-700 truncate flex-1">
                          {isReadingFile
                            ? "Đang đọc file..."
                            : attachedFile.name}
                        </span>
                        <span className="text-xs text-indigo-400 shrink-0">
                          {(attachedFile.size / 1024).toFixed(1)} KB
                        </span>
                        {!isReadingFile && (
                          <button
                            onClick={handleRemoveAttachedFile}
                            className="text-indigo-400 hover:text-red-500 transition-colors shrink-0"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Bottom toolbar */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50/50">
                      <label
                        className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-indigo-600 cursor-pointer transition-colors group"
                        title="Đính kèm file (TXT, PDF, DOC)"
                      >
                        <Paperclip className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                        <span>Đính kèm file</span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".txt,.pdf,.doc,.docx"
                          onChange={handleFileAttach}
                          disabled={isAiLoading}
                        />
                      </label>
                      <span className="text-xs text-gray-400">
                        {prompt.length}/1000
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500 px-1">
                    <span className="flex items-center gap-1">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      {attachedFile
                        ? `AI sẽ tạo câu hỏi từ nội dung file "${attachedFile.name}"`
                        : "Nhập chủ đề hoặc đính kèm file tài liệu để AI tạo câu hỏi phù hợp."}
                    </span>
                  </div>
                </div>

                {!isAiLoading && !generatedQuestions && (
                  <Button
                    onClick={handleGenerate}
                    disabled={
                      (!prompt.trim() && !attachedFile) || isReadingFile
                    }
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-semibold rounded-xl shadow-md gap-2 transition-all shadow-indigo-500/20 disabled:opacity-50"
                  >
                    <Sparkles className="h-5 w-5" />
                    {attachedFile
                      ? `Tạo câu hỏi từ file "${attachedFile.name}"`
                      : "Tạo câu hỏi với AI"}
                  </Button>
                )}

                {isAiLoading && (
                  <div className="space-y-4">
                    <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-8 flex flex-col items-center justify-center space-y-4">
                      <div className="flex gap-2">
                        <div
                          className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0s" }}
                        ></div>
                        <div
                          className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2.5 h-2.5 bg-indigo-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                        <div
                          className="w-2.5 h-2.5 bg-indigo-200 rounded-full animate-bounce"
                          style={{ animationDelay: "0.6s" }}
                        ></div>
                      </div>
                      <div className="text-center space-y-1">
                        <p className="font-bold text-indigo-600 flex items-center justify-center gap-2">
                          <Sparkles className="h-4 w-4 text-indigo-400" /> Đang
                          xử lý yêu cầu...
                        </p>
                        <p className="text-xs text-gray-400">
                          AI đang trực tiếp xử lý...
                        </p>
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
                    <h3 className="font-bold text-gray-800 text-lg">
                      Kết quả ({generatedQuestions.length} câu hỏi)
                    </h3>

                    <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
                      {generatedQuestions.map((q, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4"
                        >
                          <div className="flex gap-3">
                            <Circle className="h-5 w-5 text-gray-300 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-gray-900">
                                {q.question}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {q.subject || questionData.subject} - Lớp{" "}
                                  {q.class ||
                                    questionData.status.replace("Lớp ", "")}
                                </span>
                                <span className="text-xs font-medium bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full">
                                  {q.level || "Dễ"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-2 pl-8">
                            {["A", "B", "C", "D"].map((letter) => (
                              <div
                                key={letter}
                                className={`flex items-center gap-2 p-2.5 rounded-lg text-sm border transition-colors ${letter === q.answer ? "bg-green-50 border-green-200 text-green-700 font-medium" : "bg-gray-50 border-gray-100 text-gray-600"}`}
                              >
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${letter === q.answer ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"}`}
                                >
                                  {letter}
                                </div>
                                <span>{q.options?.[letter]}</span>
                                {letter === q.answer && (
                                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                                )}
                              </div>
                            ))}
                          </div>

                          {q.explanation && (
                            <div className="pl-8 pt-2">
                              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800">
                                <span className="font-bold">
                                  ✨ Giải thích:
                                </span>{" "}
                                {q.explanation}
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

          <Button
            variant="ghost"
            onClick={() => navigate("/admin/questions")}
            className="text-gray-500 hover:text-white"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 px-6"
          >
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

          <CardLayout
            title="Các phương án đáp án"
            subtitle="Chọn ít nhất một đáp án đúng"
          >
            <div className="grid grid-cols-1 gap-4 mt-2">
              {options.map((opt) => (
                <div
                  key={opt.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${opt.isCorrect ? "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300" : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"}`}
                >
                  <button
                    onClick={() => handleSetCorrectOption(opt.id)}
                    className={`mt-2 shrink-0 transition-transform active:scale-95 ${opt.isCorrect ? "text-emerald-600" : "text-gray-300 hover:text-gray-400"}`}
                  >
                    {opt.isCorrect ? (
                      <CheckCircle2 className="h-7 w-7" />
                    ) : (
                      <Circle className="h-7 w-7" />
                    )}
                  </button>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-400">
                        Phương án {opt.id}
                      </span>
                      {opt.isCorrect && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Đáp án đúng
                        </span>
                      )}
                    </div>
                    <textarea
                      value={opt.text}
                      onChange={(e) =>
                        handleOptionTextChange(opt.id, e.target.value)
                      }
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
            <h3 className="font-bold text-gray-900 border-b pb-4">
              Phân loại & Lớp
            </h3>

            <div className="space-y-4">
              <SelectGroup label="Môn học" icon="📚">
                <Select
                  value={questionData.subject}
                  onValueChange={(v) => handleSelectChange("subject", v)}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-200 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Toán", "Vật Lý", "Hóa Học", "Tiếng Anh"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SelectGroup>

              <SelectGroup label="Độ khó" icon="⚡">
                <Select
                  value={questionData.difficulty}
                  onValueChange={(v) => handleSelectChange("difficulty", v)}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-200 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Dễ", "Trung Bình", "Khó"].map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SelectGroup>

              <SelectGroup label="Lớp" icon="🏫">
                <Select
                  value={questionData.status}
                  onValueChange={(v) => handleSelectChange("status", v)}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-200 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lớp 10">Lớp 10</SelectItem>
                    <SelectItem value="Lớp 11">Lớp 11</SelectItem>
                    <SelectItem value="Lớp 12">Lớp 12</SelectItem>
                  </SelectContent>
                </Select>
              </SelectGroup>

              <SelectGroup label="Chủ đề" icon="📖">
                <Select
                  value={questionData.topicName}
                  onValueChange={(v) => handleSelectChange("topicName", v)}
                >
                  <SelectTrigger className="w-full rounded-xl border-gray-200 focus:ring-blue-500">
                    <SelectValue placeholder="Chọn chủ đề..." />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.length === 0 ? (
                      <SelectItem value="none" disabled>Không có chủ đề</SelectItem>
                    ) : (
                      topics.map((t) => (
                        <SelectItem key={t.id} value={t.name}>
                          {t.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </SelectGroup>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 space-y-3">
            <h4 className="text-sm font-bold text-blue-900">
              💡 Hướng dẫn nhanh
            </h4>
            <ul className="text-xs text-blue-700/80 space-y-2 list-none p-0">
              <li className="flex gap-2">
                <span>1.</span>{" "}
                <span>
                  Sử dụng AI để sinh câu hỏi giúp tiết kiệm thời gian tới 80%.
                </span>
              </li>
              <li className="flex gap-2">
                <span>2.</span>{" "}
                <span>
                  Đảm bảo lời giải chi tiết rõ ràng để hỗ trợ học sinh học tập.
                </span>
              </li>
              <li className="flex gap-2">
                <span>3.</span>{" "}
                <span>
                  Luôn gắn thẻ môn học để quản lý ngân hàng câu hỏi dễ dàng.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuestionCreate;
