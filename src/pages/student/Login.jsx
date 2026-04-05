import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import api from "../../services/api";
import loginImage from "../../assets/Kids_Studying_from_Home-pana.png";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ email và mật khẩu");
      return;
    }

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data.result;
      login(token, user);
      navigate("/");
    } catch (error) {
      console.error("Lỗi đăng nhập thường:", error);

      if (error.response) {
        alert(
          error.response.data?.message ||
            "Đăng nhập thất bại. Kiểm tra lại thông tin.",
        );
      } else {
        alert("Có lỗi xảy ra khi kết nối máy chủ");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      // Có thể thêm scope nếu sau này cần
      // provider.addScope("email");
      // provider.addScope("profile");

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Firebase ID token, backend có thể verify nếu cần
      const idToken = await user.getIdToken();

      const googleUserData = {
        email: user.email,
        name: user.displayName,
        // photoUrl: user.photoURL,
        // uid: user.uid,
        // idToken: idToken,
      };

      const response = await api.post("/api/auth/google", googleUserData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        },
      );

      const { token, user: loggedInUser } = response.data.result;
      login(token, loggedInUser);
      navigate("/");
    } catch (error) {
      console.error("Lỗi đăng nhập bằng Google:", error);

      if (error.code === "auth/popup-closed-by-user") {
        alert("Bạn đã đóng cửa sổ đăng nhập Google.");
        return;
      }

      if (error.code === "auth/unauthorized-domain") {
        alert("Domain hiện tại chưa được cấp quyền trong Firebase.");
        return;
      }

      if (error.response) {
        alert(error.response.data?.message || "Đăng nhập Google thất bại.");
      } else {
        alert("Có lỗi xảy ra khi đăng nhập bằng Google.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      <div className="hidden lg:flex w-1/2 bg-white items-center justify-center p-12 relative">
        <div className="z-10 max-w-lg text-center space-y-6">
          <div className="absolute top-8 left-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="hover:bg-transparent hover:text-[#0F4C81] gap-2 pl-0 text-gray-500 font-medium cursor-pointer"
            >
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

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="hover:bg-transparent hover:text-[#0F4C81] gap-2 pl-0 text-gray-500 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Trang chủ
          </Button>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#0F4C81]">Đăng Nhập</h1>
            <p className="text-gray-500">Nhập thông tin để vào học ngay</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-bold text-gray-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vidu@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white border-gray-200 focus:ring-2 focus:ring-[#0F4C81]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs font-bold text-gray-700"
                >
                  Mật khẩu
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-white border-gray-200 focus:ring-2 focus:ring-[#0F4C81]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="border-gray-300 text-[#0F4C81] data-[state=checked]:bg-[#0F4C81] data-[state=checked]:border-[#0F4C81]"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium text-gray-600 cursor-pointer"
                >
                  Ghi nhớ tôi
                </Label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm font-bold text-[#0F4C81] hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#0F4C81] hover:bg-[#0C3B66] text-white font-bold text-base rounded-lg shadow-lg shadow-blue-900/10"
            >
              Đăng nhập
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">Hoặc</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full h-12 font-medium text-gray-700 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors duration-300 rounded-lg gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Đăng nhập bằng Google
          </Button>

          <p className="text-center text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-bold text-[#FF6B50] hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
