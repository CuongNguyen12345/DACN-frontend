import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP

  const formSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    otp: z.string().optional(), // We handle validation manually or purely via UI for now to keep it simple, or we can use refine.
  });

  // Simple validation for OTP when in step 2
  const validateOtp = (otp) => otp && otp.length === 6;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      if (step === 1) {
        // Step 1: Send OTP
        console.log("Sending OTP to:", values.email);
        await axios.post("http://localhost:8081/api/auth/request-otp", {
          email: values.email,
        });
        // Transition to Step 2
        setStep(2);
      } else {
        // Step 2: Verify OTP
        const otpValue = form.getValues("otp");
        if (!validateOtp(otpValue)) {
          form.setError("otp", { message: "Mã OTP phải có 6 ký tự" });
          return;
        }
        console.log("Verifying OTP:", otpValue);
        const res = await axios.post("http://localhost:8081/api/auth/verify-otp", {
          email: values.email,
          otp: otpValue
        });
        alert(res.data?.result || "Xác thực thành công! Mật khẩu mới đã được gửi vào email.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      if (step === 1) {
        form.setError("email", {
          message: error.response?.data?.message || "Có lỗi xảy ra khi gửi OTP",
        });
      } else {
        form.setError("otp", { message: "Xác thực thất bại" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Left: Home Button */}
      <div className="absolute top-8 left-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="hover:bg-transparent hover:text-[#0F4C81] gap-2 pl-0 text-gray-500 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Trang chủ
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0F4C81]">
              {step === 1 ? "Quên Mật Khẩu?" : "Nhập Mã OTP"}
            </h1>
            <p className="text-gray-500">
              {step === 1
                ? "Đừng lo, hãy nhập email để lấy lại mật khẩu nhé."
                : `Mã xác thực đã được gửi đến ${form.getValues("email")}`}
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 text-left"
            >
              {/* Step 1: Email Input */}
              {step === 1 && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-gray-700">
                        Email đăng ký
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="vidu@gmail.com"
                          className="h-12 bg-white border-gray-200 focus:ring-2 focus:ring-[#0F4C81]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 2: OTP Input */}
              {step === 2 && (
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-gray-700">
                        Mã OTP
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập 6 số OTP"
                          maxLength={6}
                          className="h-12 bg-white border-gray-200 focus:ring-2 focus:ring-[#0F4C81] tracking-widest text-center text-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-[#0F4C81] hover:bg-[#0C3B66] text-white font-bold text-base rounded-lg shadow-lg shadow-blue-900/10"
                disabled={loading}
              >
                {loading
                  ? "Đang xử lý..."
                  : step === 1
                    ? "Gửi yêu cầu"
                    : "Xác nhận"}
              </Button>

              {step === 2 && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm text-gray-500 hover:text-[#0F4C81] underline"
                  >
                    Gửi lại mã?
                  </button>
                </div>
              )}
            </form>
          </Form>

          <div className="pt-2">
            <Link
              to="/login"
              className="font-medium text-[#FF6B50] hover:underline inline-flex items-center gap-1"
            >
              <span className="text-sm font-bold">‹ Quay lại Đăng nhập</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
