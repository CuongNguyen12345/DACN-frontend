import React, { useState, useEffect, useCallback } from "react";
import api from "@/services/api";
import FilterSection from "./components/FilterSection";
import ChapterAccordion from "./components/ChapterAccordion";
import VideoModal from "./components/VideoModal";
import { Loader2, ArrowLeft } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

/**
 * Trang tìm kiếm và học tập bài giảng (Course Search)
 */
const CourseSearch = () => {
    const navigate = useNavigate();
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
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 3;

    // Hàm gọi API lấy dữ liệu bài học
    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/learning/course", {
                params: {
                    grade: selectedGrade,
                    subject: selectedSubject,
                    keyword: searchTerm,
                    page: currentPage,
                    size: pageSize
                }
            });
            // Updated to handle PageResponse structure
            setChapters(response.data.data || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu bài học:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedGrade, selectedSubject, searchTerm, currentPage]);

    // Gọi API ngay khi bộ lọc thay đổi
    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    // Reset bộ lọc về trạng thái ban đầu
    const handleReset = () => {
        setSearchTerm("");
        setSelectedGrade("all");
        setSelectedSubject("all");
        setCurrentPage(1);
    };

    // Reset page to 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedGrade, selectedSubject]);

    // Xử lý khi nhấn vào bài học
    const handleLessonSelect = (lesson) => {
        setSelectedLesson(lesson);
        setIsVideoModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-10 px-4 md:px-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 border-slate-200">
                    <header className="space-y-3">
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
                    <button
                        onClick={() => navigate("/course")}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Chọn Môn học & Khối lớp
                    </button>
                </div>

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
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 space-y-8">
                        {chapters.length > 0 ? (
                            <>
                                <ChapterAccordion
                                    chapters={chapters}
                                    onLessonSelect={handleLessonSelect}
                                />
                                
                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex justify-center items-center gap-2 pt-8 pb-12">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Trước
                                        </button>
                                        
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                                                    currentPage === i + 1
                                                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                                                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Tiếp
                                        </button>
                                    </div>
                                )}
                            </>
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