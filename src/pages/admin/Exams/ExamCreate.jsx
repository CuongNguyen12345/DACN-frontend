import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UploadCloud, FileText, X, Save } from "lucide-react";

const ExamCreate = () => {
  const navigate = useNavigate();
  
  // State lưu trữ dữ liệu form
  const [examData, setExamData] = useState({
    title: "",
    subject: "Toán",
    duration: 60,
    questions: 50,
    status: "Bản nháp",
    description: "",
  });

  // State lưu trữ file được chọn
  const [selectedFile, setSelectedFile] = useState(null);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
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

  // Nút Lưu đề thi
  const handleSave = () => {
    console.log("Dữ liệu lưu:", examData);
    console.log("File đính kèm:", selectedFile);
    alert("Lưu đề thi thành công! (Demo)");
    navigate("/admin/exams"); // Quay lại danh sách
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Nút Back */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/admin/exams")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            Lưu đề thi
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
                  <div className="p-2 bg-white rounded-lg text-blue-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={removeFile}
                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cột phải: Cài đặt (Chiếm 1 phần) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt đề thi</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Môn học</label>
                <select 
                  name="subject"
                  value={examData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Toán">Toán Học</option>
                  <option value="Vật Lý">Vật Lý</option>
                  <option value="Hóa Học">Hóa Học</option>
                  <option value="Tiếng Anh">Tiếng Anh</option>
                  <option value="Ngữ Văn">Ngữ Văn</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (phút)</label>
                  <input 
                    type="number" 
                    name="duration"
                    value={examData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số câu hỏi</label>
                  <input 
                    type="number" 
                    name="questions"
                    value={examData.questions}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select 
                  name="status"
                  value={examData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Bản nháp">Bản nháp (Ẩn)</option>
                  <option value="Đang mở">Đang mở (Công khai)</option>
                  <option value="Đã đóng">Đã đóng</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCreate;