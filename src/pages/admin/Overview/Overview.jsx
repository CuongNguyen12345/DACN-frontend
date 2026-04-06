import { useNavigate } from "react-router-dom";
import {
    FileText,
    Database,
    Users,
    Settings,
    TrendingUp,
    Clock,
    CheckCircle2
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

const Overview = () => {
    // Khởi tạo hook điều hướng
    const navigate = useNavigate();
    const { role } = useAuth();
    const basePath = role === "admin" ? "/admin" : "/teacher";

    // Mock Data cho Bảng thống kê
    const stats = [
        { title: "Tổng số học viên", value: "2,543", trend: "+12.5%", isUp: true },
        { title: "Lượt thi hôm nay", value: "842", trend: "+5.2%", isUp: true },
        { title: "Đề thi đang mở", value: "45", trend: "Giữ nguyên", isUp: null },
        { title: "Điểm trung bình", value: "7.2", trend: "-0.4%", isUp: false },
    ];

    // Mock Data cho Hoạt động gần đây
    const recentActivities = [
        { id: 1, user: "Nguyễn Văn A", action: "Nộp bài", exam: "Toán THPT QG 2025", score: "8.4", time: "5 phút trước", status: "Hoàn thành" },
        { id: 2, user: "Trần Thị B", action: "Đang làm bài", exam: "Lý THPT QG 2025", score: "-", time: "12 phút trước", status: "Đang thi" },
        { id: 3, user: "Lê Hoàng C", action: "Nộp bài", exam: "Hóa THPT QG 2025", score: "9.2", time: "1 giờ trước", status: "Hoàn thành" },
        { id: 4, user: "Phạm Văn D", action: "Nộp bài", exam: "Toán THPT QG 2025", score: "6.5", time: "2 giờ trước", status: "Hoàn thành" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Chào mừng {role === "admin" ? "Admin" : "Giáo viên"} quay trở lại!
                    </p>
                </div>
            </div>

            {/* Thẻ số liệu thống kê */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-sm">
                        <CardContent className="p-6">
                            <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                            <div className="flex items-end justify-between">
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                {stat.isUp !== null && (
                                    <div className={cn(
                                        "flex items-center text-sm font-medium",
                                        stat.isUp ? "text-emerald-600" : "text-red-500"
                                    )}>
                                        {stat.isUp ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingUp className="h-4 w-4 mr-1 rotate-180" />}
                                        {stat.trend}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bảng hoạt động gần đây */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                        <CardTitle className="text-lg font-bold">Hoạt động thi gần đây</CardTitle>
                        {/* Link tới trang Báo cáo chi tiết */}
                        <Button 
                            onClick={() => navigate('/admin/reports')} 
                            variant="link" 
                            className="text-blue-600 text-sm"
                        >
                            Xem tất cả
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Học viên</th>
                                        <th className="px-6 py-4 font-medium">Đề thi</th>
                                        <th className="px-6 py-4 font-medium text-center">Trạng thái</th>
                                        <th className="px-6 py-4 font-medium text-right">Điểm / Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {recentActivities.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{row.user}</td>
                                            <td className="px-6 py-4 text-gray-600">{row.exam}</td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge variant={row.status === "Hoàn thành" ? "default" : "secondary"} className={
                                                    row.status === "Hoàn thành" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                                }>
                                                    {row.status === "Hoàn thành" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                                                    {row.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {row.status === "Hoàn thành" ? (
                                                    <span className="font-bold text-blue-600">{row.score} điểm</span>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">{row.time}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Khối chức năng nhanh */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2 border-b">
                        <CardTitle className="text-lg font-bold">Thao tác nhanh</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                        {/* Link tới trang Tạo/Nhập đề thi */}
                        <Button 
                            onClick={() => navigate(`${basePath}/exams/create`)} 
                            variant="outline" 
                            className="w-full justify-start h-12"
                        >
                            <FileText className="mr-3 h-5 w-5 text-blue-500" /> Nhập đề thi từ Word/PDF
                        </Button>
                        
                        {/* Link tới trang Ngân hàng câu hỏi hoặc Danh sách đề */}
                        <Button 
                            onClick={() => navigate(`${basePath}/exams`)} 
                            variant="outline" 
                            className="w-full justify-start h-12"
                        >
                            <Database className="mr-3 h-5 w-5 text-emerald-500" /> Thêm câu hỏi vào ngân hàng
                        </Button>

                        {role === "admin" && (
                            <>
                            {/* Link tới trang Quản lý Học viên */}
                                <Button 
                                    onClick={() => navigate('/admin/users')} 
                                    variant="outline" 
                                    className="w-full justify-start h-12"
                                >
                                    <Users className="mr-3 h-5 w-5 text-purple-500" /> Quản lý tài khoản học sinh
                                </Button>
                        
                                {/* Link tới trang Cài đặt (Tab thông báo) */}
                                <Button 
                                    onClick={() => navigate('/admin/settings')} 
                                    variant="outline" 
                                    className="w-full justify-start h-12 border-dashed border-gray-300"
                                >
                                    <Settings className="mr-3 h-5 w-5 text-gray-400" /> Cài đặt thông báo
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Overview;