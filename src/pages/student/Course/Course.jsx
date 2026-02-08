import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    Clock,
    PlayCircle, // Dùng icon này cho số lượng bài học
    User,
    BookOpen, // Icon cho nút Vào học
    Star, // Icon đánh giá
    MonitorPlay // Icon giáo viên/bài giảng
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const CourseLibrary = () => {
    const navigate = useNavigate();

    // 1. Mock Data: Dữ liệu giả lập cho Khóa học/Bài giảng
    const courses = [
        {
            id: 1,
            title: "Chuyên đề: Khảo sát và vẽ đồ thị hàm số (Vận dụng cao)",
            subject: "Toán",
            grade: 12,
            teacher: "Thầy Nguyễn Văn A",
            difficulty: "Vận dụng cao",
            lessons: 12, // Số bài giảng
            duration: "4 giờ 30p", // Tổng thời lượng
            students: 2100, // Số học sinh đang học
            rating: 4.8,
            tags: ["Đại số", "Chương 1"]
        },
        {
            id: 2,
            title: "Tiếng Anh 12 - Ôn thi THPT QG: Ngữ pháp trọng điểm",
            subject: "Tiếng Anh",
            grade: 12,
            teacher: "Cô Sarah Nguyen",
            difficulty: "Vận dụng",
            lessons: 25,
            duration: "10 giờ",
            students: 3400,
            rating: 4.9,
            tags: ["Ngữ pháp", "Từ vựng"]
        },
        {
            id: 3,
            title: "Vật Lý 11 - Điện tích & Định luật Coulomb",
            subject: "Lý",
            grade: 11,
            teacher: "Thầy Lê Bá Tùng",
            difficulty: "Cơ bản",
            lessons: 8,
            duration: "2 giờ 15p",
            students: 850,
            rating: 4.5,
            tags: ["Điện học"]
        },
        {
            id: 4,
            title: "Hóa học 10 - Cấu tạo nguyên tử & Bảng tuần hoàn",
            subject: "Hóa",
            grade: 10,
            teacher: "Cô Trần Thị B",
            difficulty: "Vận dụng",
            lessons: 15,
            duration: "5 giờ",
            students: 1200,
            rating: 4.7,
            tags: ["Vô cơ"]
        },
    ];

    // Helper: Màu sắc cho độ khó (Giữ nguyên logic của bạn)
    const getDifficultyColor = (diff) => {
        switch (diff) {
            case "Cơ bản": return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
            case "Vận dụng": return "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200";
            case "Vận dụng cao": return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
            default: return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
        }
    };

    const handleStartLearning = (id) => {
        // Điều hướng sang trang chi tiết bài học (Learning Page mà mình đã làm trước đó)
        navigate(`/course/learning/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 md:px-8">
            <div className="max-w-[1200px] mx-auto">
                {/* Header Section - Đổi nội dung Text */}
                <div className="mb-8 text-center space-y-2">
                    <h2 className="text-3xl font-bold text-primary">Thư viện Bài giảng & Khóa học</h2>
                    <p className="text-muted-foreground text-lg">
                        Hệ thống video bài giảng chất lượng cao bám sát chương trình giáo dục mới.
                    </p>
                </div>

                {/* Filter Section - Giữ nguyên cấu trúc, chỉ sửa placeholder */}
                <Card className="mb-8 shadow-sm">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                            <div className="lg:col-span-12 xl:col-span-3">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm kiếm bài giảng, giáo viên..." // Update placeholder
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                            <div className="lg:col-span-6 xl:col-span-2">
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Môn học" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="math">Toán</SelectItem>
                                        <SelectItem value="physics">Lý</SelectItem>
                                        <SelectItem value="chemistry">Hóa</SelectItem>
                                        <SelectItem value="english">Tiếng Anh</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="lg:col-span-6 xl:col-span-2">
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Lớp" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">Lớp 10</SelectItem>
                                        <SelectItem value="11">Lớp 11</SelectItem>
                                        <SelectItem value="12">Lớp 12</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Đổi "Loại đề" thành "Chuyên đề" hoặc bỏ đi nếu không cần */}
                            <div className="lg:col-span-6 xl:col-span-2">
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sắp xếp" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Mới nhất</SelectItem>
                                        <SelectItem value="popular">Phổ biến nhất</SelectItem>
                                        <SelectItem value="rating">Đánh giá cao</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="lg:col-span-6 xl:col-span-2">
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Độ khó" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="basic">Cơ bản</SelectItem>
                                        <SelectItem value="advanced">Vận dụng</SelectItem>
                                        <SelectItem value="master">Vận dụng cao</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="lg:col-span-12 xl:col-span-1">
                                <Button className="w-full" type="submit">
                                    <Filter className="mr-2 h-4 w-4 md:hidden xl:block" /> Lọc
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Course List - Render danh sách bài giảng */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {courses.map((course) => (
                        <Card key={course.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group" onClick={() => handleStartLearning(course.id)}>
                            <CardHeader className="p-5 pb-2 space-y-3">
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                                        {course.subject}
                                    </Badge>
                                    <Badge variant="outline" className={getDifficultyColor(course.difficulty)}>
                                        {course.difficulty}
                                    </Badge>
                                </div>
                                <CardTitle className="text-base font-bold line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                                    {course.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 pt-0 flex-1">
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {course.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                                
                                {/* Thông tin chi tiết bài giảng */}
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {/* Thêm tên Giáo viên */}
                                    <div className="flex items-center gap-2 text-foreground/80 font-medium">
                                        <MonitorPlay className="h-4 w-4 text-blue-500" />
                                        <span className="truncate">{course.teacher}</span>
                                    </div>
                                    <div className="w-full border-t border-dashed my-2"></div>
                                    
                                    <div className="grid grid-cols-2 gap-y-2">
                                        <div className="flex items-center gap-2" title="Tổng thời lượng">
                                            <Clock className="h-4 w-4" />
                                            <span>{course.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2" title="Số lượng bài học">
                                            <PlayCircle className="h-4 w-4" />
                                            <span>{course.lessons} bài</span>
                                        </div>
                                        <div className="flex items-center gap-2" title="Số học sinh">
                                            <User className="h-4 w-4" />
                                            <span>{course.students}</span>
                                        </div>
                                        <div className="flex items-center gap-2" title="Đánh giá">
                                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                            <span>{course.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-5 pt-0 mt-auto">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100">
                                    <BookOpen className="mr-2 h-4 w-4" /> Vào học ngay
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Pagination - Giữ nguyên */}
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default CourseLibrary;