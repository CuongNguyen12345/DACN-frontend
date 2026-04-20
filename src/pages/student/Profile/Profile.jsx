import { useState } from "react";
import {
    User,
    Flame,
    Clock,
    BookOpen,
    Trophy,
    Edit,
    GraduationCap,
    School,
    Mail,
    Phone,
    MapPin,
    Calendar
} from "lucide-react";

import { cn } from "@/lib/utils";
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

const Profile = () => {
    // 1. Chuyển Mock Data thành State để UI tự cập nhật khi sửa xong
    const [user, setUser] = useState({
        name: "Nguyễn Văn Nam",
        grade: "Lớp 12A1",
        email: "nam.nguyen@student.com",
        phone: "0901234567",
        address: "Quận 1, TP. Hồ Chí Minh",
        school: "THPT Chuyên Lê Hồng Phong",
        joinedDate: "01/09/2025",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nam",
        streak: 15,
        totalTime: "124h",
        exercises: 450
    });

    // 2. State quản lý Popup và Dữ liệu đang nhập trong Form
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState(user);

    const handleSaveProfile = () => {
        setUser(formData); // Lưu dữ liệu mới vào state chính
        setIsEditOpen(false); // Đóng popup
        // Tương lai: Gọi API lưu dữ liệu ở đây
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
                                <h1 className="text-2xl md:text-4xl font-bold">{user.name}</h1>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
                                    <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 border-none text-white gap-1.5 backdrop-blur-sm">
                                        <Flame className="h-3.5 w-3.5 fill-orange-400 text-orange-400" /> Streak: {user.streak} ngày
                                    </Badge>
                                    <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 border-none text-white gap-1.5 backdrop-blur-sm">
                                        <Clock className="h-3.5 w-3.5" /> Tổng học: {user.totalTime}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex-shrink-0">
                                {/* Gắn sự kiện mở Popup vào Nút này */}
                                <Button
                                    size="lg"
                                    className="shadow-sm bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                                    onClick={() => {
                                        setFormData(user); // Reset form data
                                        setIsEditOpen(true);
                                    }}
                                >
                                    <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa hồ sơ
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Overview Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left Column: Personal Info & Radar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* CARD THÔNG TIN CÁ NHÂN - PHẦN THÊM MỚI */}<Card className="shadow-sm border-none">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-600" /> Thông tin cá nhân
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <GraduationCap className="h-4 w-4 text-gray-400" />
                                        <span className="font-medium text-gray-900">{user.grade}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <School className="h-4 w-4 text-gray-400" />
                                        <span>{user.school}</span>
                                    </div>
                                    <Separator className="my-2" />
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span>{user.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span>{user.address}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        <span>Tham gia: {user.joinedDate}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Năng lực học tập */}
                        <Card className="shadow-sm border-none">
                            <CardHeader>
                                <CardTitle className="text-lg">Năng lực học tập</CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-center pb-6">
                                <RadarChart data={radarData} size={250} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Progress & Achievements */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Thống kê nhanh */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Bài tập", val: user.exercises, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
                                { label: "Giờ học", val: "12.5h", icon: Clock, color: "text-green-600", bg: "bg-green-50" },
                                { label: "Trung bình", val: "8.2", icon: User, color: "text-yellow-600", bg: "bg-yellow-50" },
                                { label: "Xếp hạng", val: "#5", icon: Trophy, color: "text-pink-600", bg: "bg-pink-50" },
                            ].map((stat, i) => (
                                <Card key={i} className="border-none shadow-sm">
                                    <CardContent className="p-4 flex flex-col items-center text-center">
                                        <div className={cn("p-2 rounded-lg mb-2", stat.bg)}>
                                            <stat.icon className={cn("h-5 w-5", stat.color)} />
                                        </div>
                                        <p className="text-xl font-bold">{stat.val}</p>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="shadow-sm border-none h-full">
                                <Goals />
                            </Card>
                            <Achievements />
                        </div>
                    </div>
                </div>
            </div>

            {/* DIALOG CHỈNH SỬA (Mở rộng thêm các trường) */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa hồ sơ cá nhân</DialogTitle>
                        <DialogDescription>Thay đổi thông tin liên lạc và học tập.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Họ và tên</Label>
                                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="grade">Lớp</Label>
                                <Input id="grade" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Số điện thoại</Label>
                                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="school">Trường học</Label>
                            <Input id="school" value={formData.school} onChange={(e) => setFormData({ ...formData, school: e.target.value })} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Địa chỉ</Label>
                            <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Hủy</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveProfile}>Lưu thay đổi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Profile;