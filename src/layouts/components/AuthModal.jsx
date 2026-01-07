
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Lock,
  Mail,
  Phone,
  BookOpen,
  X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const AuthModal = ({ isVisible, onClose, initialMode = "login" }) => {
  const [activeTab, setActiveTab] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      setActiveTab(initialMode);
    }
  }, [isVisible, initialMode]);

  // Login Schema
  const loginSchema = z.object({
    username: z.string().min(1, "Vui lòng nhập tên đăng nhập hoặc email"),
    password: z.string().min(1, "Vui lòng nhập mật khẩu"),
    remember: z.boolean().default(false),
  });

  // Register Schema
  const registerSchema = z.object({
    username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().optional(),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
    agreement: z.boolean().refine((val) => val === true, "Bạn phải đồng ý với điều khoản"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", remember: false },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", phone: "", password: "", confirmPassword: "", agreement: false },
  });

  const onLoginSubmit = async (values) => {
    setLoading(true);
    // Mock login
    setTimeout(() => {
      setLoading(false);
      onClose();
      console.log("Logged in:", values);
    }, 1000);
  };

  const onRegisterSubmit = async (values) => {
    setLoading(true);
    // Mock register
    setTimeout(() => {
      setLoading(false);
      setActiveTab("login");
      console.log("Registered:", values);
    }, 1000);
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden bg-white border-none shadow-xl rounded-2xl gap-0">
        {/* Header */}
        <div className="pt-8 pb-4 text-center px-6 relative">
          {/* Close Button specific for this custom header if needed, but DialogContent usually has one. 
                 We can customize it or leave the default. 
                 Default X is usually fine but let's make sure it doesn't overlap weirdly.
             */}

          <div className="flex flex-col items-center justify-center gap-3">
            {/* Logo Icon */}
            <div className="bg-gradient-to-br from-blue-500 to-sky-400 p-3 rounded-xl shadow-lg shadow-blue-200">
              <BookOpen className="h-8 w-8 text-white" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-blue-600 tracking-tight">Edu4All</h2>
              <p className="text-gray-500 text-sm font-medium">Hệ thống tự học cho học sinh cấp 3</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-transparent border-b border-gray-100 p-0 rounded-none h-auto">
            <TabsTrigger
              value="login"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 py-3 text-gray-500 font-semibold bg-transparent shadow-none"
            >
              Đăng nhập
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 py-3 text-gray-500 font-semibold bg-transparent shadow-none"
            >
              Đăng ký
            </TabsTrigger>
          </TabsList>

          <div className="p-6 md:px-8">
            <TabsContent value="login" className="mt-0 space-y-4">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Tên đăng nhập / Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-blue-600 transition-all" placeholder="Tên đăng nhập hoặc Email" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Mật khẩu</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input type="password" className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-blue-600 transition-all" placeholder="Mật khẩu" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between text-sm">
                    <FormField
                      control={loginForm.control}
                      name="remember"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} className="border-gray-300 text-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded" />
                          </FormControl>
                          <FormLabel className="font-normal text-gray-600">Ghi nhớ đăng nhập</FormLabel>
                        </FormItem>
                      )}
                    />
                    <Link to="/forgot-password" onClick={onClose} className="text-blue-600 hover:text-blue-700 font-semibold">
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white! font-bold h-11 rounded-lg shadow-blue-200 shadow-md" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Đăng nhập"}
                  </Button>
                </form>
              </Form>

              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-gray-200"></div>
                <span className="shrink-0 px-2 text-xs text-gray-400 uppercase font-bold">HOẶC</span>
                <div className="grow border-t border-gray-200"></div>
              </div>

              <Button variant="outline" className="w-full border-red-600 text-red-600! hover:bg-red-600 hover:text-white! h-11 font-semibold" type="button">
                <span className="mr-2 text-lg">G</span> Đăng nhập với Google
              </Button>
            </TabsContent>

            <TabsContent value="register" className="mt-0 space-y-4">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-3">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Tên đăng nhập</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input className="pl-9 bg-gray-50 border-gray-200" placeholder="JohnDoe123" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input className="pl-9 bg-gray-50 border-gray-200" placeholder="name@example.com" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Số điện thoại (Tùy chọn)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <Input className="pl-9 bg-gray-50 border-gray-200" placeholder="0123..." {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Mật khẩu</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input type="password" className="pl-9 bg-gray-50 border-gray-200" placeholder="****" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Nhập lại MK</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                              <Input type="password" className="pl-9 bg-gray-50 border-gray-200" placeholder="****" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={registerForm.control}
                    name="agreement"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-2 space-y-0 mt-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal text-xs text-gray-600">
                            Tôi đồng ý với <Link to="/terms" onClick={onClose} className="text-blue-600 hover:underline">Điều khoản</Link> và <Link to="/privacy" onClick={onClose} className="text-blue-600 hover:underline">Chính sách bảo mật</Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-lg mt-2 shadow-md shadow-blue-200" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Đăng ký"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
