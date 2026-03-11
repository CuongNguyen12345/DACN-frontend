import { useState } from "react";
import { Lock, Palette, Moon, Sun, Monitor } from "lucide-react";
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardFooter, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

const Settings = () => {
    // State giả lập cho Theme
    const [theme, setTheme] = useState("light");

    return (
        <div className="min-h-screen bg-gray-50/50 py-10 px-4 md:px-8">
            <div className="max-w-[800px] mx-auto">
                
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Cài đặt</h2>
                    <p className="text-muted-foreground mt-2">
                        Quản lý bảo mật tài khoản và tùy chỉnh giao diện của bạn.
                    </p>
                </div>

                <Tabs defaultValue="security" className="w-full">
                    {/* Menu Tabs */}
                    <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                        <TabsTrigger value="security" className="text-base h-full">
                            <Lock className="w-4 h-4 mr-2" /> Bảo mật
                        </TabsTrigger>
                        <TabsTrigger value="appearance" className="text-base h-full">
                            <Palette className="w-4 h-4 mr-2" /> Giao diện
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab Đổi Mật Khẩu */}
                    <TabsContent value="security">
                        <Card className="shadow-sm border-gray-100">
                            <CardHeader>
                                <CardTitle className="text-xl">Đổi mật khẩu</CardTitle>
                                <CardDescription>
                                    Vui lòng nhập mật khẩu hiện tại và mật khẩu mới để cập nhật.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current">Mật khẩu hiện tại</Label>
                                    <Input id="current" type="password" placeholder="••••••••" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new">Mật khẩu mới</Label>
                                    <Input id="new" type="password" placeholder="••••••••" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm">Xác nhận mật khẩu mới</Label>
                                    <Input id="confirm" type="password" placeholder="••••••••" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="bg-[#3B82F6] hover:bg-[#2563EB]">
                                    Cập nhật mật khẩu
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Tab Đổi Theme */}
                    <TabsContent value="appearance">
                        <Card className="shadow-sm border-gray-100">
                            <CardHeader>
                                <CardTitle className="text-xl">Giao diện (Theme)</CardTitle>
                                <CardDescription>
                                    Tùy chỉnh giao diện hiển thị của Edu4All theo sở thích của bạn.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Option Sáng */}
                                    <div 
                                        className={`border-2 rounded-xl p-4 cursor-pointer flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-[#3B82F6] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                                        onClick={() => setTheme('light')}
                                    >
                                        <div className="p-3 bg-white rounded-full shadow-sm">
                                            <Sun className="w-6 h-6 text-orange-500" />
                                        </div>
                                        <span className="font-medium text-gray-700">Sáng (Light)</span>
                                    </div>

                                    {/* Option Tối */}
                                    <div 
                                        className={`border-2 rounded-xl p-4 cursor-pointer flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-[#3B82F6] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                                        onClick={() => setTheme('dark')}
                                    >
                                        <div className="p-3 bg-gray-900 rounded-full shadow-sm">
                                            <Moon className="w-6 h-6 text-blue-300" />
                                        </div>
                                        <span className="font-medium text-gray-700">Tối (Dark)</span>
                                    </div>

                                    {/* Option Hệ thống */}
                                    <div 
                                        className={`border-2 rounded-xl p-4 cursor-pointer flex flex-col items-center gap-3 transition-all ${theme === 'system' ? 'border-[#3B82F6] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                                        onClick={() => setTheme('system')}
                                    >
                                        <div className="p-3 bg-gray-100 rounded-full shadow-sm">
                                            <Monitor className="w-6 h-6 text-gray-600" />
                                        </div>
                                        <span className="font-medium text-gray-700">Theo hệ thống</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
};

export default Settings;