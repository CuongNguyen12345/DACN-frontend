import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft, Phone, Calendar, Shield, MapPin,
    Activity, BookOpen, Award, Edit, Key, GraduationCap,
    CheckCircle2, Clock, Loader2, Briefcase, FileText, Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const AccountDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { basePath } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAccountDetail = async () => {
            setIsLoading(true);
            try {
                const res = await api.get(`/api/admin/accounts/${id}`);
                const data = res.data;

                const isTeacher = data.role?.toUpperCase() === "TEACHER";

                setUserData({
                    id: data.id,
                    name: data.userName || "Chưa cập nhật",
                    email: data.email || "",
                    phone: data.phoneNumber || "Chưa cập nhật",
                    address: "Chưa cập nhật",
                    role: isTeacher ? "Giáo viên" : "Học viên",
                    unit: data.unit || "Chưa cập nhật",
                    status: data.status || "Hoạt động",
                    joinedAt: data.createdDate
                        ? new Date(data.createdDate).toLocaleDateString("vi-VN")
                        : "N/A",
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.id}`,
                    isTeacher,
                    stats: isTeacher
                        ? {
                            lectures: data.completedLessons || 0,
                            examsCreated: data.totalExams || 0,
                            totalStudents: 0,
                        }
                        : {
                            totalExams: data.totalExams || 0,
                            avgScore: data.avgScore || 0,
                            completedCourses: data.completedLessons || 0,
                        },
                    recentActivities: [],
                    relatedRecords: data.examRecords?.map((r) => ({
                        id: r.examId,
                        title: r.title,
                        subject: r.subject,
                        score: r.score,
                        date: r.submittedAt
                            ? new Date(r.submittedAt).toLocaleDateString("vi-VN")
                            : "",
                        timeSpent: "",
                    })) || [],
                });
            } catch (error) {
                console.error("Lỗi khi tải chi tiết tài khoản:", error);
                setUserData(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchAccountDetail();
    }, [id]);

    const getRoleBadge = (role) => {
        return role === "Giáo viên"
            ? "bg-purple-100 text-purple-700 border-none shadow-none"
            : "bg-blue-50 text-blue-700 border-none shadow-none";
    };

    if (isLoading || !userData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p>Đang tải hồ sơ tài khoản...</p>
            </div>
        );
    }

    const { isTeacher } = userData;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-10">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(`${basePath}/accounts`)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors outline-none"
                        title="Quay lại"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-900">Hồ sơ Tài khoản</h2>
                            <Badge variant="outline" className="font-mono text-xs bg-white text-gray-600">{userData.id}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">Xem chi tiết thông tin và hoạt động của tài khoản.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột trái: Thông tin cá nhân */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <div className={cn("h-24 bg-gradient-to-r",
                            isTeacher ? "from-purple-400 to-purple-600" : "from-blue-400 to-blue-600"
                        )}></div>
                        <CardContent className="px-6 pb-6 pt-0 relative flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-full border-4 border-white bg-white -mt-12 overflow-hidden shadow-sm mb-4">
                                <img src={userData.avatar} alt={userData.name} className="h-full w-full object-cover bg-gray-50" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{userData.name}</h3>
                            <p className="text-sm text-gray-500 mb-3">{userData.email}</p>

                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                <Badge className={cn("font-medium flex items-center gap-1", getRoleBadge(userData.role))}>
                                    {isTeacher ? <Briefcase className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
                                    {userData.role}
                                </Badge>
                                <Badge variant="outline" className="text-gray-600 border-gray-200">
                                    {userData.unit}
                                </Badge>
                                <Badge className={cn("border-none shadow-none font-medium",
                                    userData.status === "Hoạt động" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                                )}>
                                    {userData.status}
                                </Badge>
                            </div>

                            <div className="w-full space-y-3 text-sm text-left">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <span>{userData.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    <span>{userData.address}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>Tham gia: {userData.joinedAt}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Cột phải: Thống kê & Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {isTeacher ? (
                            <>
                                <Card className="border-none shadow-sm bg-purple-50/50">
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                                            <BookOpen className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Bài giảng</p>
                                            <p className="text-2xl font-bold text-gray-900">{userData.stats.lectures}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-none shadow-sm bg-blue-50/50">
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Đề thi đã tạo</p>
                                            <p className="text-2xl font-bold text-gray-900">{userData.stats.examsCreated}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-none shadow-sm bg-emerald-50/50">
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Học viên phụ trách</p>
                                            <p className="text-2xl font-bold text-gray-900">{userData.stats.totalStudents}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <>
                                <Card className="border-none shadow-sm bg-blue-50/50">
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                            <BookOpen className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Lượt thi</p>
                                            <p className="text-2xl font-bold text-gray-900">{userData.stats.totalExams}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-none shadow-sm bg-emerald-50/50">
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                                            <Award className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Điểm trung bình</p>
                                            <p className="text-2xl font-bold text-gray-900">{userData.stats.avgScore}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-none shadow-sm bg-purple-50/50">
                                    <CardContent className="p-6 flex items-center gap-4">
                                        <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Bài học hoàn thành</p>
                                            <p className="text-2xl font-bold text-gray-900">{userData.stats.completedCourses}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        )}
                    </div>

                    {/* Tabs Control */}
                    <Card className="border-none shadow-sm">
                        <div className="border-b border-gray-100">
                            <div className="flex gap-6 px-6 overflow-x-auto">
                                <button
                                    onClick={() => setActiveTab("overview")}
                                    className={cn("py-4 text-sm font-medium border-b-2 transition-colors outline-none whitespace-nowrap",
                                        activeTab === "overview" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    Lịch sử hoạt động
                                </button>
                                <button
                                    onClick={() => setActiveTab("related")}
                                    className={cn("py-4 text-sm font-medium border-b-2 transition-colors outline-none whitespace-nowrap",
                                        activeTab === "related" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    {isTeacher ? "Đề thi & Bài giảng" : "Kết quả bài thi"}
                                </button>
                            </div>
                        </div>

                        <CardContent className="p-0">
                            {/* Tab: Lịch sử hoạt động */}
                            {activeTab === "overview" && (
                                <div>
                                    {userData.recentActivities.length === 0 ? (
                                        <div className="p-12 text-center text-gray-400">
                                            <Activity className="h-10 w-10 mx-auto mb-3 opacity-50" />
                                            <p className="font-medium">Chưa có hoạt động nào</p>
                                            <p className="text-sm mt-1">Lịch sử hoạt động sẽ được hiển thị tại đây.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-100">
                                            {userData.recentActivities.map((activity) => (
                                                <div key={activity.id} className="p-6 flex items-start sm:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                                                    <div className="p-2 bg-gray-100 rounded-full text-gray-500 mt-1 sm:mt-0">
                                                        <Activity className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {activity.action} <span className="font-normal text-gray-500">tại</span> {activity.target}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                            <Clock className="h-3 w-3" /> {activity.date}
                                                        </p>
                                                    </div>
                                                    <Badge variant="outline" className="text-xs bg-white text-gray-600">
                                                        {activity.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Tab: Kết quả bài thi */}
                            {activeTab === "related" && (
                                <div>
                                    {userData.relatedRecords.length === 0 ? (
                                        <div className="p-12 text-center text-gray-400">
                                            <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
                                            <p className="font-medium">Chưa có dữ liệu</p>
                                            <p className="text-sm mt-1">
                                                {isTeacher ? "Đề thi và bài giảng sẽ hiển thị tại đây." : "Kết quả bài thi sẽ hiển thị tại đây."}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-gray-100">
                                            {userData.relatedRecords.map((record) => (
                                                <div key={record.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-sm font-bold text-gray-900">{record.title}</h4>
                                                            <Badge variant="secondary" className="text-[10px] bg-slate-100">{record.subject}</Badge>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {record.date}</span>
                                                            {record.timeSpent && (
                                                                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {record.timeSpent}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {!isTeacher && (
                                                        <div className="text-right">
                                                            <div className="text-xs text-gray-500 mb-1">Điểm số</div>
                                                            <div className={cn("text-lg font-bold",
                                                                record.score >= 8 ? "text-emerald-600" :
                                                                    record.score >= 5 ? "text-blue-600" : "text-red-600"
                                                            )}>
                                                                {record.score} / 10
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AccountDetail;