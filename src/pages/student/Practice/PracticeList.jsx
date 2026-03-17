import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    Clock,
    HelpCircle,
    User,
    PlayCircle
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator"; // Ensure imports are correct if I created separator
// If separator wasn't created, check logic? I saw it in the list.

const PracticeList = () => {
    const navigate = useNavigate();

    // Mock Exam Data
    const exams = [
        {
            id: 1,
            title: "Đề thi thử THPT QG 2025 - Môn Toán (Lần 1)",
            subject: "Toán",
            grade: 12,
            type: "Thi thử THPT QG",
            difficulty: "Vận dụng cao",
            questions: 50,
            time: 90, // minutes
            users: 1542,
            tags: ["Đại số", "Hình học"]
        },
        {
            id: 2,
            title: "Kiểm tra 1 tiết - Hàm số mũ & Logarit",
            subject: "Toán",
            grade: 12,
            type: "1 tiết",
            difficulty: "Vận dụng",
            questions: 25,
            time: 45,
            users: 850,
            tags: ["Chương 2"]
        },
        {
            id: 3,
            title: "Đề ôn tập Vật lý 11 - Chương Điện tích",
            subject: "Lý",
            grade: 11,
            type: "Chuyên đề",
            difficulty: "Cơ bản",
            questions: 20,
            time: 30,
            users: 530,
            tags: ["Điện học"]
        },
        {
            id: 4,
            title: "Đề thi Hóa học 10 - Giữa học kỳ 1",
            subject: "Hóa",
            grade: 10,
            type: "Thi học kỳ",
            difficulty: "Vận dụng",
            questions: 40,
            time: 60,
            users: 1020,
            tags: ["Cấu tạo nguyên tử"]
        },
    ];

    // Colors for difficulty (Tailwind classes)
    const getDifficultyColor = (diff) => {
        switch (diff) {
            case "Cơ bản": return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
            case "Vận dụng": return "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200";
            case "Vận dụng cao": return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
            default: return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
        }
    };

    const handleStartExam = (id) => {
        navigate(`/practice/room/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 md:px-8">
            <div className="max-w-[1200px] mx-auto">
                {/* Header Section */}
                <div className="mb-8 text-center space-y-2">
                    <h2 className="text-3xl font-bold text-primary">Thư viện Đề thi & Kiểm tra</h2>
                    <p className="text-muted-foreground text-lg">
                        Hàng ngàn đề thi chất lượng được cập nhật liên tục giúp bạn chinh phục kỳ thi.
                    </p>
                </div>

                {/* Filter Section */}
                <Card className="mb-8 shadow-sm">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                            <div className="lg:col-span-12 xl:col-span-3">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm kiếm đề thi..."
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
                            <div className="lg:col-span-6 xl:col-span-2">
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Loại đề" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="15m">Kiểm tra 15p</SelectItem>
                                        <SelectItem value="45m">1 Tiết</SelectItem>
                                        <SelectItem value="semester">Thi Học kỳ</SelectItem>
                                        <SelectItem value="mock">Thi thử THPT QG</SelectItem>
                                        <SelectItem value="topic">Theo Chuyên đề</SelectItem>
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

                {/* Exam List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {exams.map((exam) => (
                        <Card key={exam.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group" onClick={() => handleStartExam(exam.id)}>
                            <CardHeader className="p-5 pb-2 space-y-3">
                                <div className="flex justify-between items-start">
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                                        {exam.subject}
                                    </Badge>
                                    <Badge variant="outline" className={getDifficultyColor(exam.difficulty)}>
                                        {exam.difficulty}
                                    </Badge>
                                </div>
                                <CardTitle className="text-base font-bold line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                                    {exam.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 pt-0 flex-1">
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {exam.tags.map(tag => (
<<<<<<< HEAD
                                        <Badge key={tag} variant="secondary" className="text-xs font-normal text-muted-foreground">
=======
                                        <Badge key={tag} variant="secondary" className="text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200">
>>>>>>> nhanh_cua_Hao
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>Thời gian: {exam.time} phút</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <HelpCircle className="h-4 w-4" />
                                        <span>Số câu: {exam.questions}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span>Đã làm: {exam.users}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-5 pt-0 mt-auto">
                                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                                    <PlayCircle className="mr-2 h-4 w-4" /> Làm bài ngay
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

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

export default PracticeList;
