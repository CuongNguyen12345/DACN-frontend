import {
    User,
    Flame,
    Clock,
    BookOpen,
    Trophy,
    Edit
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import RadarChart from "./components/RadarChart";
import Achievements from "./components/Achievements";
import Goals from "./components/Goals";

const Profile = () => {
    // Mock Data
    const user = {
        name: "Nguyễn Văn Nam",
        grade: "Lớp 12A1",
        avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
        streak: 15,
        totalTime: "124h",
        exercises: 450
    };

    const radarData = [
        { subject: "Toán", value: 85 },
        { subject: "Lý", value: 70 },
        { subject: "Hóa", value: 60 },
        { subject: "Sinh", value: 50 },
        { subject: "Anh", value: 75 },
        { subject: "Văn", value: 65 }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 py-8 px-4 md:px-8">
            <div className="max-w-[1200px] mx-auto space-y-6">

                {/* Header Section */}
                <Card className="overflow-hidden border-none shadow-md bg-gradient-to-r from-gray-50 to-white">
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                            <div className="relative">
                                <Avatar className="h-24 w-24 md:h-28 md:w-28 border-4 border-white shadow-lg">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback>N</AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.name}</h1>
                                <p className="text-gray-500 text-base">{user.grade}</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                                    <Badge variant="secondary" className="px-3 py-1 bg-orange-100 text-orange-700 hover:bg-orange-100 gap-1.5">
                                        <Flame className="h-3.5 w-3.5 fill-current" /> Streak: {user.streak} ngày
                                    </Badge>
                                    <Badge variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1.5">
                                        <Clock className="h-3.5 w-3.5" /> Đã học: {user.totalTime}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex-shrink-0">
                                <Button size="lg" className="shadow-sm">
                                    <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa hồ sơ
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Overview Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left Column: Radar & Goals & Achievements */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>Năng lực học tập</CardTitle>
                                </CardHeader>
                                <CardContent className="flex justify-center pb-2">
                                    <RadarChart data={radarData} size={280} />
                                </CardContent>
                            </Card>
                            <Card className="shadow-sm">
                                <Goals />
                            </Card>
                        </div>

                        <Achievements />
                    </div>

                    {/* Right Column: Statistics Grid */}
                    <div className="lg:col-span-1">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle>Thống kê tổng quan</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                                        <div className="flex items-center gap-2 mb-2 text-blue-600">
                                            <BookOpen className="h-4 w-4" />
                                            <span className="text-xs font-semibold uppercase">Bài tập</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">{user.exercises}</p>
                                        <p className="text-xs text-muted-foreground">đã hoàn thành</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-green-50/50 border border-green-100">
                                        <div className="flex items-center gap-2 mb-2 text-green-600">
                                            <Clock className="h-4 w-4" />
                                            <span className="text-xs font-semibold uppercase">Giờ học</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">12.5h</p>
                                        <p className="text-xs text-muted-foreground">tuần này</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-yellow-50/50 border border-yellow-100">
                                        <div className="flex items-center gap-2 mb-2 text-yellow-600">
                                            <User className="h-4 w-4" />
                                            <span className="text-xs font-semibold uppercase">Trung bình</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">8.2</p>
                                        <p className="text-xs text-muted-foreground">điểm số</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100">
                                        <div className="flex items-center gap-2 mb-2 text-pink-600">
                                            <Trophy className="h-4 w-4" />
                                            <span className="text-xs font-semibold uppercase">Xếp hạng</span>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900">#5</p>
                                        <p className="text-xs text-muted-foreground">trong lớp</p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="text-center p-2">
                                    <p className="text-sm text-muted-foreground italic">"Cố gắng duy trì phong độ nhé!"</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
