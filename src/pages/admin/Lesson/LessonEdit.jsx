import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Video,
    UploadCloud,
    BookOpen,
    Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useAuth } from "@/context/AuthContext";

const LessonEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { basePath } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        subject: "Toán học",
        type: "Video",
        duration: "",
        status: "Bản nháp",
        description: "",
        videoUrl: "",
    });

    useEffect(() => {
        const fetchLessonData = async () => {
            setIsLoading(true);
            try {
                // Giả lập call API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                setFormData({
                    title: "Khảo sát sự biến thiên và vẽ đồ thị hàm số",
                    subject: "Toán học",
                    type: "Video",
                    duration: "45 phút",
                    status: "Đã xuất bản",
                    description: "Hướng dẫn chi tiết các bước khảo sát hàm số bậc 3, bậc 4 và hàm phân thức.",
                    videoUrl: "https://youtube.com/watch?v=demo123",
                });
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchLessonData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dữ liệu cập nhật:", formData);
        alert("Cập nhật bài học thành công!");
        navigate(`/${basePath}/lessons`);
    };

    const inputClasses = "flex w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-gray-500 text-sm">Đang tải dữ liệu bài học...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-10">
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
                        <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài học</h2>
                        <p className="text-gray-500 text-sm mt-1">ID: #{id} • Đang cập nhật nội dung</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate(-1)}>Hủy</Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4 mr-2" /> Cập nhật
                    </Button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cột Trái: Nội dung chính */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-lg font-bold">Thông tin chung</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Tên bài học <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
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
                                                className={`${inputClasses} pl-10`}
                                            />
                                        </div>
                                    </div>
                                    <div className="w-full h-48 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                                        <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                                        <p className="text-sm">Thay đổi video tải lên</p>
                                        <Button type="button" variant="link" className="text-blue-600">Chọn file mới</Button>
                                    </div>
                                </div>
                            )}

                            {formData.type === "Lý thuyết" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">Soạn thảo văn bản</label>
                                    <div className="w-full h-64 border border-gray-200 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
                                        <p>[Khu vực Rich Text Editor có chứa nội dung cũ]</p>
                                    </div>
                                </div>
                            )}

                            {formData.type === "Bài tập" && (
                                <div className="space-y-2 flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                                    <BookOpen className="w-10 h-10 text-gray-300 mb-3" />
                                    <p className="text-sm text-gray-600 font-medium">Quản lý câu hỏi trắc nghiệm</p>
                                    <Button type="button" variant="outline" className="mt-2">Mở ngân hàng câu hỏi</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Cột Phải: Phân loại & Cài đặt */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-lg font-bold">Cài đặt bài học</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Môn học</label>
                                <Select value={formData.subject} onValueChange={(value) => handleSelectChange("subject", value)}>
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

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Định dạng bài</label>
                                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
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
                                    className={inputClasses}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Trạng thái xuất bản</label>
                                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                                    <SelectTrigger className="w-full bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Đã xuất bản">Đã xuất bản</SelectItem>
                                        <SelectItem value="Bản nháp">Lưu nháp</SelectItem>
                                        <SelectItem value="Đang ẩn">Đang ẩn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default LessonEdit;