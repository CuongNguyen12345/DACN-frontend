import { useState } from "react";
import api from "@/services/api";
import {
    User,
    Flame,
    Clock,
    BookOpen,
    Trophy,
    Edit
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Component cho Form
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Các component con của bạn
import RadarChart from "./components/RadarChart";
import Achievements from "./components/Achievements";
import Goals from "./components/Goals";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, loading, fetchProfile } = useAuth();
    const navigate = useNavigate();

    // All hooks must be declared before any early returns
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    const handleEditClick = () => {
        setFormData(user);
        setIsEditOpen(true);
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await api.put("/api/auth/profile", {
                grade: formData.grade,
                phoneNumber: formData.phoneNumber,
                schoolName: formData.schoolName,
            });
            await fetchProfile();
            setIsEditOpen(false);
        } catch (error) {
            console.error("Cập nhật thất bại:", error);
            alert(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật thông tin.");
        } finally {
            setIsSaving(false);
        }
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
                                    <AvatarImage src={user.avatar || "https://github.com/shadcn.png"} alt={user.userName} />
                                    <AvatarFallback>{user.userName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.userName}</h1>
                                <p className="text-gray-500 text-base">
                                    {user.grade || "Chưa có lớp"} - {user.schoolName || "Chưa có trường"}
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                                     <Badge variant="secondary" className="px-3 py-1 bg-orange-100 text-orange-700 hover:bg-orange-100 gap-1.5">
                                         <Flame className="h-3.5 w-3.5 fill-current" /> Streak: {user.streak || 0} ngày
                                     </Badge>
                                     <Badge variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1.5">
                                         <Clock className="h-3.5 w-3.5" /> Đã học: {user.totalTime || "0h"}
                                     </Badge>
                                 </div>
                            </div>

                            <div className="flex-shrink-0">
                                {/* Gắn sự kiện mở Popup vào Nút này */}
                                <Button
                                    size="lg"
                                    className="shadow-sm bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                                    onClick={handleEditClick}
                                >
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

            {/* ==========================================
                DIALOG POPUP CHỈNH SỬA HỒ SƠ
            ========================================== */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Chỉnh sửa hồ sơ</DialogTitle>
                        <DialogDescription>
                            Cập nhật thông tin cá nhân của bạn. Nhấn lưu để áp dụng thay đổi.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="userName">Họ và tên</Label>
                            <Input
                                id="userName"
                                value={formData.userName || ""}
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="grade">Lớp</Label>
                                <Input
                                    id="grade"
                                    value={formData.grade || ""}
                                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                                <Input
                                    id="phoneNumber"
                                    value={formData.phoneNumber || ""}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="schoolName">Trường học</Label>
                            <Input
                                id="schoolName"
                                value={formData.schoolName || ""}
                                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Hủy
                        </Button>
                        <Button
                                className="bg-[#3B82F6] hover:bg-[#2563EB]"
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                            >
                                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                            </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default Profile;