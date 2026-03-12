import { useState } from "react";
// Thêm Bookmark icon và các component Tabs
import { 
  History, Search, Filter, ChevronRight, 
  CheckCircle2, Clock, BarChart3, BookOpen, 
  AlertCircle, Bookmark 
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import component từ folder Bookmarks của bạn
import SavedQuestions from "../Bookmarks/SavedQuestions";

const StudyHistory = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // ... Mock Data giữ nguyên như cũ của bạn ...
  const [historyRecords] = useState([
    { id: "REC-001", examTitle: "Kiểm tra Giữa kỳ I - Toán 12", date: "2026-03-10 08:30", score: 8.5, totalQuestions: 50, correctAnswers: 42, duration: "45:00", status: "Hoàn thành", category: "Toán học" },
    { id: "REC-002", examTitle: "Trắc nghiệm Vật Lý: Chương 1", date: "2026-03-08 14:15", score: 6.0, totalQuestions: 20, correctAnswers: 12, duration: "15:20", status: "Hoàn thành", category: "Vật Lý" },
    { id: "REC-003", examTitle: "Luyện tập Hóa hữu cơ", date: "2026-03-05 20:00", score: 0, totalQuestions: 30, correctAnswers: 0, duration: "05:10", status: "Đang làm", category: "Hóa Học" },
  ]);

  const getScoreColor = (score) => {
    if (score >= 8) return "text-emerald-600";
    if (score >= 5) return "text-amber-600";
    return "text-rose-600";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 p-6">
      {/* 1. Header & Stats Overview (Giữ nguyên cấu trúc của bạn) */}
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <History className="h-8 w-8 text-indigo-600" />
            Lịch sử học tập
          </h2>
          <p className="text-slate-500 mt-1">Theo dõi tiến độ và ôn tập các câu hỏi quan trọng.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-none shadow-sm bg-indigo-50/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-indigo-600 font-medium">Điểm trung bình</p>
                <h3 className="text-2xl font-bold text-slate-900">7.25</h3>
              </div>
            </CardContent>
          </Card>
          {/* ... Các Card stats khác ... */}
        </div>
      </div>

      {/* 2. Phần Tabs chính để chuyển đổi chức năng */}
      <Tabs defaultValue="history" className="w-full space-y-6">
        <TabsList className="inline-flex h-12 items-center justify-start rounded-xl bg-slate-100 p-1 text-slate-500 w-full md:w-auto">
          <TabsTrigger 
            value="history" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-bold ring-offset-white transition-all focus-visible:outline-none data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
          >
            <History className="w-4 h-4 mr-2" />
            Lịch sử thi
          </TabsTrigger>
          <TabsTrigger 
            value="bookmarks" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-bold ring-offset-white transition-all focus-visible:outline-none data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm"
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Câu hỏi đã lưu
            <Badge className="ml-2 bg-amber-100 text-amber-600 border-none">12</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Tab Nội dung Lịch sử bài thi */}
        <TabsContent value="history" className="space-y-4 outline-none">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                placeholder="Tìm kiếm tên bài thi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2 rounded-full shadow-sm">
              <Filter className="h-4 w-4" /> Bộ lọc
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {historyRecords.map((record) => (
              <Card key={record.id} className="group hover:border-indigo-200 transition-all border-slate-200 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                   {/* ... Giữ nguyên phần render list item của bạn ... */}
                   <div className="flex flex-col md:flex-row items-stretch md:items-center p-5">
                      <div className="flex-1">
                         <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{record.category}</Badge>
                            <span className="text-xs text-slate-400">{record.date}</span>
                         </div>
                         <h4 className="text-lg font-bold text-slate-800">{record.examTitle}</h4>
                      </div>
                      <div className="flex items-center gap-6 mt-4 md:mt-0">
                         <div className="text-center">
                            <span className={cn("text-2xl font-black", getScoreColor(record.score))}>{record.score}</span>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Điểm</p>
                         </div>
                         <Button onClick={() => navigate(`/study/review/${record.id}`)} className="rounded-full">
                            {record.status === "Hoàn thành" ? "Xem lại" : "Tiếp tục"}
                         </Button>
                      </div>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab Nội dung Câu hỏi đã lưu */}
        <TabsContent value="bookmarks" className="outline-none">
          {/* Nhúng component SavedQuestions của bạn vào đây */}
          <SavedQuestions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyHistory;