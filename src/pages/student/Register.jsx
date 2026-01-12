
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import loginImage from "../../assets/Kids_Studying_from_Home-pana.png";

const Register = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex bg-white">
            {/* Left: Illustration */}
            <div className="hidden lg:flex w-1/2 bg-white items-center justify-center p-12 relative">
                <div className="z-10 max-w-lg text-center space-y-6">
                    <div className="absolute top-8 left-8">
                        <Button variant="ghost" onClick={() => navigate('/')} className="hover:bg-transparent hover:text-[#0F4C81] gap-2 pl-0 text-gray-500 font-medium cursor-pointer">
                            <ArrowLeft className="w-4 h-4" /> Trang chủ
                        </Button>
                    </div>
                    <img
                        src={loginImage}
                        alt="Login Illustration"
                        className="w-full object-contain"
                    />
                </div>
            </div>

            {/* Right: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative">
                {/* Mobile Back Button */}
                <div className="absolute top-8 left-8 lg:hidden">
                    <Button variant="ghost" onClick={() => navigate('/')} className="hover:bg-transparent hover:text-[#0F4C81] gap-2 pl-0 text-gray-500 font-medium cursor-pointer">
                        <ArrowLeft className="w-4 h-4" /> Trang chủ
                    </Button>
                </div>

                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-[#0F4C81]">Tạo Tài Khoản</h1>
                    </div>

                    <form className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullname" className="text-xs font-bold text-gray-700">Họ và tên</Label>
                                <Input
                                    id="fullname"
                                    placeholder="Nguyen Van A"
                                    className="h-12 bg-white border-gray-200 focus:ring-2 focus:ring-[#0F4C81]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs font-bold text-gray-700">Email</Label>
                                <Input
                                    id="email"
                                    placeholder="vidu@gmail.com"
                                    className="h-12 bg-white border-gray-200 focus:ring-2 focus:ring-[#0F4C81]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs font-bold text-gray-700">Mật khẩu</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Tạo mật khẩu"
                                    className="h-12 bg-white border-gray-200 focus:ring-2 focus:ring-[#0F4C81]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-xs font-bold text-gray-700">Nhập lại mật khẩu</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Nhập lại mật khẩu"
                                    className="h-12 bg-white border-gray-200 focus:ring-2 focus:ring-[#0F4C81]"
                                />
                            </div>
                        </div>

                        <Button className="w-full h-12 bg-[#0F4C81] hover:bg-[#0C3B66] text-white font-bold text-base rounded-lg shadow-lg shadow-blue-900/10">
                            Đăng ký
                        </Button>
                    </form>

                    <div className="text-center pt-4">
                        <p className="text-sm text-gray-600">
                            Đã có tài khoản?{" "}
                            <Link to="/login" className="font-bold text-[#FF6B50] hover:underline">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
