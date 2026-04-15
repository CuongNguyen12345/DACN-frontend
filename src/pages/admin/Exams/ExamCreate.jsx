import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UploadCloud, FileText, X, Save, Search, Database, Tag, Filter } from "lucide-react";

// Import các component Select từ shadcn/ui
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import api from "@/services/api";

const ExamCreate = () => {
  const navigate = useNavigate();

  // State lưu trữ dữ liệu form
  const [examData, setExamData] = useState({
    title: "",
    subject: "Toán",
    grade: "Lớp 10",
    duration: 60,
    targetQuestions: 30,
    description: "",
  });

  // State lưu trữ file được chọn
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // States lấy câu hỏi từ ngân hàng
  const [bankQuestions, setBankQuestions] = useState([]);
  const [isBankLoading, setIsBankLoading] = useState(false);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const fetchBankQuestions = async () => {
    setIsBankLoading(true);
    try {
      const res = await api.get("/api/admin/questions");
      const formatted = res.data.map((q) => ({
        ...q,
        createdAt: q.createdAt ? String(q.createdAt).substring(0, 10) : "N/A",
      }));
      setBankQuestions(formatted.reverse());
    } catch (error) {
      console.error("Lỗi lấy câu hỏi:", error);
    } finally {
      setIsBankLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen && bankQuestions.length === 0) {
      fetchBankQuestions();
    }
  }, [isModalOpen, bankQuestions.length]);

  const filteredBankQuestions = useMemo(() => {
    return bankQuestions.filter((q) => {
      const matchSearch = q.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSubject = subjectFilter === "all" || q.subject === subjectFilter;
      const matchClass = classFilter === "all" || q.status === classFilter;
      const matchLevel = levelFilter === "all" || q.level === levelFilter;
      return matchSearch && matchSubject && matchClass && matchLevel;
    });
  }, [bankQuestions, searchTerm, subjectFilter, classFilter, levelFilter]);

  const toggleSelectOne = (id) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (
      selectedQuestionIds.length === filteredBankQuestions.length &&
      filteredBankQuestions.length > 0
    ) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(filteredBankQuestions.map((q) => q.id));
    }
  };

  const selectedQuestionsDetails = bankQuestions.filter((q) =>
    selectedQuestionIds.includes(q.id)
  );

  const getLevelColor = (level) => {
    switch (level) {
      case "Dễ":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50";
      case "Trung bình":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50";
      case "Khó":
        return "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-50";
      default:
        return "bg-slate-50 text-slate-700 hover:bg-slate-50";
    }
  };

  // Xử lý thay đổi input thông thường
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi cho các Dropdown (Select)
  const handleSelectChange = (name, value) => {
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn file
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Xóa file đã chọn
  const removeFile = () => {
    setSelectedFile(null);
  };

  // Nút Lưu đề thi - gọi API thực
  const handleSave = async () => {
    if (!examData.title.trim()) {
      alert("Vui lòng nhập tên đề thi!");
      return;
    }
    if (selectedQuestionIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 câu hỏi từ Ngân hàng!");
      return;
    }
    const target = Number(examData.targetQuestions);
    if (target > 0 && selectedQuestionIds.length < target) {
      const confirmed = window.confirm(
        `Bạn đặt mục tiêu ${target} câu nhưng mới chọn được ${selectedQuestionIds.length} câu.\n\nTiếp tục lưu không?`
      );
      if (!confirmed) return;
    }
    setIsSaving(true);
    try {
      await api.post("/api/admin/exams", {
        title: examData.title,
        subject: examData.subject,
        grade: examData.grade,
        duration: Number(examData.duration),
        totalQuestions: Number(examData.targetQuestions),
        description: examData.description,
        questionIds: selectedQuestionIds,
      });
      alert(`Tạo đề thi thành công với ${selectedQuestionIds.length} câu hỏi!`);
      navigate("/admin/exams");
    } catch (error) {
      console.error("Đặt lỗi khi tạo đề thi:", error);
      alert("Tạo đề thi thất bại. Vui lòng thử lại!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Nút Back */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/exams")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors outline-none"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tạo đề thi mới</h2>
            <p className="text-sm text-gray-500">Thêm thông tin và tải lên file đề thi của bạn.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/exams")}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 outline-none"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Đang lưu..." : "Lưu đề thi"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Thông tin chính & Upload (Chiếm 2 phần) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Thông tin cơ bản */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên đề thi <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={examData.title}
                  onChange={handleChange}
                  placeholder="VD: Đề thi thử THPT Quốc Gia môn Toán 2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                <textarea
                  name="description"
                  value={examData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Nhập mô tả nội dung đề thi, mục tiêu..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                ></textarea>
              </div>
            </div>
          </div>



          {/* Card: Nguồn câu hỏi */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Danh sách câu hỏi đề thi</h3>

              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">
                    <Database className="h-4 w-4" /> Lấy từ Ngân hàng
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] lg:max-w-[1200px] xl:max-w-[1400px] max-h-[90vh] flex flex-col">
                  <DialogHeader>
                    <DialogTitle>Chọn câu hỏi từ Ngân hàng</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-4 py-4 min-h-[400px]">
                    <div className="flex flex-col md:flex-row gap-4 mb-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Tìm kiếm nội dung câu hỏi..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                          <SelectTrigger className="w-[140px] bg-white"><SelectValue placeholder="Môn học" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả môn</SelectItem>
                            <SelectItem value="Toán">Toán</SelectItem>
                            <SelectItem value="Vật Lý">Vật Lý</SelectItem>
                            <SelectItem value="Hóa Học">Hóa Học</SelectItem>
                            <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={classFilter} onValueChange={setClassFilter}>
                          <SelectTrigger className="w-[130px] bg-white"><SelectValue placeholder="Lớp" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả lớp</SelectItem>
                            <SelectItem value="Lớp 10">Lớp 10</SelectItem>
                            <SelectItem value="Lớp 11">Lớp 11</SelectItem>
                            <SelectItem value="Lớp 12">Lớp 12</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={levelFilter} onValueChange={setLevelFilter}>
                          <SelectTrigger className="w-[130px] bg-white"><SelectValue placeholder="Độ khó" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả mức</SelectItem>
                            <SelectItem value="Dễ">Dễ</SelectItem>
                            <SelectItem value="Trung bình">Trung bình</SelectItem>
                            <SelectItem value="Khó">Khó</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                          <tr>
                            <th className="px-4 py-3 w-10">
                              <Checkbox
                                checked={selectedQuestionIds.length === filteredBankQuestions.length && filteredBankQuestions.length > 0}
                                onCheckedChange={toggleSelectAll}
                              />
                            </th>
                            <th className="px-4 py-3">Nội dung câu hỏi</th>
                            <th className="px-4 py-3">Phân loại</th>
                            <th className="px-4 py-3 text-center">Độ khó</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {isBankLoading ? (
                            <tr><td colSpan="4" className="text-center py-6 text-gray-500">Đang tải dữ liệu...</td></tr>
                          ) : filteredBankQuestions.length === 0 ? (
                            <tr><td colSpan="4" className="text-center py-6 text-gray-500">Không tìm thấy câu hỏi.</td></tr>
                          ) : filteredBankQuestions.map((q) => (
                            <tr key={q.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <Checkbox
                                  checked={selectedQuestionIds.includes(q.id)}
                                  onCheckedChange={() => toggleSelectOne(q.id)}
                                />
                              </td>
                              <td className="px-4 py-3 font-medium text-gray-900">{q.content}</td>
                              <td className="px-4 py-3 text-gray-500">
                                <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {q.subject} - {q.status}</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <Badge className={cn("font-normal border shadow-none pointer-events-none", getLevelColor(q.level))}>
                                  {q.level}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <DialogFooter className="mt-4 pt-4 border-t border-gray-100 px-0">
                    <div className="flex w-full justify-between items-center">
                      <span className="text-sm font-medium text-blue-600">Đã chọn {selectedQuestionIds.length} câu hỏi</span>
                      <Button onClick={() => setIsModalOpen(false)}>Xác nhận</Button>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {selectedQuestionIds.length > 0 ? (
              <div className="border border-blue-100 rounded-lg bg-blue-50/50 p-4">
                <p className="text-sm font-medium text-blue-800 mb-3">Đã thêm {selectedQuestionIds.length} câu hỏi từ Ngân hàng</p>
                <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {selectedQuestionsDetails.map((q, idx) => (
                    <li key={q.id} className="bg-white p-3 rounded border border-gray-200 shadow-sm flex items-start gap-3">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold w-6 h-6 rounded flex items-center justify-center shrink-0">{idx + 1}</span>
                      <p className="text-sm text-gray-700 line-clamp-2">{q.content}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-500">
                <Database className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm">Chưa có câu hỏi nào được chọn</p>
              </div>
            )}
          </div>
        </div>

        {/* Cột phải: Cài đặt (Chiếm 1 phần) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt đề thi</h3>

            <div className="space-y-4">
              {/* Dropdown Môn học và Lớp đã được làm đẹp */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Môn học</label>
                  <Select
                    value={examData.subject}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lớp</label>
                  <Select
                    value={examData.grade}
                    onValueChange={(value) => handleSelectChange("grade", value)}
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (phút)</label>
                  <input
                    type="number"
                    name="duration"
                    value={examData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số câu hỏi</label>
                  <input
                    type="number"
                    name="targetQuestions"
                    value={examData.targetQuestions}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
              {/* Warning nếu câu hỏi chưa đủ */}
              {Number(examData.targetQuestions) > 0 && selectedQuestionIds.length > 0 && selectedQuestionIds.length < Number(examData.targetQuestions) && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs">
                  <span className="font-semibold">&#9888;</span>
                  Còn thiếu <span className="font-bold mx-1">{Number(examData.targetQuestions) - selectedQuestionIds.length}</span> câu so với mục tiêu
                </div>
              )}
              {Number(examData.targetQuestions) > 0 && selectedQuestionIds.length >= Number(examData.targetQuestions) && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs">
                  <span className="font-semibold">&#10003;</span>
                  Đã đủ {selectedQuestionIds.length}/{examData.targetQuestions} câu hỏi
                </div>
              )}
            </div>
          </div>

          {/* Card: Upload File */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tài liệu đính kèm (PDF/Word)</h3>

            {!selectedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">Kéo thả file vào đây hoặc click để duyệt</p>
                <p className="text-xs text-gray-500">Hỗ trợ định dạng: PDF, DOC, DOCX (Tối đa 10MB)</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCreate;