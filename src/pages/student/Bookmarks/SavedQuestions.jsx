import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
// Import Pagination của Shadcn (Nhớ cài đặt: npx shadcn-ui@latest add pagination)
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const SavedQuestions = () => {
    // 1. State quản lý trang hiện tại
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Số câu hỏi trên 1 trang

    // Mock Data (Giả sử bạn có 12 câu)
    const savedItems = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        subject: i % 2 === 0 ? "Toán học" : "Vật lý",
        question: `Đây là nội dung câu hỏi khó số ${i + 1} mà bạn đã lưu lại để ôn tập...`,
        options: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
        correctAnswer: "Đáp án A",
    }));

    // 2. Logic tính toán phân trang
    const totalPages = Math.ceil(savedItems.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = savedItems.slice(indexOfFirstItem, indexOfLastItem); // Cắt mảng để lấy data của trang hiện tại

    // 3. Hàm chuyển trang
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header của Tab */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Câu hỏi đã lưu của bạn</h3>
                <Badge variant="outline">{savedItems.length} câu hỏi</Badge>
            </div>

            {/* Danh sách câu hỏi (Chỉ render currentItems) */}
            <div className="space-y-4">
                {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                        <Card key={item.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                                {/* ... Giao diện từng câu hỏi giữ nguyên như mình đã làm ... */}
                                <div className="flex justify-between items-start mb-3">
                                    <Badge className="bg-indigo-100 text-indigo-700 border-none">{item.subject}</Badge>
                                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="font-medium text-slate-900 mb-4">{item.question}</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-500">Bạn chưa lưu câu hỏi nào.</div>
                )}
            </div>

            {/* 4. Thanh Phân Trang */}
            {totalPages > 1 && (
                <Pagination className="justify-end mt-6">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                onClick={() => handlePageChange(currentPage - 1)}
                                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                        
                        {/* Tạo các nút số trang */}
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            return (
                                <PaginationItem key={pageNumber}>
                                    <PaginationLink 
                                        isActive={currentPage === pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className="cursor-pointer"
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}

                        <PaginationItem>
                            <PaginationNext 
                                onClick={() => handlePageChange(currentPage + 1)}
                                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default SavedQuestions;