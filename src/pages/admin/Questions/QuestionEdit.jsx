import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, CheckCircle2, Circle, Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const QuestionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { basePath } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [questionData, setQuestionData] = useState({
    content: "",
    subject: "Toán",
    difficulty: "Trung bình",
    explanation: "",
    status: "Lớp 12",
    topicName: "",
  });

  const [options, setOptions] = useState([
    { id: "A", text: "", isCorrect: false },
    { id: "B", text: "", isCorrect: false },
    { id: "C", text: "", isCorrect: false },
    { id: "D", text: "", isCorrect: false },
  ]);

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

  // Gọi API lấy dữ liệu câu hỏi
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const actualId = id.replace("Q-", "");
        const res = await api.get(`/api/admin/questions/${actualId}`);
        const data = res.data;

        let subjectValue = "Toán";
        if (data.subject === "Vật Lý") subjectValue = "Vật Lý";
        else if (data.subject === "Hóa Học") subjectValue = "Hóa Học";
        else if (data.subject === "Tiếng Anh") subjectValue = "Tiếng Anh";
        else if (data.subject === "Ngữ Văn") subjectValue = "Ngữ Văn";

        let difficultyValue = "Dễ";
        if (data.level === "Trung bình") difficultyValue = "Trung bình";
        else if (data.level === "Dễ") difficultyValue = "Dễ";
        else if (data.level === "Khó") difficultyValue = "Khó";

        setQuestionData({
          content: data.content || "",
          subject: subjectValue,
          difficulty: difficultyValue,
          explanation: data.explanation || "",
          status: data.status || "Lớp 12",
          topicName: data.topicName || "",
        });

        if (data.options && data.options.length > 0) {
          const mappedOptions = data.options.map((opt, index) => ({
            id: String.fromCharCode(65 + index),
            text: opt.text,
            isCorrect: opt.isCorrect,
          }));
          setOptions(mappedOptions);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu câu hỏi:", error);
        alert("Không thể tải dữ liệu câu hỏi.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchQuestion();
    }
  }, [id]);

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
    const hasCorrectAnswer = options.some((opt) => opt.isCorrect);
    if (!hasCorrectAnswer) {
      alert("Vui lòng chọn ít nhất một đáp án đúng!");
      return;
    }

    if (!questionData.content.trim()) {
      alert("Vui lòng nhập nội dung câu hỏi!");
      return;
    }

    try {
      const actualId = id.replace("Q-", "");
      const payload = {
        content: questionData.content,
        explanation: questionData.explanation,
        level: questionData.difficulty,
        subject: questionData.subject,
        grade: questionData.status,
        topicName: questionData.topicName || "",
        options: options.map((opt) => ({
          content: opt.text,
          isCorrect: opt.isCorrect,
        })),
      };

      await api.put(`/api/admin/questions/${actualId}`, payload);
      alert(`Cập nhật câu hỏi #${id} thành công!`);
      navigate(`${basePath}/questions`);
    } catch (error) {
      console.error("Lỗi khi lưu câu hỏi:");
      if (error.response) {
        alert(
          `Lỗi từ máy chủ: ${error.response.data || "Vui lòng kiểm tra lại dữ liệu."}`,
        );
      } else {
        alert("Đã có lỗi xảy ra khi lưu câu hỏi. Vui lòng thử lại sau.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`${basePath}/questions`)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors outline-none"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Chỉnh sửa câu hỏi
              </h2>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-mono font-semibold border border-blue-200">
                #{id || "NEW"}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Cập nhật nội dung, đáp án và lời giải.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`${basePath}/questions`)}
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
        {/* Cột trái */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Nội dung câu hỏi */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Nội dung câu hỏi <span className="text-red-500">*</span>
            </h3>
            <textarea
              name="content"
              value={questionData.content}
              onChange={handleChange}
              rows="4"
              placeholder="Nhập đề bài vào đây..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
            ></textarea>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Các phương án đáp án
              </h3>
              <span className="text-xs text-gray-500 italic">
                Click vào hình tròn để chọn đáp án đúng
              </span>
            </div>
            <div className="space-y-3">
              {options.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    option.isCorrect
                      ? "border-green-500 bg-green-50/30"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
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

                  <div className="mt-2 font-bold text-gray-700 w-6 text-center">
                    {option.id}.
                  </div>
                  <textarea
                    value={option.text}
                    onChange={(e) =>
                      handleOptionTextChange(option.id, e.target.value)
                    }
                    rows="2"
                    placeholder={`Nhập nội dung đáp án ${option.id}...`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none bg-white"
                  ></textarea>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Lời giải chi tiết (Không bắt buộc)
            </h3>
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

        {/* Cột phải */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Phân loại câu hỏi
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Môn học
                </label>
                <Select
                  value={questionData.subject}
                  onValueChange={(value) =>
                    handleSelectChange("subject", value)
                  }
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ khó
                </label>
                <Select
                  value={questionData.difficulty}
                  onValueChange={(value) =>
                    handleSelectChange("difficulty", value)
                  }
                >
                  <SelectTrigger className="w-full outline-none focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Chọn độ khó" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dễ">Dễ</SelectItem>
                    <SelectItem value="Trung bình">Trung bình</SelectItem>
                    <SelectItem value="Khó">Khó</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lớp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lớp
                </label>
                <Select
                  value={questionData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="w-full outline-none focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Chọn lớp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lớp 10">Lớp 10</SelectItem>
                    <SelectItem value="Lớp 11">Lớp 11</SelectItem>
                    <SelectItem value="Lớp 12">Lớp 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Chủ đề */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chủ đề
                </label>
                <Select
                  value={questionData.topicName}
                  onValueChange={(value) => handleSelectChange("topicName", value)}
                >
                  <SelectTrigger className="w-full outline-none focus:ring-2 focus:ring-blue-500">
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
              </div>
            </div>
          </div>

          {/* Gợi ý / Info box */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">
              💡 Mẹo nhỏ
            </h4>
            <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
              <li>Bạn phải chọn ít nhất 1 đáp án đúng để lưu.</li>
              <li>Lời giải chi tiết sẽ hiển thị sau khi học sinh nộp bài.</li>
              <li>Chọn đúng chủ đề giúp hệ thống cá nhân hóa bài tập.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionEdit;
