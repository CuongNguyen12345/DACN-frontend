import { useState, useMemo, useEffect, useRef } from "react";
import { 
    Search, Filter, MessageCircleQuestion, Clock, CheckCircle2, 
    Reply, BookOpen, Send, Trash2, Shield, User
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useTeacherScope } from "@/hooks/useTeacherScope";
import api from "@/services/api";
import { wsService } from "@/services/websocket";

const toGradeLabel = (grade) => {
    if (!grade) return "";
    const trimmedGrade = String(grade).trim();
    const gradeNumber = trimmedGrade
        .replace(/^lớp\s*/i, "")
        .replace(/^lop\s*/i, "")
        .replace(/^class\s*/i, "")
        .trim();
    return `Lớp ${gradeNumber}`;
};

const QnAManager = () => {
    const { role, user } = useAuth();
    const teacherScope = useTeacherScope();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [subjectFilter, setSubjectFilter] = useState("all");
    const [gradeFilter, setGradeFilter] = useState("all");
    const [lessonFilter, setLessonFilter] = useState("all");
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [requests, setRequests] = useState([]);
    const [requestMessages, setRequestMessages] = useState({}); // { requestId: [messages] }
    const messagesEndRef = useRef({});

    const teacherCanViewRequest = useMemo(() => {
        return (request) => {
            if (role !== "teacher") return true;

            const subjectName = request.subjectName || "";
            const matchesSubject =
                !teacherScope.allowedSubjectDb ||
                subjectName === teacherScope.allowedSubjectDb ||
                subjectName === teacherScope.allowedSubject;

            const gradeLabel = toGradeLabel(request.gradeLevel);
            const matchesGrade =
                teacherScope.allowedGrades.length === 0 ||
                teacherScope.allowedGrades.includes(gradeLabel);

            return matchesSubject && matchesGrade;
        };
    }, [role, teacherScope.allowedGrades, teacherScope.allowedSubject, teacherScope.allowedSubjectDb]);

    // Fetch requests based on role
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const type = role === "admin" ? "SYSTEM" : "ACADEMIC";
                const res = await api.get(`/api/support/requests?type=${type}`);
                setRequests(res.data);
                
                // Fetch messages for each request
                res.data.forEach(async (req) => {
                    const msgRes = await api.get(`/api/support/requests/${req.id}/messages`);
                    setRequestMessages(prev => ({ ...prev, [req.id]: msgRes.data }));
                });

            } catch (error) {
                console.error("Lỗi tải yêu cầu hỗ trợ:", error);
            }
        };

        if (role && (role !== "teacher" || user?.id)) {
            fetchRequests();
        }
    }, [role, user?.id]);

    // WebSocket subscription for new requests and messages
    useEffect(() => {
        if (!user || !role) return;

        wsService.connect(() => {
            const topic = role === "admin" ? "/topic/support/admin" : "/topic/support/teacher";
            
            // Listen for new messages globally for this role
            wsService.subscribe(topic, (newMessage) => {
                if (role === "teacher" && !teacherCanViewRequest(newMessage)) {
                    return;
                }

                // Check if request exists, if not, we should probably re-fetch requests
                setRequests(prev => {
                    const existing = prev.find(r => r.id === newMessage.requestId);
                    if (!existing) {
                        // Optimistic add of request (very basic)
                        return [{
                            id: newMessage.requestId,
                            userName: newMessage.senderName,
                            status: "OPEN",
                            createdAt: newMessage.createdAt,
                            subjectName: newMessage.subjectName || "",
                            gradeLevel: newMessage.gradeLevel || "",
                            lessonName: newMessage.lessonName || "",
                        }, ...prev];
                    } else {
                        // Determine new status based on senderRole
                        const senderRole = (newMessage.senderRole || "").toLowerCase();
                        const isStudent = senderRole !== "admin" && senderRole !== "teacher";
                        const newStatus = isStudent ? "OPEN" : "CLOSED";
                        
                        // Update status if it changed
                        if (existing.status !== newStatus) {
                            return prev.map(r => r.id === newMessage.requestId ? { ...r, status: newStatus } : r);
                        }
                        return prev;
                    }
                });

                // Add message to the specific request
                setRequestMessages(prev => {
                    const currentMsgs = prev[newMessage.requestId] || [];
                    if (currentMsgs.find(m => m.id === newMessage.id)) return prev;
                    return { ...prev, [newMessage.requestId]: [...currentMsgs, newMessage] };
                });
            });
        });

        return () => {
            if (role === "admin") wsService.unsubscribe("/topic/support/admin");
            if (role === "teacher") wsService.unsubscribe("/topic/support/teacher");
        };
    }, [user, role, teacherCanViewRequest]);


    const uniqueGrades = useMemo(() => {
        const scopedGrades = role === "teacher" ? teacherScope.allowedGrades : [];
        const requestGrades = requests.map(q => toGradeLabel(q.gradeLevel)).filter(Boolean);
        const grades = new Set([...scopedGrades, ...requestGrades]);
        return Array.from(grades);
    }, [requests, role, teacherScope.allowedGrades]);

    const uniqueSubjects = useMemo(() => {
        const scopedSubjects = role === "teacher"
            ? [teacherScope.allowedSubjectDb, teacherScope.allowedSubject].filter(Boolean)
            : [];
        const subjects = new Set([...scopedSubjects, ...requests.map(q => q.subjectName).filter(Boolean)]);
        return Array.from(subjects);
    }, [requests, role, teacherScope.allowedSubject, teacherScope.allowedSubjectDb]);

    const uniqueLessons = useMemo(() => {
        const lessons = new Set(requests.map(q => q.lessonName).filter(Boolean));
        return Array.from(lessons);
    }, [requests]);

    const filteredRequests = useMemo(() => {
        return requests.filter(q => {
            const matchesSearch = 
                (q.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (q.subjectName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (q.lessonName || "").toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || q.status === statusFilter;
            
            if (role === "teacher") {
                const matchesSubject = subjectFilter === "all" || q.subjectName === subjectFilter;
                const matchesGrade = gradeFilter === "all" || toGradeLabel(q.gradeLevel) === gradeFilter;
                const matchesLesson = lessonFilter === "all" || q.lessonName === lessonFilter;
                return matchesSearch && matchesStatus && matchesSubject && matchesGrade && matchesLesson;
            }
            
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter, subjectFilter, gradeFilter, lessonFilter, requests, role]);

    const handleSendReply = (requestId) => {
        if (!replyContent.trim() || !user) return;
        
        const type = role === "admin" ? "SYSTEM" : "ACADEMIC";
        
        const payload = {
            senderId: user.id,
            requestId: requestId,
            type: type,
            content: replyContent
        };

        wsService.sendMessage("/app/chat.send", payload);
        
        // Update request status locally
        setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "CLOSED" } : r));

        setReplyingTo(null);
        setReplyContent("");
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageCircleQuestion className="h-6 w-6 text-blue-600" /> Quản lý Hỏi đáp & Hỗ trợ
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {role === "admin" ? "Giải đáp các lỗi hệ thống, góp ý từ học viên." : "Giải đáp thắc mắc bài học của học viên."}
                    </p>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 flex flex-col sm:flex-row items-center gap-4 w-full">
                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                                <Search className="h-5 w-5 text-gray-400 mr-2" />
                                <input 
                                    type="text" 
                                    placeholder="Tìm kiếm theo tên học viên, khóa học, bài học..." 
                                    className="bg-transparent border-none outline-none text-sm w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto overflow-x-auto pb-1 sm:pb-0">
                            {role === "teacher" && (
                                <>
                                    <div className="w-full sm:w-[150px] shrink-0">
                                        <Select value={gradeFilter} onValueChange={setGradeFilter}>
                                            <SelectTrigger className="w-full bg-white border-gray-200 focus:ring-blue-500">
                                                <div className="flex items-center gap-2 truncate">
                                                    <Filter className="h-4 w-4 text-gray-500 shrink-0" />
                                                    <SelectValue placeholder="Lớp" className="truncate" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả lớp</SelectItem>
                                                {uniqueGrades.map(grade => (
                                                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-full sm:w-[150px] shrink-0">
                                        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                                            <SelectTrigger className="w-full bg-white border-gray-200 focus:ring-blue-500">
                                                <div className="flex items-center gap-2 truncate">
                                                    <Filter className="h-4 w-4 text-gray-500 shrink-0" />
                                                    <SelectValue placeholder="Môn học" className="truncate" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả môn</SelectItem>
                                                {uniqueSubjects.map(subject => (
                                                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-full sm:w-[200px] shrink-0">
                                        <Select value={lessonFilter} onValueChange={setLessonFilter}>
                                            <SelectTrigger className="w-full bg-white border-gray-200 focus:ring-blue-500">
                                                <div className="flex items-center gap-2 truncate">
                                                    <Filter className="h-4 w-4 text-gray-500 shrink-0" />
                                                    <SelectValue placeholder="Bài học" className="truncate" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tất cả bài học</SelectItem>
                                                {uniqueLessons.map(lesson => (
                                                    <SelectItem key={lesson} value={lesson}>{lesson}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}
                            <div className="w-full sm:w-[180px] shrink-0">
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-full bg-white border-gray-200 focus:ring-blue-500">
                                        <div className="flex items-center gap-2 truncate">
                                            <Filter className="h-4 w-4 text-gray-500 shrink-0" />
                                            <SelectValue placeholder="Tất cả trạng thái" className="truncate" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                        <SelectItem value="OPEN">
                                            <div className="flex items-center text-orange-600">
                                                <Clock className="h-4 w-4 mr-2" /> Mới
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="CLOSED">
                                            <div className="flex items-center text-emerald-600">
                                                <CheckCircle2 className="h-4 w-4 mr-2" /> Đã trả lời
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Request List */}
            <div className="space-y-4">
                {filteredRequests.length > 0 ? (
                    filteredRequests.map((q) => {
                        const msgs = requestMessages[q.id] || [];
                        const firstMsg = msgs.length > 0 ? msgs[0] : null;
                        const replies = msgs.slice(1);

                        return (
                            <Card key={q.id} className={cn("border-l-4 shadow-sm transition-all", 
                                q.status === "OPEN" ? "border-l-orange-400" : "border-l-emerald-500"
                            )}>
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">{q.userName || "Học viên"}</h4>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(q.createdAt).toLocaleString()}</span>
                                                    {role === "teacher" && q.subjectName && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1 text-blue-600 font-medium">
                                                                <BookOpen className="h-3 w-3" /> {q.subjectName} {q.lessonName ? `(${q.lessonName})` : ''}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {q.status === "OPEN" ? (
                                                <Badge className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200">Mới</Badge>
                                            ) : (
                                                <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Đã phản hồi</Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Nội dung câu hỏi (Tin nhắn đầu tiên) */}
                                    <div className="text-gray-800 text-sm mb-4 bg-gray-50 p-4 rounded-lg">
                                        {firstMsg ? firstMsg.content : <span className="text-gray-400 italic">Đang tải nội dung...</span>}
                                    </div>

                                    {/* Lịch sử trả lời */}
                                    {replies.length > 0 && (
                                        <div className="ml-8 border-l-2 border-gray-200 pl-4 py-2 space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                                            {replies.map(reply => {
                                                const senderRole = (reply.senderRole || "").toLowerCase();
                                                const isAdmin = senderRole === "admin" || senderRole === "teacher";
                                                return (
                                                    <div key={reply.id} className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className={cn("text-xs bg-white", isAdmin ? "text-emerald-700 border-emerald-200" : "text-blue-700 border-blue-200")}>
                                                                {isAdmin ? (role === "admin" ? "Admin" : "Giáo viên") : "Học viên"}
                                                            </Badge>
                                                            <span className="text-xs text-gray-400">{new Date(reply.createdAt).toLocaleTimeString()}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-700">{reply.content}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Khu vực nhập câu trả lời */}
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
                                                        <Send className="h-4 w-4" /> Gửi phản hồi
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
                                                <Reply className="h-4 w-4 mr-2" /> Phản hồi
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <MessageCircleQuestion className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">Không có yêu cầu hỗ trợ nào</h3>
                        <p className="text-gray-500 text-sm mt-1">Danh sách trống.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QnAManager;
