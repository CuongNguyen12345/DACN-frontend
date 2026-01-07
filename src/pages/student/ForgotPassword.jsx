import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  ShieldCheck,
  ArrowLeft,
  Send,
  BookOpen,
  CheckCircle2,
  KeyRound
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP

  // Form Schema
  const formSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    otp: z.string().length(6, "Mã OTP phải có 6 ký tự").optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const handleSendOtp = async () => {
    const email = form.getValues("email");
    if (!email || !z.string().email().safeParse(email).success) {
      form.setError("email", { type: "manual", message: "Vui lòng nhập đúng email để nhận OTP" });
      return;
    }

    setSendingOtp(true);
    try {
      console.log("Sending OTP to:", email);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // alert("Đã gửi mã OTP!"); // Removed alert for better UX
      setStep(2); // Move to OTP step
    } catch (error) {
      console.error(error);
    } finally {
      setSendingOtp(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      console.log("Reset values:", values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Xác thực thành công! Vui lòng đặt lại mật khẩu của bạn.");
    } catch (error) {
      alert("Lỗi xác thực");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50">
      <Card className="w-full max-w-md shadow-xl border-none rounded-2xl bg-white overflow-hidden">
        <CardHeader className="text-center space-y-6 pt-8 pb-2">
          {/* Logo Branding */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-sky-400 p-3 rounded-xl shadow-lg shadow-blue-200">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-blue-600 tracking-tight">Edu4All</h2>
              <p className="text-gray-500 text-sm font-medium">Khôi phục quyền truy cập</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8 pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Step 1: Email Input */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Email đăng ký</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                          className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-blue-600 h-11 transition-all"
                          placeholder="name@example.com"
                          disabled={step === 2}
                          {...field}
                        />
                        {step === 2 && (
                          <div className="absolute right-3 top-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Step 2: OTP Input (Only shows after sending OTP) */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Mã xác thực OTP</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <ShieldCheck className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                              className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-blue-600 h-11 transition-all tracking-widest font-mono"
                              placeholder="000000"
                              maxLength={6}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-gray-500 text-center pt-2">
                          Mã OTP đã được gửi đến email của bạn.
                        </p>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-lg shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:shadow-blue-300"
                    disabled={loading}
                  >
                    {loading ? (
                      "Đang xác thực..."
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" /> Bấm vào đây để xác thực
                      </span>
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => { setStep(1); setSendingOtp(false); }}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Gửi lại mã?
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons for Step 1 */}
              {step === 1 && (
                <Button
                  type="button"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-lg shadow-md shadow-blue-200 transition-all hover:shadow-lg hover:shadow-blue-300"
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                >
                  {sendingOtp ? (
                    "Đang gửi mã..."
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" /> Gửi mã xác thực
                    </span>
                  )}
                </Button>
              )}

            </form>
          </Form>

          <div className="mt-8 pt-6 border-t border-gray-100/50 text-center">
            <Link to="/" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại trang chủ
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-gray-50 to-gray-50 pointer-events-none"></div>
    </div>
  );
}

export default ForgotPassword;