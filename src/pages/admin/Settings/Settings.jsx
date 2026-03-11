import { useState } from "react";
import { 
    Globe, 
    Shield, 
    Bell, 
    Save, 
    CheckCircle2,
    Lock,
    EyeOff
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Settings = () => {
    // Quản lý tab đang active
    const [activeTab, setActiveTab] = useState("general");

    // State lưu trữ cấu hình hệ thống
    const [config, setConfig] = useState({
        // Cài đặt chung
        siteName: "Hệ thống Thi Trắc nghiệm Online",
        contactEmail: "admin@thptqg.edu.vn",
        description: "Nền tảng tổ chức thi và ôn tập trực tuyến dành cho học sinh trung học phổ thông.",
        
        // Bảo mật & Thi cử
        requireLogin: true,
        preventTabSwitch: true,
        preventCopy: true,
        showResultImmediately: false,
        
        // Thông báo
        emailNewStudent: true,
        emailWeeklyReport: false,
        emailSystemErrors: true
    });

    // Hàm xử lý thay đổi text input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    // Hàm xử lý thay đổi toggle (công tắc)
    const handleToggle = (name) => {
        setConfig(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleSaveSettings = () => {
        alert("Đã lưu cấu hình hệ thống thành công!");
    };

    // Component Toggle (Công tắc) custom bằng Tailwind
    const ToggleSwitch = ({ checked, onChange, name }) => (
        <button
            type="button"
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
            onClick={() => onChange(name)}
        >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
    );

    // Dữ liệu menu sidebar
    const tabs = [
        { id: "general", label: "Cài đặt chung", icon: Globe, desc: "Thông tin cơ bản của hệ thống" },
        { id: "security", label: "Bảo mật & Thi cử", icon: Shield, desc: "Chống gian lận và quy chế" },
        { id: "notifications", label: "Thông báo", icon: Bell, desc: "Cấu hình gửi email tự động" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h2>
                    <p className="text-gray-500 text-sm mt-1">Tùy chỉnh các tham số hoạt động, bảo mật và thông báo.</p>
                </div>
                <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="h-4 w-4 mr-2" /> Lưu thay đổi
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar Navigation */}
                <Card className="border-none shadow-sm md:col-span-1 h-fit">
                    <CardContent className="p-4 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                                    activeTab === tab.id 
                                        ? "bg-blue-50 text-blue-700 font-medium" 
                                        : "text-gray-600 hover:bg-gray-50"
                                }`}
                            >
                                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? "text-blue-600" : "text-gray-400"}`} />
                                <div>
                                    <div className="text-sm">{tab.label}</div>
                                </div>
                            </button>
                        ))}
                    </CardContent>
                </Card>

                {/* Content Area */}
                <div className="md:col-span-3 space-y-6">
                    {/* Tab: Cài đặt chung */}
                    {activeTab === "general" && (
                        <Card className="border-none shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <CardHeader className="pb-4 border-b border-gray-100">
                                <CardTitle className="text-lg font-semibold text-gray-800">Thông tin cơ bản</CardTitle>
                                <CardDescription>Các thông tin này sẽ hiển thị trên trang chủ của học viên.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Tên hệ thống / Tên trường</label>
                                    <input 
                                        type="text" 
                                        name="siteName"
                                        value={config.siteName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Email hỗ trợ học viên</label>
                                    <input 
                                        type="email" 
                                        name="contactEmail"
                                        value={config.contactEmail}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-700">Mô tả ngắn gọn</label>
                                    <textarea 
                                        name="description"
                                        value={config.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Tab: Bảo mật & Thi cử */}
                    {activeTab === "security" && (
                        <Card className="border-none shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <CardHeader className="pb-4 border-b border-gray-100">
                                <CardTitle className="text-lg font-semibold text-gray-800">Chống gian lận & Quy chế thi</CardTitle>
                                <CardDescription>Cấu hình các biện pháp bảo mật áp dụng mặc định cho tất cả các đề thi.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-medium text-gray-900">Bắt buộc đăng nhập</div>
                                        <div className="text-sm text-gray-500">Người dùng phải có tài khoản mới được tham gia thi.</div>
                                    </div>
                                    <ToggleSwitch checked={config.requireLogin} onChange={handleToggle} name="requireLogin" />
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center text-sm font-medium text-gray-900">
                                            <EyeOff className="h-4 w-4 mr-1.5 text-amber-500" /> Cảnh báo chuyển Tab/Cửa sổ
                                        </div>
                                        <div className="text-sm text-gray-500">Tự động thu bài hoặc cảnh báo khi học viên rời khỏi màn hình làm bài.</div>
                                    </div>
                                    <ToggleSwitch checked={config.preventTabSwitch} onChange={handleToggle} name="preventTabSwitch" />
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center text-sm font-medium text-gray-900">
                                            <Lock className="h-4 w-4 mr-1.5 text-amber-500" /> Chống Copy & Paste
                                        </div>
                                        <div className="text-sm text-gray-500">Vô hiệu hóa chuột phải và phím tắt sao chép trong lúc làm bài.</div>
                                    </div>
                                    <ToggleSwitch checked={config.preventCopy} onChange={handleToggle} name="preventCopy" />
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-medium text-gray-900">Hiển thị điểm ngay lập tức</div>
                                        <div className="text-sm text-gray-500">Học viên có thể xem điểm và đáp án ngay sau khi nộp bài thay vì chờ hết hạn.</div>
                                    </div>
                                    <ToggleSwitch checked={config.showResultImmediately} onChange={handleToggle} name="showResultImmediately" />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Tab: Thông báo */}
                    {activeTab === "notifications" && (
                        <Card className="border-none shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <CardHeader className="pb-4 border-b border-gray-100">
                                <CardTitle className="text-lg font-semibold text-gray-800">Cấu hình Email tự động</CardTitle>
                                <CardDescription>Chọn các sự kiện mà hệ thống sẽ tự động gửi email thông báo cho bạn.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-medium text-gray-900">Học viên mới đăng ký</div>
                                        <div className="text-sm text-gray-500">Gửi email khi có tài khoản học viên mới được tạo thành công.</div>
                                    </div>
                                    <ToggleSwitch checked={config.emailNewStudent} onChange={handleToggle} name="emailNewStudent" />
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-medium text-gray-900">Báo cáo tổng kết hàng tuần</div>
                                        <div className="text-sm text-gray-500">Nhận email thống kê số lượt thi và phổ điểm vào mỗi sáng thứ Hai.</div>
                                    </div>
                                    <ToggleSwitch checked={config.emailWeeklyReport} onChange={handleToggle} name="emailWeeklyReport" />
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="space-y-0.5">
                                        <div className="text-sm font-medium text-gray-900">Cảnh báo lỗi hệ thống</div>
                                        <div className="text-sm text-gray-500">Nhận thông báo khẩn cấp khi server quá tải hoặc lỗi cơ sở dữ liệu.</div>
                                    </div>
                                    <ToggleSwitch checked={config.emailSystemErrors} onChange={handleToggle} name="emailSystemErrors" />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;