import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Users,
    BookOpen,
    Award,
    TrendingUp,
    Download,
    Calendar,
    FileText,
    Medal,
    AlertCircle,
    Loader2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";
import {
    buildReportStats,
    getReportMonthParam,
    normalizeScoreDistribution,
    normalizeTopStudents,
    unwrapApiData,
} from "./reportsView";

const iconByKey = {
    users: Users,
    book: BookOpen,
    file: FileText,
    award: Award,
};

const Reports = () => {
    const [selectedMonth] = useState(() => getReportMonthParam(new Date()));
    const [overview, setOverview] = useState(null);
    const [scoreDistribution, setScoreDistribution] = useState([]);
    const [topStudents, setTopStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const params = { month: selectedMonth };
            const [overviewRes, distributionRes, topStudentsRes] = await Promise.all([
                api.get("/api/admin/reports/overview", { params }),
                api.get("/api/admin/reports/score-distribution", { params }),
                api.get("/api/admin/reports/top-students", {
                    params: { ...params, limit: 5 },
                }),
            ]);

            setOverview(unwrapApiData(overviewRes.data) || {});
            setScoreDistribution(normalizeScoreDistribution(unwrapApiData(distributionRes.data) || []));
            setTopStudents(normalizeTopStudents(unwrapApiData(topStudentsRes.data) || []));
        } catch (err) {
            console.error("Lỗi tải dữ liệu thống kê:", err);
            setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    }, [selectedMonth]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const stats = useMemo(() => buildReportStats(overview || {}), [overview]);

    const handleExportReport = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4 space-y-6">
                <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang tải dữ liệu báo cáo...</span>
                </div>
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[0, 1, 2, 3].map((item) => (
                            <div key={item} className="h-32 bg-gray-100 rounded-xl" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 h-64 bg-gray-100 rounded-xl" />
                        <div className="h-64 bg-gray-100 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-4">
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <p className="text-red-700 font-medium">{error}</p>
                        <Button
                            onClick={fetchDashboardData}
                            variant="outline"
                            className="mt-4 bg-white hover:bg-red-50"
                        >
                            Thử lại
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h2>
                    <p className="text-gray-500 text-sm mt-1">Tổng quan về tình hình học tập và thi cử của học viên.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="bg-white border-gray-200 text-gray-700">
                        <Calendar className="h-4 w-4 mr-2" /> {selectedMonth}
                    </Button>
                    <Button onClick={handleExportReport} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Download className="h-4 w-4 mr-2" /> Xuất báo cáo
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = iconByKey[stat.iconKey];
                    return (
                        <Card key={stat.title} className="border-none shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`h-12 w-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                                        {Icon && <Icon className={`h-6 w-6 ${stat.color}`} />}
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-sm">
                                    <TrendingUp className={`h-4 w-4 mr-1 ${stat.trendUp ? "text-emerald-500" : "text-red-500 rotate-180"}`} />
                                    <span className={stat.trendUp ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                                        {stat.trend}
                                    </span>
                                    <span className="text-gray-500 ml-2">so với tháng trước</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-none shadow-sm lg:col-span-2">
                    <CardHeader className="pb-2 border-b border-gray-50 mb-4">
                        <CardTitle className="text-lg font-semibold text-gray-800">Phổ điểm tổng quan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {scoreDistribution.map((item) => (
                            <div key={item.range} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-700">{item.range}</span>
                                    <span className="text-gray-500">{item.percent}% ({item.count.toLocaleString("en-US")} lượt)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={`h-2.5 rounded-full ${item.color} transition-all duration-1000 ease-in-out`}
                                        style={{ width: `${item.percent}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

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
                                <div key={student.id || index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold
                                            ${index === 0 ? "bg-amber-100 text-amber-600" :
                                                index === 1 ? "bg-slate-100 text-slate-600" :
                                                    index === 2 ? "bg-orange-100 text-orange-600" :
                                                        "bg-blue-50 text-blue-600"}`}
                                        >
                                            {index + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                                            <p className="text-xs text-gray-500">{student.grade || "Chưa cập nhật lớp"}</p>
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
                            {topStudents.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-6">
                                    Chưa có dữ liệu học viên trong tháng này.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Reports;
