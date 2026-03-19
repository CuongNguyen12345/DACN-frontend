import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    Search,
    Filter,
    Clock,
    PlayCircle,
    User,
    BookOpen,
    Star,
    MonitorPlay,
    XCircle,
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

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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

const mockCourses = [
    {
        id: 1,
        title: "Chuyên đề: Khảo sát và vẽ đồ thị hàm số (Vận dụng cao)",
        subject: "Toán",
        grade: 12,
        teacher: "Thầy Nguyễn Văn A",
        difficulty: "Vận dụng cao",
        lessons: 12,
        duration: "4 giờ 30p",
        students: 2100,
        rating: 4.8,
        tags: ["Đại số", "Chương 1"],
    }, {
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
        tags: ["Ngữ pháp", "Từ vựng"],
    }, {
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
    tags: ["Điện học"],
    },{
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
        tags: ["Vô cơ"],
    },
];

const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
        case "Cơ bản":
            return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
        case "Vận dụng":
            return "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200";
        case "Vận dụng cao":
            return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
        default:
            return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
    }
};

const validSubjects = ["Toán", "Lý", "Hóa", "Tiếng Anh"];
const validGrades = ["10", "11", "12"];

const CourseLibrary = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const querySubject = searchParams.get("subject");
    const queryGrade = searchParams.get("grade");
    const queryKeyword = searchParams.get("keyword");

    const [searchTerm, setSearchTerm] = useState(queryKeyword || "");
    const [selectedSubject, setSelectedSubject] = useState(
        validSubjects.includes(querySubject) ? querySubject : "all"
    );
    const [selectedGrade, setSelectedGrade] = useState(
        validGrades.includes(queryGrade) ? queryGrade : "all"
    );

    const filteredCourses = useMemo(() => {
        return mockCourses.filter((course) => {
            const keyword = searchTerm.trim().toLowerCase();

            const matchSearch =
                keyword === "" ||
                course.title.toLowerCase().includes(keyword) ||
                course.teacher.toLowerCase().includes(keyword);

            const matchSubject =
                selectedSubject === "all" || course.subject === selectedSubject;

            const matchGrade =
                selectedGrade === "all" || String(course.grade) === selectedGrade;

            return matchSearch && matchSubject && matchGrade;
        });
    }, [searchTerm, selectedSubject, selectedGrade]);

    const updateQueryParams = ({
        subject = selectedSubject,
        grade = selectedGrade,
        keyword = searchTerm,
    }) => {
        const nextParams = new URLSearchParams();

        if (subject && subject !== "all") {
            nextParams.set("subject", subject);
        }

        if (grade && grade !== "all") {
            nextParams.set("grade", grade);
        }

        if (keyword && keyword.trim() !== "") {
            nextParams.set("keyword", keyword.trim());
        }

        setSearchParams(nextParams);
    };

    const handleSubjectChange = (value) => {
        setSelectedSubject(value);
        updateQueryParams({ subject: value });
    };

    const handleGradeChange = (value) => {
        setSelectedGrade(value);
        updateQueryParams({ grade: value });
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        updateQueryParams({ keyword: value });
    };

    const handleApplyKeyword = () => {
        updateQueryParams({ keyword: searchTerm });
    };

    const handleResetFilter = () => {
        setSearchTerm("");
        setSelectedSubject("all");
        setSelectedGrade("all");
        setSearchParams({});
    };

    const handleStartLearning = (id) => {
        navigate(`/course/learning/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 md:px-8">
            <div className="max-w-[1200px] mx-auto">
                <div className="mb-8 text-center space-y-2">
                    <h2 className="text-3xl font-bold text-primary">
                        Thư viện Bài giảng & Khóa học
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Hệ thống video bài giảng chất lượng cao bám sát chương trình giáo dục mới.
                    </p>
                </div>

                <Card className="mb-8 shadow-sm">
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4">
                            <div className="md:col-span-12 lg:col-span-5">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        placeholder="Tìm kiếm bài giảng, giáo viên..."
                                        className="pl-8 w-full"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-6 lg:col-span-3">
                                <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Môn học" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả môn</SelectItem>
                                        <SelectItem value="Toán">Toán</SelectItem>
                                        <SelectItem value="Lý">Lý</SelectItem>
                                        <SelectItem value="Hóa">Hóa</SelectItem>
                                        <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-6 lg:col-span-2">
                                <Select value={selectedGrade} onValueChange={handleGradeChange}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Lớp" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả lớp</SelectItem>
                                        <SelectItem value="10">Lớp 10</SelectItem>
                                        <SelectItem value="11">Lớp 11</SelectItem>
                                        <SelectItem value="12">Lớp 12</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="md:col-span-12 lg:col-span-2 flex gap-2">
                                <Button
                                    variant="ghost"
                                    onClick={handleResetFilter}
                                    className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                    <XCircle className="h-4 w-4" />
                                    Xóa lọc
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {filteredCourses.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        Không tìm thấy khóa học phù hợp.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {filteredCourses.map((course) => (
                            <Card
                                key={course.id}
                                className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 group"
                            >
                                <CardHeader className="p-5 pb-2 space-y-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                                        >
                                            {course.subject}
                                        </Badge>

                                        <Badge
                                            variant="outline"
                                            className={getDifficultyColor(course.difficulty)}
                                        >
                                            {course.difficulty}
                                        </Badge>
                                    </div>

                                    <CardTitle className="text-base font-bold line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
                                        {course.title}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="p-5 pt-0 flex-1">
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {course.tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                                            >
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2 text-foreground/80 font-medium">
                                            <MonitorPlay className="h-4 w-4 text-blue-500" />
                                            <span className="truncate">{course.teacher}</span>
                                        </div>

                                        <div className="w-full border-t border-dashed my-2" />

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
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100"
                                        onClick={() => handleStartLearning(course.id)}
                                    >
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Vào học ngay
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                1
                            </PaginationLink>
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