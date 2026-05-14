import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Clock,
  HelpCircle,
  User,
  PlayCircle,
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import api from "@/services/api";

const PracticeList = () => {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchExams = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("keyword", debouncedSearch);
      if (subjectFilter !== "all") params.append("subject", subjectFilter);
      if (classFilter !== "all") params.append("grade", classFilter);

      const res = await api.get(`/api/exam/list?${params.toString()}`);
      setExams(res.data || []);
    } catch (error) {
      console.error("Lỗi tải danh sách đề thi:", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, subjectFilter, classFilter]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleStartExam = (id) => {
    navigate(`/practice/room/${id}`);
  };

  const totalPages = Math.max(1, Math.ceil(exams.length / itemsPerPage));
  const paginatedExams = exams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 px-4 sm:px-6 lg:px-8 md:py-8">
      <div className="max-w-[1200px] mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">
            Thư viện Đề thi & Kiểm tra
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto">
            Hàng ngàn đề thi chất lượng được cập nhật liên tục giúp bạn chinh
            phục kỳ thi.
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-white border border-gray-100 rounded-xl p-4 sm:p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
            {/* Ô tìm kiếm */}
            <div className="sm:col-span-2 lg:col-span-7 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm đề thi..."
                className="pl-10 bg-white border-gray-200 rounded-lg h-11 focus:ring-primary/20"
              />
            </div>

            {/* Chọn Môn học */}
            <div className="lg:col-span-2">
              <Select
                value={subjectFilter}
                onValueChange={(val) => {
                  setSubjectFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="bg-white border-gray-200 rounded-lg h-11">
                  <SelectValue placeholder="Tất cả môn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả môn</SelectItem>
                  <SelectItem value="Toán">Toán Học</SelectItem>
                  <SelectItem value="Vật Lý">Vật Lý</SelectItem>
                  <SelectItem value="Hóa Học">Hóa Học</SelectItem>
                  <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Chọn Khối lớp */}
            <div className="lg:col-span-2">
              <Select
                value={classFilter}
                onValueChange={(val) => {
                  setClassFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="bg-white border-gray-200 rounded-lg h-11">
                  <SelectValue placeholder="Tất cả lớp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả lớp</SelectItem>
                  <SelectItem value="Lớp 10">Lớp 10</SelectItem>
                  <SelectItem value="Lớp 11">Lớp 11</SelectItem>
                  <SelectItem value="Lớp 12">Lớp 12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nút Xóa lọc */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSubjectFilter("all");
                  setClassFilter("all");
                  setCurrentPage(1);
                }}
                className="w-full bg-white border-gray-200 rounded-lg h-11 font-medium hover:bg-gray-50 hover:border-gray-300"
              >
                Xóa lọc
              </Button>
            </div>
          </div>
        </div>

        {/* Exam List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {isLoading ? (
            <div className="col-span-full text-center py-10 text-slate-500">
              Đang tải danh sách đề thi...
            </div>
          ) : paginatedExams.length > 0 ? (
            paginatedExams.map((exam) => (
              <Card
                key={exam.id}
                className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                onClick={() => handleStartExam(exam.id)}
              >
                <CardHeader className="p-5 pb-2 space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                    >
                      {exam.subject}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-slate-100 text-slate-700"
                    >
                      {exam.grade}
                    </Badge>
                  </div>
                  <CardTitle
                    className="text-base font-bold line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors"
                    title={exam.title}
                  >
                    {exam.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-0 flex-1">
                  <div className="space-y-2 text-sm text-muted-foreground mt-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Thời gian: {exam.duration} phút</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      <span>Số câu hỏi: {exam.questionCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Đã làm: {exam.attemptCount || 0}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-5 pt-0 mt-auto">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    <PlayCircle className="mr-2 h-4 w-4" /> Bắt đầu làm bài
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-slate-500">
              Không tìm thấy đề thi phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination className="overflow-x-auto pb-2">
            <PaginationContent className="min-w-max">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.max(1, p - 1));
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
};

export default PracticeList;
