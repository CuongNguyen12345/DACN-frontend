import { useState } from "react";
import { 
    Users, 
    BookOpen, 
    Award, 
    TrendingUp, 
    Download, 
    Calendar,
    FileText,
    Medal
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Reports = () => {
    // Mock Data Thống kê tổng quan
    const stats = [
        { title: "Tổng học viên", value: "1,250", trend: "+12%", trendUp: true, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
        { title: "Đề thi đang mở", value: "45", trend: "+5%", trendUp: true, icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-100" },
        { title: "Lượt thi tháng này", value: "3,240", trend: "+18%", trendUp: true, icon: FileText, color: "text-amber-600", bg: "bg-amber-100" },
        { title: "Điểm trung bình", value: "7.8", trend: "-2%", trendUp: false, icon: Award, color: "text-purple-600", bg: "bg-purple-100" },
    ];

    // Mock Data Phổ điểm
    const scoreDistribution = [
        { range: "Giỏi (8.0 - 10)", percent: 45, count: 1458, color: "bg-emerald-500" },
        { range: "Khá (6.5 - 7.9)", percent: 30, count: 972, color: "bg-blue-500" },
        { range: "Trung bình (5.0 - 6.4)", percent: 15, count: 486, color: "bg-amber-500" },
        { range: "Yếu (< 5.0)", percent: 10, count: 324, color: "bg-red-500" },
    ];

    // Mock Data Top Học viên xuất sắc
    const topStudents = [
        { id: "HV006", name: "Vũ Thị Yến", class: "Lớp 12A3", score: 9.8, exams: 25 },
        { id: "HV001", name: "Nguyễn Văn An", class: "Lớp 12A1", score: 9.5, exams: 15 },
        { id: "HV004", name: "Phạm Minh Đức", class: "Lớp 10C1", score: 9.2, exams: 12 },
        { id: "HV002", name: "Trần Thị Bình", class: "Lớp 12A2", score: 8.9, exams: 8 },
        { id: "HV010", name: "Lê Hoàng Hải", class: "Lớp 11B2", score: 8.7, exams: 10 },
    ];

    const handleExportReport = () => {
        alert("Đang xuất báo cáo ra file Excel...");
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h2>
                    <p className="text-gray-500 text-sm mt-1">Tổng quan về tình hình học tập và thi cử của học viên.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="bg-white border-gray-200 text-gray-700">
                        <Calendar className="h-4 w-4 mr-2" /> Tháng này
                    </Button>
                    <Button onClick={handleExportReport} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Download className="h-4 w-4 mr-2" /> Xuất báo cáo
                    </Button>
                </div>
            </div>

            {/* Bốn thẻ thống kê tổng quan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`h-12 w-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-sm">
                                <TrendingUp className={`h-4 w-4 mr-1 ${stat.trendUp ? 'text-emerald-500' : 'text-red-500 transform rotate-180'}`} />
                                <span className={stat.trendUp ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
                                    {stat.trend}
                                </span>
                                <span className="text-gray-500 ml-2">so với tháng trước</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Biểu đồ phổ điểm (Dùng Tailwind Progress Bar) */}
                <Card className="border-none shadow-sm lg:col-span-2">
                    <CardHeader className="pb-2 border-b border-gray-50 mb-4">
                        <CardTitle className="text-lg font-semibold text-gray-800">Phổ điểm tổng quan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {scoreDistribution.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-700">{item.range}</span>
                                    <span className="text-gray-500">{item.percent}% ({item.count} lượt)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div 
                                        className={`h-2.5 rounded-full ${item.color} transition-all duration-1000 ease-in-out`} 
                                        style={{ width: `${item.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Top Học viên */}
                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2 border-b border-gray-50 mb-4">
                        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                            <Medal className="h-5 w-5 mr-2 text-amber-500" />
                            Học viên xuất sắc
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            {topStudents.map((student, index) => (
                                <div key={student.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold
                                            ${index === 0 ? 'bg-amber-100 text-amber-600' : 
                                              index === 1 ? 'bg-slate-100 text-slate-600' : 
                                              index === 2 ? 'bg-orange-100 text-orange-600' : 
                                              'bg-blue-50 text-blue-600'}`}
                                        >
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                            <p className="text-xs text-gray-500">{student.class}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                                            {student.score} đ
                                        </Badge>
                                        <p className="text-[10px] text-gray-400 mt-1">{student.exams} bài thi</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Reports;