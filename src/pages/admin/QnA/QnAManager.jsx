import { useState, useMemo } from "react";
import { 
    Search, 
    Filter, 
    MessageCircleQuestion, 
    Clock, 
    CheckCircle2, 
    Reply, 
    BookOpen, 
    Send,
    MoreVertical,
    Trash2
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const QnAManager = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const { role } = useAuth();

    // Mock Data Q&A
    const [questions, setQuestions] = useState([
        { 
            id: "QA001", 
            studentName: "Nguyễn Văn An", 
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HV001",
            course: "Toán 12 - Giải tích", 
            lesson: "Bài 1: Sự đồng biến, nghịch biến", 
            content: "Thầy ơi, tại sao ở phút thứ 5:30 đạo hàm lại đổi dấu vậy ạ? Em tính thử thì thấy nó luôn dương mà ta?", 
            date: "08:30 - 12/03/2026", 
            status: "pending", 
            answer: null 
        },
        { 
            id: "QA002", 
            studentName: "Trần Thị Bình", 
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HV002",
            course: "Vật Lý 12", 
            lesson: "Bài 3: Con lắc lò xo", 
            content: "Cho em hỏi công thức tính chu kỳ T có áp dụng được khi con lắc treo thẳng đứng không ạ?", 
            date: "20:15 - 11/03/2026", 
            status: "answered", 
            answer: "Chào em, công thức tính chu kỳ T = 2π√(m/k) áp dụng được cho cả con lắc lò xo nằm ngang và treo thẳng đứng nhé. Ở trường hợp thẳng đứng, độ dãn của lò xo tại VTCB sẽ bù trừ với trọng lực." 
        },
        { 
            id: "QA003", 
            studentName: "Phạm Minh Đức", 
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HV004",
            course: "Hóa Học 12", 
            lesson: "Bài 2: Lipit", 
            content: "Cách phân biệt chất béo lỏng và chất béo rắn nhanh nhất khi làm bài tập trắc nghiệm là gì ạ?", 
            date: "14:00 - 10/03/2026", 
            status: "pending", 
            answer: null 
        },
    ]);

    // Lọc danh sách câu hỏi
    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const matchesSearch = 
                q.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                q.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.course.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || q.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter, questions]);

    // Xử lý gửi câu trả lời
    const handleSendReply = (id) => {
        if (!replyContent.trim()) return;
        
        const updatedQuestions = questions.map(q => {
            if (q.id === id) {
                return { ...q, status: "answered", answer: replyContent };
            }
            return q;
        });
        
        setQuestions(updatedQuestions);
        setReplyingTo(null);
        setReplyContent("");
    };

    // Xử lý xóa câu hỏi (nếu spam)
    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa câu hỏi này?")) {
            setQuestions(questions.filter(q => q.id !== id));
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageCircleQuestion className="h-6 w-6 text-blue-600" /> Quản lý Hỏi đáp
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Giải đáp thắc mắc của học viên trong các khóa học.</p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                            <Search className="h-5 w-5 text-gray-400 mr-2" />
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm theo nội dung, tên học viên, khóa học..." 
                                className="bg-transparent border-none outline-none text-sm w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-[220px]">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full bg-white border-gray-200 focus:ring-blue-500">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-gray-500" />
                                        <SelectValue placeholder="Tất cả trạng thái" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả thắc mắc</SelectItem>
                                    <SelectItem value="pending">
                                        <div className="flex items-center text-orange-600">
                                            <Clock className="h-4 w-4 mr-2" /> Chưa trả lời
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="answered">
                                        <div className="flex items-center text-emerald-600">
                                            <CheckCircle2 className="h-4 w-4 mr-2" /> Đã trả lời
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Question List */}
            <div className="space-y-4">
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((q) => (
                        <Card key={q.id} className={cn("border-l-4 shadow-sm transition-all", 
                            q.status === "pending" ? "border-l-orange-400" : "border-l-emerald-500"
                        )}>
                            <CardContent className="p-5">
                                {/* Thông tin người hỏi & bài học */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-3 items-center">
                                        <img src={q.avatar} alt={q.studentName} className="w-10 h-10 rounded-full bg-gray-100" />
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm">{q.studentName}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {q.date}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1 text-blue-600 font-medium">
                                                    <BookOpen className="h-3 w-3" /> {q.course} ({q.lesson})
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {q.status === "pending" ? (
                                            <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200">Chờ giải đáp</Badge>
                                        ) : (
                                            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Đã giải đáp</Badge>
                                        )}
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 h-8 w-8" onClick={() => handleDelete(q.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Nội dung câu hỏi */}
                                <div className="text-gray-800 text-sm mb-4 bg-gray-50 p-4 rounded-lg">
                                    {q.content}
                                </div>

                                {/* Khu vực trả lời */}
                                {q.status === "answered" ? (
                                    <div className="ml-8 border-l-2 border-emerald-200 pl-4 py-2">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="outline" className="text-xs bg-white text-emerald-700 border-emerald-200">{role === "admin" ? "Admin" : "Giáo viên" } trả lời</Badge>
                                        </div>
                                        <p className="text-sm text-gray-700">{q.answer}</p>
                                    </div>
                                ) : (
                                    <div className="ml-8 mt-2">
                                        {replyingTo === q.id ? (
                                            <div className="space-y-3">
                                                <textarea 
                                                    className="w-full min-h-[100px] p-3 text-sm border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-blue-50/30"
                                                    placeholder="Nhập câu trả lời của bạn..."
                                                    value={replyContent}
                                                    onChange={(e) => setReplyContent(e.target.value)}
                                                    autoFocus
                                                ></textarea>
                                                <div className="flex gap-2 justify-end">
                                                    <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Hủy</Button>
                                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 gap-2" onClick={() => handleSendReply(q.id)}>
                                                        <Send className="h-4 w-4" /> Gửi câu trả lời
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                onClick={() => {
                                                    setReplyingTo(q.id);
                                                    setReplyContent("");
                                                }}
                                            >
                                                <Reply className="h-4 w-4 mr-2" /> Trả lời học viên
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <MessageCircleQuestion className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">Không tìm thấy câu hỏi nào</h3>
                        <p className="text-gray-500 text-sm mt-1">Tất cả thắc mắc của học viên đã được giải đáp.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QnAManager;