import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Video,
    UploadCloud,
    BookOpen,
    Plus,
    X,
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
        classLevel: "Lớp 10",
        subject: "Toán học",
        status: "Bản nháp", // Đã xuất bản | Bản nháp | Đang ẩn
        description: "",
        videoUrl: "",
        chapter: "",
    });

    // State cho việc quản lý Chương
    const [chapters, setChapters] = useState([
        "Chương 1: Mệnh đề",
        "Chương 2: Bất phương trình và hệ bất phương trình bậc nhất hai ẩn",
        "Chương 3: Hệ thức lượng trong tam giác"
    ]);
    const [isAddingChapter, setIsAddingChapter] = useState(false);
    const [newChapterName, setNewChapterName] = useState("");

    // State cho bài tập luyện tập
    const [exercises, setExercises] = useState([]);
    const [isAddingExercise, setIsAddingExercise] = useState(false);
    const defaultExercise = { title: "", description: "", question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A" };
    const [newExercise, setNewExercise] = useState(defaultExercise);

    // Xử lý thêm chương mới
    const handleAddChapter = () => {
        if (newChapterName.trim()) {
            setChapters([...chapters, newChapterName.trim()]);
            handleSelectChange("chapter", newChapterName.trim());
        }
        setIsAddingChapter(false);
        setNewChapterName("");
    };

    // Xử lý thêm bài tập mới
    const handleAddExercise = () => {
        if (newExercise.title.trim() && newExercise.question.trim()) {
            setExercises([...exercises, { id: Date.now(), ...newExercise }]);
            setNewExercise(defaultExercise);
            setIsAddingExercise(false);
        } else {
            alert("Vui lòng nhập tên bài tập và nội dung câu hỏi!");
        }
    };

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
        const finalData = {
            ...formData,
            exercises
        };
        console.log("Dữ liệu bài học mới:", finalData);
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
                        <CardHeader className="pb-4 border-b flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold">Bài tập luyện tập</CardTitle>
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingExercise(true)}>
                                <Plus className="w-4 h-4 mr-1" /> Thêm bài tập
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {exercises.length === 0 && !isAddingExercise ? (
                                <div className="text-center py-6 text-gray-500">
                                    Chưa có bài tập nào. Hãy thêm bài tập để học viên luyện tập kèm theo bài học này.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {exercises.map((ex, index) => (
                                        <div key={ex.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-md bg-white shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-100 text-blue-600 p-2 rounded-md">
                                                    <BookOpen className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{ex.title}</h4>
                                                    {ex.description && <p className="text-sm text-gray-500">{ex.description}</p>}
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => setExercises(exercises.filter(e => e.id !== ex.id))}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {isAddingExercise && (
                                <div className="p-5 border border-blue-200 bg-blue-50/50 rounded-md space-y-4 mt-4">
                                    <h4 className="font-medium text-gray-900 text-sm">Thêm bài tập mới</h4>
                                    <div className="space-y-3">
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">Tên bài tập <span className="text-red-500">*</span></label>
                                            <input
                                                type="text"
                                                value={newExercise.title}
                                                onChange={(e) => setNewExercise({ ...newExercise, title: e.target.value })}
                                                placeholder="VD: Bài tập trắc nghiệm số 1"
                                                className={inputClasses}
                                                autoFocus
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">Mô tả (tùy chọn)</label>
                                            <input
                                                type="text"
                                                value={newExercise.description}
                                                onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                                                placeholder="VD: 10 câu hỏi, thời gian 15 phút"
                                                className={inputClasses}
                                            />
                                        </div>

                                        <div className="space-y-1.5 mt-4">
                                            <label className="text-sm font-medium text-gray-700">Câu hỏi <span className="text-red-500">*</span></label>
                                            <textarea
                                                value={newExercise.question}
                                                onChange={(e) => setNewExercise({ ...newExercise, question: e.target.value })}
                                                placeholder="Nhập nội dung câu hỏi..."
                                                rows="2"
                                                className={inputClasses}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-gray-700">Đáp án A</label>
                                                <input
                                                    type="text"
                                                    value={newExercise.optionA}
                                                    onChange={(e) => setNewExercise({ ...newExercise, optionA: e.target.value })}
                                                    placeholder="Nhập đáp án A"
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-gray-700">Đáp án B</label>
                                                <input
                                                    type="text"
                                                    value={newExercise.optionB}
                                                    onChange={(e) => setNewExercise({ ...newExercise, optionB: e.target.value })}
                                                    placeholder="Nhập đáp án B"
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-gray-700">Đáp án C</label>
                                                <input
                                                    type="text"
                                                    value={newExercise.optionC}
                                                    onChange={(e) => setNewExercise({ ...newExercise, optionC: e.target.value })}
                                                    placeholder="Nhập đáp án C"
                                                    className={inputClasses}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-gray-700">Đáp án D</label>
                                                <input
                                                    type="text"
                                                    value={newExercise.optionD}
                                                    onChange={(e) => setNewExercise({ ...newExercise, optionD: e.target.value })}
                                                    placeholder="Nhập đáp án D"
                                                    className={inputClasses}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 mt-2">
                                            <label className="text-sm font-medium text-gray-700">Đáp án đúng <span className="text-red-500">*</span></label>
                                            <Select
                                                value={newExercise.correctAnswer}
                                                onValueChange={(value) => setNewExercise({ ...newExercise, correctAnswer: value })}
                                            >
                                                <SelectTrigger className="w-full bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                                                    <SelectValue placeholder="Chọn đáp án đúng" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="A">Đáp án A</SelectItem>
                                                    <SelectItem value="B">Đáp án B</SelectItem>
                                                    <SelectItem value="C">Đáp án C</SelectItem>
                                                    <SelectItem value="D">Đáp án D</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                    </div>
                                    <div className="flex gap-2 pt-4">
                                        <Button type="button" onClick={handleAddExercise} className="bg-blue-600 hover:bg-blue-700 text-white">
                                            Lưu bài tập
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => setIsAddingExercise(false)}>
                                            Hủy
                                        </Button>
                                    </div>
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
                                        <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Shadcn Select: Lớp */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Lớp</label>
                                <Select
                                    value={formData.classLevel}
                                    onValueChange={(value) => handleSelectChange("classLevel", value)}
                                >
                                    <SelectTrigger className="w-full bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                                        <SelectValue placeholder="Chọn lớp" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Lớp 10">Lớp 10</SelectItem>
                                        <SelectItem value="Lớp 11">Lớp 11</SelectItem>
                                        <SelectItem value="Lớp 12">Lớp 12</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Shadcn Select: Chương (Creatable) */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900">Chương</label>
                                {!isAddingChapter ? (
                                    <div className="flex gap-2">
                                        <Select
                                            value={formData.chapter}
                                            onValueChange={(value) => handleSelectChange("chapter", value)}
                                        >
                                            <SelectTrigger className="w-full bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                                                <SelectValue placeholder="Chọn chương" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {chapters.map(chapter => (
                                                    <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setIsAddingChapter(true)}
                                            className="px-3"
                                            title="Thêm chương mới"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 p-3 border border-blue-100 bg-blue-50/50 rounded-md">
                                        <input
                                            type="text"
                                            value={newChapterName}
                                            onChange={(e) => setNewChapterName(e.target.value)}
                                            placeholder="Nhập tên chương mới"
                                            className={inputClasses}
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                onClick={handleAddChapter}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-9"
                                            >
                                                Thêm
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setIsAddingChapter(false)}
                                                className="flex-1 h-9"
                                            >
                                                Hủy
                                            </Button>
                                        </div>
                                    </div>
                                )}
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
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
};

export default LessonCreate;