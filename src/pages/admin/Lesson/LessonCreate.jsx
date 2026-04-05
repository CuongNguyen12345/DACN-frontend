import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Video,
    UploadCloud,
    BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import các component Select từ shadcn/ui
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/context/AuthContext";

const LessonCreate = () => {
    const navigate = useNavigate();
    const { basePath } = useAuth();

    // State lưu trữ dữ liệu form
    const [formData, setFormData] = useState({
        title: "",
        subject: "Toán học",
        type: "Video", // Video | Lý thuyết | Bài tập
        duration: "",
        status: "Bản nháp", // Đã xuất bản | Bản nháp | Đang ẩn
        description: "",
        videoUrl: "",
    });

    // Hàm cập nhật state khi người dùng nhập text thông thường
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Hàm xử lý riêng cho Dropdown (Select của shadcn)
    const handleSelectChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Hàm xử lý submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dữ liệu bài học mới:", formData);
        alert("Thêm bài học thành công!");
        navigate(`/${basePath}/lessons`);
    };

    // Class CSS dùng chung cho các input text/textarea
    const inputClasses = "flex w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-10">
            {/* Header & Nút Back */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => navigate(-1)}
                        className="hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Thêm bài học mới</h2>
                        <p className="text-gray-500 text-sm mt-1">Tạo nội dung bài giảng và cấu hình hiển thị.</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate(-1)}>Hủy</Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4 mr-2" /> Lưu bài học
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cột Trái: Nội dung chính (Chiếm 2/3) */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-lg font-bold">Thông tin chung</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">
                                    Tên bài học <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="VD: Cực trị của hàm số bậc 3"
                                    className={inputClasses}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Mô tả ngắn</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Nhập mục tiêu hoặc tóm tắt bài học..."
                                    rows="3"
                                    className={inputClasses}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-lg font-bold">Nội dung bài giảng</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {formData.type === "Video" && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-900">Link Video (YouTube/Vimeo)</label>
                                        <div className="relative">
                                            <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="url"
                                                name="videoUrl"
                                                value={formData.videoUrl}
                                                onChange={handleChange}
                                                placeholder="https://youtube.com/watch?v=..."
                                                className={`${inputClasses} pl-10`}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full h-48 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                                        <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                                        <p className="text-sm">Hoặc tải video trực tiếp lên hệ thống</p>
                                        <Button type="button" variant="link" className="text-blue-600">Chọn file</Button>
                                    </div>
                                </div>
                            )}

                            {formData.type === "Lý thuyết" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">Soạn thảo văn bản</label>
                                    <div className="w-full h-64 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
                                        <p>[Khu vực Rich Text Editor]</p>
                                    </div>
                                </div>
                            )}

                            {formData.type === "Bài tập" && (
                                <div className="space-y-2 flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                    <BookOpen className="w-10 h-10 text-gray-300 mb-3" />
                                    <p className="text-sm text-gray-600 font-medium">Bạn cần lưu bài học trước khi thêm câu hỏi</p>
                                    <p className="text-xs text-gray-400 mt-1">Hệ thống sẽ chuyển đến trang ngân hàng câu hỏi sau khi lưu.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Cột Phải: Phân loại & Cài đặt (Chiếm 1/3) */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-lg font-bold">Phân loại</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {/* Shadcn Select: Môn học */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Môn học</label>
                                <Select 
                                    value={formData.subject} 
                                    onValueChange={(value) => handleSelectChange("subject", value)}
                                >
                                    <SelectTrigger className="w-full bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                                        <SelectValue placeholder="Chọn môn học" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Toán học">Toán học</SelectItem>
                                        <SelectItem value="Vật lý">Vật lý</SelectItem>
                                        <SelectItem value="Hóa học">Hóa học</SelectItem>
                                        <SelectItem value="Sinh học">Sinh học</SelectItem>
                                        <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Shadcn Select: Định dạng bài */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Định dạng bài</label>
                                <Select 
                                    value={formData.type} 
                                    onValueChange={(value) => handleSelectChange("type", value)}
                                >
                                    <SelectTrigger className="w-full bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                                        <SelectValue placeholder="Chọn định dạng" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Video">Video bài giảng</SelectItem>
                                        <SelectItem value="Lý thuyết">Bài đọc / Lý thuyết</SelectItem>
                                        <SelectItem value="Bài tập">Bài tập trắc nghiệm</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Thời lượng (Dự kiến)</label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="VD: 15:30 hoặc 20 phút"
                                    className={inputClasses}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-lg font-bold">Trạng thái xuất bản</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="Đã xuất bản"
                                        checked={formData.status === "Đã xuất bản"}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                                    />
                                    <span className="text-sm font-medium text-gray-900">Đã xuất bản (Học viên thấy)</span>
                                </label>
                                
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="Bản nháp"
                                        checked={formData.status === "Bản nháp"}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                                    />
                                    <span className="text-sm font-medium text-gray-900">Lưu nháp (Chưa hoàn thiện)</span>
                                </label>

                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="Đang ẩn"
                                        checked={formData.status === "Đang ẩn"}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500" 
                                    />
                                    <span className="text-sm font-medium text-gray-900">Đang ẩn (Tạm thời vô hiệu hóa)</span>
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default LessonCreate;