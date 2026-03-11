import { useState } from "react";
import { 
    User, 
    Mail, 
    Phone, 
    Shield, 
    Camera, 
    Save, 
    Key, 
    BookOpen
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
    // State lưu trữ thông tin cá nhân
    const [profile, setProfile] = useState({
        fullName: "Quản trị viên hệ thống",
        email: "admin@thptqg.edu.vn",
        phone: "0987654321",
        role: "Super Admin",
        department: "Ban Giám Hiệu"
    });

    // State lưu trữ mật khẩu (demo)
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: ""
    });

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = () => {
        // Xử lý API lưu thông tin ở đây
        alert("Đã lưu thông tin cá nhân thành công!");
    };

    const handleUpdatePassword = () => {
        if (passwords.new !== passwords.confirm) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
        // Xử lý API đổi mật khẩu ở đây
        alert("Đã cập nhật mật khẩu thành công!");
        setPasswords({ current: "", new: "", confirm: "" });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h2>
                    <p className="text-gray-500 text-sm mt-1">Quản lý thông tin tài khoản và cài đặt bảo mật của bạn.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cột trái: Ảnh đại diện & Thông tin tóm tắt */}
                <Card className="border-none shadow-sm md:col-span-1">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="relative mb-4 group cursor-pointer">
                            <div className="h-28 w-28 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border-4 border-white shadow-md overflow-hidden">
                                <User className="h-12 w-12" />
                                {/* Overlay hiện lên khi hover */}
                                <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-all">
                                    <Camera className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">{profile.fullName}</h3>
                        <p className="text-sm text-gray-500 mb-3">{profile.email}</p>
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 mb-1">
                            {profile.role}
                        </Badge>
                        <div className="flex items-center justify-center text-sm text-gray-500 mt-4 pt-4 border-t w-full">
                            <Shield className="h-4 w-4 mr-1.5 text-gray-400" />
                            Tài khoản đang hoạt động
                        </div>
                    </CardContent>
                </Card>

                {/* Cột phải: Form chỉnh sửa */}
                <div className="md:col-span-2 space-y-6">
                    {/* Card Thông tin cá nhân */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-4 border-b border-gray-100">
                            <CardTitle className="text-lg font-semibold flex items-center text-gray-800">
                                <User className="h-5 w-5 mr-2 text-blue-500" />
                                Thông tin cơ bản
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input 
                                            type="text" 
                                            name="fullName"
                                            value={profile.fullName}
                                            onChange={handleProfileChange}
                                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input 
                                            type="text" 
                                            name="phone"
                                            value={profile.phone}
                                            onChange={handleProfileChange}
                                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Địa chỉ Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={profile.email}
                                            onChange={handleProfileChange}
                                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Phòng ban / Chuyên môn</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <BookOpen className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input 
                                            type="text" 
                                            name="department"
                                            value={profile.department}
                                            onChange={handleProfileChange}
                                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Save className="h-4 w-4 mr-2" /> Lưu thông tin
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card Đổi mật khẩu */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="pb-4 border-b border-gray-100">
                            <CardTitle className="text-lg font-semibold flex items-center text-gray-800">
                                <Key className="h-5 w-5 mr-2 text-amber-500" />
                                Đổi mật khẩu
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                                    <input 
                                        type="password" 
                                        name="current"
                                        value={passwords.current}
                                        onChange={handlePasswordChange}
                                        placeholder="Nhập mật khẩu đang sử dụng"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
                                    <input 
                                        type="password" 
                                        name="new"
                                        value={passwords.new}
                                        onChange={handlePasswordChange}
                                        placeholder="Nhập mật khẩu mới"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                                    <input 
                                        type="password" 
                                        name="confirm"
                                        value={passwords.confirm}
                                        onChange={handlePasswordChange}
                                        placeholder="Nhập lại mật khẩu mới"
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button onClick={handleUpdatePassword} variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                                    Cập nhật mật khẩu
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;