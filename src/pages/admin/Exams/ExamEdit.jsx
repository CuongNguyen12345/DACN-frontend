import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UploadCloud, FileText, X, Save } from "lucide-react";

// Import các component Select từ shadcn/ui
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ExamEdit = () => {
  const navigate = useNavigate();
  // Lấy params 'id' từ URL (Cấu hình trong AppRoutes là path="exams/edit/:id")
  const { id } = useParams(); 
  
  // State lưu trữ dữ liệu form
  const [examData, setExamData] = useState({
    title: "",
    subject: "Toán",
    duration: 60,
    questions: 50,
    status: "Bản nháp",
    description: "",
  });

  // Giả lập trạng thái đã có file cũ lưu trên hệ thống
  const [existingFile, setExistingFile] = useState({ name: `De_Thi_${id}.pdf`, size: 2.4 }); 
  const [selectedFile, setSelectedFile] = useState(null);

  // Giả lập gọi API lấy dữ liệu cũ khi vừa vào trang
  useEffect(() => {
    // Trong thực tế, chỗ này bạn sẽ dùng: axios.get(`/api/exams/${id}`)
    console.log("Đang lấy dữ liệu của đề thi ID:", id);
    
    // Đổ dữ liệu giả lập vào Form
    setExamData({
      title: "Đề thi thử THPT QG Môn Toán 2025 - Lần 1",
      subject: "Toán",
      duration: 90,
      questions: 50,
      status: "Đang mở",
      description: "Đề bám sát cấu trúc đề minh họa của BGD năm 2025. Dành cho học sinh trung bình khá trở lên.",
    });
  }, [id]);

  // Xử lý thay đổi input thông thường
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thay đổi cho các Dropdown (Select của shadcn)
  const handleSelectChange = (name, value) => {
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn file mới đè lên file cũ
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setExistingFile(null); // Ẩn file cũ đi
    }
  };

  // Xóa file đang chọn
  const removeFile = () => {
    setSelectedFile(null);
    setExistingFile(null);
  };

  // Nút Lưu cập nhật
  const handleSave = () => {
    console.log("Dữ liệu cập nhật cho ID", id, ":", examData);
    if (selectedFile) console.log("File mới đính kèm:", selectedFile);
    
    alert(`Cập nhật đề thi ${id} thành công!`);
    navigate("/admin/exams"); 
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
            <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa đề thi</h2>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm font-mono border border-gray-200">
                    #{id}
                </span>
            </div>
            <p className="text-sm text-gray-500">Cập nhật thông tin hoặc thay đổi file tài liệu.</p>
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
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 outline-none"
          >
            <Save className="h-4 w-4" />
            Lưu thay đổi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Thông tin chính */}
        <div className="lg:col-span-2 space-y-6">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Card: Upload File */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Tài liệu đính kèm</h3>
                {existingFile && (
                    <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded">Đã có file</span>
                )}
            </div>
            
            {!selectedFile && !existingFile ? (
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
                <p className="text-sm font-medium text-gray-900 mb-1">Tải lên file mới để thay thế</p>
                <p className="text-xs text-gray-500">Hỗ trợ định dạng: PDF, DOC, DOCX (Tối đa 10MB)</p>
              </div>
            ) : (
              <div className={`flex items-center justify-between p-4 border rounded-lg ${selectedFile ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-white rounded-lg shadow-sm ${selectedFile ? 'text-blue-600' : 'text-gray-500'}`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                        {selectedFile ? selectedFile.name : existingFile?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                        {selectedFile 
                            ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB (Tải lên mới)` 
                            : `${existingFile?.size} MB (File hệ thống)`
                        }
                    </p>
                  </div>
                </div>
                <button 
                  onClick={removeFile}
                  title="Xóa file này"
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cột phải: Cài đặt */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt đề thi</h3>
            
            <div className="space-y-4">
              {/* Dropdown Môn học */}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (phút)</label>
                  <input 
                    type="number" 
                    name="duration"
                    value={examData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số câu</label>
                  <input 
                    type="number" 
                    name="questions"
                    value={examData.questions}
                    onChange={handleChange}
                    className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Dropdown Trạng thái */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <Select 
                  value={examData.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="w-full outline-none focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bản nháp">Bản nháp (Ẩn)</SelectItem>
                    <SelectItem value="Đang mở">Đang mở (Công khai)</SelectItem>
                    <SelectItem value="Đã đóng">Đã đóng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamEdit;