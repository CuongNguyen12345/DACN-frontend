import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Video,
    UploadCloud,
    BookOpen,
    Plus,
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
import api from "@/services/api";

const LessonEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { basePath } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: "",
        subject: "Toán học",
        classLevel: "Lớp 10",
        description: "",
        videoUrl: "",
        chapterId: "",
    });

    const [chapters, setChapters] = useState([]);
    const [isAddingChapter, setIsAddingChapter] = useState(false);
    const [newChapterName, setNewChapterName] = useState("");

    // Fetch bài học hiện tại
    useEffect(() => {
        const fetchLessonData = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/api/admin/lessons/${id}`);
                const lesson = response.data;
                
                setFormData({
                    title: lesson.lessonName,
                    subject: lesson.subject || "Toán học",
                    classLevel: lesson.grade || "Lớp 10",
                    description: lesson.content || "",
                    videoUrl: lesson.videoUrl || "",
                    chapterId: lesson.chapterId ? lesson.chapterId.toString() : "",
                });
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu bài học:", error);
                alert("Không thể tải dữ liệu bài học.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchLessonData();
    }, [id]);

    // Fetch chapters khi môn học hoặc lớp thay đổi
    useEffect(() => {
        if (!formData.subject || !formData.classLevel) return;
        
        const fetchChapters = async () => {
            try {
                const response = await api.get(`/api/admin/chapters?subject=${formData.subject}&grade=${formData.classLevel}`);
                setChapters(response.data);
                // Đừng tự động reset chapterId nếu nó đã có (để giữ chapterId cũ của bài học)
            } catch (error) {
                console.error("Lỗi khi tải chương:", error);
                setChapters([]);
            }
        };
        fetchChapters();
    }, [formData.subject, formData.classLevel]);

    const handleAddChapter = async () => {
        if (!newChapterName.trim()) return;
        try {
            const response = await api.post("/api/admin/chapters", {
                subjectName: formData.subject,
                grade: formData.classLevel,
                chapterName: newChapterName.trim(),
                orderNumber: chapters.length + 1
            });
            const newChapter = response.data;
            setChapters([...chapters, newChapter]);
            setFormData(prev => ({ ...prev, chapterId: newChapter.id.toString() }));
            setIsAddingChapter(false);
            setNewChapterName("");
            alert("Thêm chương mới thành công!");
        } catch (error) {
            console.error("Lỗi khi thêm chương:", error);
            alert("Không thể thêm chương mới.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.chapterId) {
            alert("Vui lòng chọn chương cho bài học!");
            return;
        }

        try {
            const requestData = {
                chapterId: parseInt(formData.chapterId),
                lessonName: formData.title,
                content: formData.description,
                videoUrl: formData.videoUrl || null
            };
            
            await api.put(`/api/admin/lessons/${id}`, requestData);
            alert("Cập nhật bài học thành công!");
            navigate(`/${basePath}/lessons`);
        } catch (error) {
            console.error("Lỗi khi cập nhật bài học:", error);
            alert("Cập nhật bài học thất bại.");
        }
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
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-gray-100">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài học</h2>
                        <p className="text-gray-500 text-sm mt-1">ID: #{id} • Cập nhật nội dung bài giảng</p>
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
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-lg font-bold">Thông tin chung</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Tên bài học <span className="text-red-500">*</span></label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputClasses} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Mô tả ngắn</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className={inputClasses} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-lg font-bold">Nội dung bài giảng</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-900">Link Video (YouTube/Vimeo)</label>
                                    <div className="relative">
                                        <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input type="url" name="videoUrl" value={formData.videoUrl} onChange={handleChange} className={`${inputClasses} pl-10`} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-4 border-b">
                            <CardTitle className="text-lg font-bold">Phân loại & Cài đặt</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Môn học</label>
                                <Select value={formData.subject} onValueChange={(value) => handleSelectChange("subject", value)}>
                                    <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Chọn môn học" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Toán học">Toán học</SelectItem>
                                        <SelectItem value="Vật lý">Vật lý</SelectItem>
                                        <SelectItem value="Hóa học">Hóa học</SelectItem>
                                        <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Lớp</label>
                                <Select value={formData.classLevel} onValueChange={(value) => handleSelectChange("classLevel", value)}>
                                    <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Chọn lớp" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Lớp 10">Lớp 10</SelectItem>
                                        <SelectItem value="Lớp 11">Lớp 11</SelectItem>
                                        <SelectItem value="Lớp 12">Lớp 12</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Chương</label>
                                {!isAddingChapter ? (
                                    <div className="flex gap-2">
                                        <Select value={formData.chapterId} onValueChange={(value) => handleSelectChange("chapterId", value)}>
                                            <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Chọn chương" /></SelectTrigger>
                                            <SelectContent>
                                                {chapters.map(chapter => (
                                                    <SelectItem key={chapter.id} value={chapter.id.toString()}>{chapter.chapterName}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button type="button" variant="outline" onClick={() => setIsAddingChapter(true)} className="px-3"><Plus className="w-4 h-4" /></Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 p-3 border border-blue-100 bg-blue-50/50 rounded-md">
                                        <input type="text" value={newChapterName} onChange={(e) => setNewChapterName(e.target.value)} placeholder="Tên chương mới" className={inputClasses} autoFocus />
                                        <div className="flex gap-2">
                                            <Button type="button" onClick={handleAddChapter} className="flex-1 bg-blue-600 text-white h-9">Thêm</Button>
                                            <Button type="button" variant="outline" onClick={() => setIsAddingChapter(false)} className="flex-1 h-9">Hủy</Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default LessonEdit;