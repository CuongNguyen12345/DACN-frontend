import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UploadCloud, FileText, X, Save, Loader2 } from "lucide-react";

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

const ExamEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { basePath } = useAuth();
    
    const [isLoading, setIsLoading] = useState(true);
    const [examData, setExamData] = useState({
        title: "",
        subject: "Toán học",
        duration: 60,
        questions: 50,
        status: "Bản nháp",
        description: "",
    });

    const [existingFile, setExistingFile] = useState({ name: `De_Thi_${id}.pdf`, size: 2.4 }); 
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchExamData = async () => {
            setIsLoading(true);
            try {
                // Giả lập call API
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                setExamData({
                    title: "Đề thi thử THPT QG Môn Toán 2025 - Lần 1",
                    subject: "Toán học",
                    duration: 90,
                    questions: 50,
                    status: "Đang mở",
                    description: "Đề bám sát cấu trúc đề minh họa của BGD năm 2025. Dành cho học sinh trung bình khá trở lên.",
                });
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchExamData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExamData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setExamData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setExistingFile(null); 
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        setExistingFile(null);
    };

    const handleSave = () => {
        console.log("Dữ liệu cập nhật cho ID", id, ":", examData);
        if (selectedFile) console.log("File mới đính kèm:", selectedFile);
        alert(`Cập nhật đề thi ${id} thành công!`);
        navigate(`/${basePath}/exams`);
    };

    const inputClasses = "flex w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-gray-500 text-sm">Đang tải dữ liệu đề thi...</p>
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
                        <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa đề thi</h2>
                        <p className="text-gray-500 text-sm mt-1">ID: #{id} • Cập nhật thông tin hoặc tài liệu</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate(-1)}>Hủy</Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4 mr-2" /> Lưu thay đổi
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cột trái: Thông tin chính */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-lg font-bold">Thông tin cơ bản</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Tên đề thi <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    name="title"
                                    value={examData.title}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Mô tả ngắn</label>
                                <textarea 
                                    name="description"
                                    value={examData.description}
                                    onChange={handleChange}
                                    rows="3" 
                                    className={inputClasses}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-4 border-b flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold mt-1">Tài liệu đính kèm</CardTitle>
                            {existingFile && (
                                <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-1 rounded">Đã có file</span>
                            )}
                        </CardHeader>
                        <CardContent className="p-6">
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
                        </CardContent>
                    </Card>
                </div>

                {/* Cột phải: Cài đặt */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-lg font-bold">Cài đặt đề thi</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Môn học</label>
                                <Select value={examData.subject} onValueChange={(value) => handleSelectChange("subject", value)}>
                                    <SelectTrigger className="w-full bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                                        <SelectValue placeholder="Chọn môn học" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Toán học">Toán học</SelectItem>
                                        <SelectItem value="Vật lý">Vật lý</SelectItem>
                                        <SelectItem value="Hóa học">Hóa học</SelectItem>
                                        <SelectItem value="Sinh học">Sinh học</SelectItem>
                                        <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                                        <SelectItem value="Ngữ Văn">Ngữ Văn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">Thời gian (phút)</label>
                                    <input 
                                        type="number" 
                                        name="duration"
                                        value={examData.duration}
                                        onChange={handleChange}
                                        className={inputClasses}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">Số câu</label>
                                    <input 
                                        type="number" 
                                        name="questions"
                                        value={examData.questions}
                                        onChange={handleChange}
                                        className={inputClasses}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Trạng thái</label>
                                <Select value={examData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                                    <SelectTrigger className="w-full bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                                        <SelectValue placeholder="Chọn trạng thái" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Bản nháp">Bản nháp (Ẩn)</SelectItem>
                                        <SelectItem value="Đang mở">Đang mở (Công khai)</SelectItem>
                                        <SelectItem value="Đã đóng">Đã đóng</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ExamEdit;