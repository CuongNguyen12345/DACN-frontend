import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle2, Circle } from "lucide-react";

// Import components từ shadcn/ui (Giữ nguyên như trang Exam)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const QuestionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // State lưu trữ dữ liệu câu hỏi
  const [questionData, setQuestionData] = useState({
    content: "",
    subject: "Toán",
    difficulty: "Trung bình",
    explanation: "",
    status: "Đã duyệt",
  });

  // State quản lý 4 đáp án (Mặc định có 4 options)
  const [options, setOptions] = useState([
    { id: "A", text: "", isCorrect: false },
    { id: "B", text: "", isCorrect: false },
    { id: "C", text: "", isCorrect: false },
    { id: "D", text: "", isCorrect: false },
  ]);

  // Giả lập gọi API lấy dữ liệu câu hỏi cũ
  useEffect(() => {
    console.log("Đang lấy dữ liệu câu hỏi ID:", id);
    // Dữ liệu giả lập
    setQuestionData({
      content: "Nghiệm của phương trình 2x - 4 = 0 là:",
      subject: "Toán",
      difficulty: "Nhận biết",
      explanation: "Ta có: 2x - 4 = 0 <=> 2x = 4 <=> x = 2.",
      status: "Đã duyệt",
    });
    setOptions([
      { id: "A", text: "x = 1", isCorrect: false },
      { id: "B", text: "x = 2", isCorrect: true }, // B là đáp án đúng
      { id: "C", text: "x = -2", isCorrect: false },
      { id: "D", text: "x = 4", isCorrect: false },
    ]);
  }, [id]);

  // Xử lý thay đổi input thông thường
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi Dropdown
  const handleSelectChange = (name, value) => {
    setQuestionData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý khi gõ text vào đáp án
  const handleOptionTextChange = (id, newText) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, text: newText } : opt))
    );
  };

  // Xử lý khi chọn đáp án đúng
  const handleSetCorrectOption = (id) => {
    setOptions((prev) =>
      prev.map((opt) => ({
        ...opt,
        isCorrect: opt.id === id, // Chỉ cho phép 1 đáp án đúng (Radio behavior)
      }))
    );
  };

  // Lưu câu hỏi
  const handleSave = () => {
    // Kiểm tra xem đã chọn đáp án đúng chưa
    const hasCorrectAnswer = options.some((opt) => opt.isCorrect);
    if (!hasCorrectAnswer) {
      alert("Vui lòng chọn ít nhất một đáp án đúng!");
      return;
    }

    console.log("Dữ liệu câu hỏi lưu:", { ...questionData, options });
    alert(`Lưu câu hỏi #${id} thành công!`);
    navigate("/admin/questions"); // Chuyển về trang danh sách câu hỏi
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/questions")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors outline-none"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa câu hỏi</h2>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-mono font-semibold border border-blue-200">
                #{id || "NEW"}
              </span>
            </div>
            <p className="text-sm text-gray-500">Cập nhật nội dung, đáp án và lời giải.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/questions")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 outline-none"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 outline-none"
          >
            <Save className="h-4 w-4" />
            Lưu câu hỏi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Nội dung câu hỏi & Đáp án (Chiếm 2 phần) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Nội dung câu hỏi */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nội dung câu hỏi <span className="text-red-500">*</span></h3>
            <textarea
              name="content"
              value={questionData.content}
              onChange={handleChange}
              rows="4"
              placeholder="Nhập đề bài vào đây..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
            ></textarea>
          </div>

          {/* Card: Các phương án */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Các phương án đáp án</h3>
              <span className="text-xs text-gray-500 italic">Click vào hình tròn để chọn đáp án đúng</span>
            </div>

            <div className="space-y-3">
              {options.map((option) => (
                <div 
                  key={option.id} 
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    option.isCorrect ? "border-green-500 bg-green-50/30" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  {/* Nút chọn đáp án đúng */}
                  <button
                    onClick={() => handleSetCorrectOption(option.id)}
                    className="mt-2 text-gray-400 hover:text-green-500 transition-colors outline-none"
                    title="Đánh dấu là đáp án đúng"
                  >
                    {option.isCorrect ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className="h-6 w-6" />
                    )}
                  </button>
                  
                  {/* Ký tự A, B, C, D */}
                  <div className="mt-2 font-bold text-gray-700 w-6 text-center">
                    {option.id}.
                  </div>

                  {/* Input nội dung đáp án */}
                  <textarea
                    value={option.text}
                    onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                    rows="2"
                    placeholder={`Nhập nội dung đáp án ${option.id}...`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none bg-white"
                  ></textarea>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Lời giải chi tiết */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Lời giải chi tiết (Không bắt buộc)</h3>
            <textarea
              name="explanation"
              value={questionData.explanation}
              onChange={handleChange}
              rows="3"
              placeholder="Nhập lời giải hoặc gợi ý cho học sinh..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
            ></textarea>
          </div>

        </div>

        {/* Cột phải: Phân loại & Cài đặt */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân loại câu hỏi</h3>
            
            <div className="space-y-5">
              {/* Môn học */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Môn học</label>
                <Select 
                  value={questionData.subject} 
                  onValueChange={(value) => handleSelectChange("subject", value)}
                >
                  <SelectTrigger className="w-full outline-none focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Chọn môn học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Toán">Toán Học</SelectItem>
                    <SelectItem value="Vật Lý">Vật Lý</SelectItem>
                    <SelectItem value="Hóa Học">Hóa Học</SelectItem>
                    <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                    <SelectItem value="Ngữ Văn">Ngữ Văn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Độ khó */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Độ khó</label>
                <Select 
                  value={questionData.difficulty} 
                  onValueChange={(value) => handleSelectChange("difficulty", value)}
                >
                  <SelectTrigger className="w-full outline-none focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Chọn độ khó" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nhận biết">Nhận biết</SelectItem>
                    <SelectItem value="Thông hiểu">Thông hiểu</SelectItem>
                    <SelectItem value="Vận dụng">Vận dụng</SelectItem>
                    <SelectItem value="Vận dụng cao">Vận dụng cao</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái duyệt</label>
                <Select 
                  value={questionData.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="w-full outline-none focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bản nháp">Bản nháp</SelectItem>
                    <SelectItem value="Đã duyệt">Đã duyệt (Sẵn sàng dùng)</SelectItem>
                    <SelectItem value="Cần sửa lại">Cần sửa lại</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          </div>
          
          {/* Gợi ý / Info box */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Mẹo nhỏ</h4>
            <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
              <li>Bạn phải chọn ít nhất 1 đáp án đúng để lưu.</li>
              <li>Lời giải chi tiết sẽ hiển thị sau khi học sinh nộp bài.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionEdit;