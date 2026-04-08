import React, { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import FilterSection from "./components/FilterSection";
import ChapterAccordion from "./components/ChapterAccordion";
import VideoModal from "./components/VideoModal";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";

/**
 * Trang tìm kiếm và học tập bài giảng (Course Search)
 */
const CourseSearch = () => {
    const [searchParams] = useSearchParams();
    const querySubject = searchParams.get("subject");
    const queryGrade = searchParams.get("grade");

    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGrade, setSelectedGrade] = useState(queryGrade || "all"); 
    const [selectedSubject, setSelectedSubject] = useState(querySubject || "all"); 
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    // Hàm gọi API lấy dữ liệu bài học
    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/course", {
                params: {
                    grade: selectedGrade,
                    subject: selectedSubject,
                    keyword: searchTerm
                }
            });
            setChapters(response.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu bài học:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedGrade, selectedSubject, searchTerm]);

    // Gọi API ngay khi bộ lọc thay đổi
    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    // Reset bộ lọc về trạng thái ban đầu
    const handleReset = () => {
        setSearchTerm("");
        setSelectedGrade("all");
        setSelectedSubject("all");
    };

    // Xử lý khi nhấn vào bài học
    const handleLessonSelect = (lesson) => {
        setSelectedLesson(lesson);
        setIsVideoModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 px-4 md:px-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <header className="space-y-3 border-b pb-8 border-slate-200">
                    <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold mb-2">
                        HỌC TẬP TRỰC TUYẾN
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Thư viện Bài giảng Edu4All
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl">
                        Khám phá kho tri thức với hàng nghìn bài giảng video chất lượng cao, 
                        bám sát chương trình phổ thông của Bộ Giáo dục.
                    </p>
                </header>

                {/* Filter & Search Section */}
                <FilterSection 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    selectedGrade={selectedGrade}
                    setSelectedGrade={setSelectedGrade}
                    selectedSubject={selectedSubject}
                    setSelectedSubject={setSelectedSubject}
                    onReset={handleReset}
                />

                {/* Main Content Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-slate-500 font-medium">Đang tìm kiếm bài học...</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                        {chapters.length > 0 ? (
                            <ChapterAccordion 
                                chapters={chapters} 
                                onLessonSelect={handleLessonSelect} 
                            />
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                                <p className="text-slate-400 text-lg">Không tìm thấy bài học phù hợp với bộ lọc hiện tại.</p>
                                <button 
                                    onClick={handleReset}
                                    className="mt-4 text-primary font-bold hover:underline"
                                >
                                    Thử lại với khối lớp/môn học khác
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal trình phát Video */}
            <VideoModal 
                lesson={selectedLesson}
                isOpen={isVideoModalOpen}
                onClose={() => setIsVideoModalOpen(false)}
            />
        </div>
    );
};

export default CourseSearch;