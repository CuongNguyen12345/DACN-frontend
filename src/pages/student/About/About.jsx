import React from "react";
import {
  Users,
  Award,
  BookOpen,
  CheckCircle,
  TrendingUp,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* 1. HERO SECTION - Phần mở đầu */}
      <div className="bg-blue-900 text-white py-24">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-6 py-2 rounded-full text-sm font-medium transition-all duration-300">
            ✨ Về Edu4All
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Đồng hành cùng <span className="text-blue-300">tri thức Việt</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed opacity-90">
            Chúng tôi tin rằng mọi học sinh đều xứng đáng được tiếp cận nền giáo dục chất lượng cao,
            cá nhân hóa và hiện đại, bất kể khoảng cách địa lý.
          </p>
        </div>
      </div>

      {/* 2. STATS SECTION (Con số ấn tượng) */}
      <div className="container mx-auto px-4 -mt-12 relative z-10 mb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {[
            { num: "50K+", label: "Học viên", icon: Users },
            { num: "1.2K", label: "Bài giảng", icon: BookOpen },
            { num: "200+", label: "Giáo viên", icon: Award },
            { num: "95%", label: "Hài lòng", icon: Heart },
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-8 border-r last:border-0 border-gray-100 group hover:bg-blue-50 transition-colors">
              <div className="w-12 h-12 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">{stat.num}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. MISSION & VISION (Sứ mệnh & Tầm nhìn) */}
      <div className="container mx-auto px-4 py-20 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sứ mệnh của chúng tôi</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Edu4All ra đời với mong muốn xóa bỏ rào cản trong việc tiếp cận kiến thức.
                Chúng tôi xây dựng một hệ sinh thái học tập nơi công nghệ hỗ trợ tối đa cho trải nghiệm người dùng.
              </p>
            </div>
            <ul className="space-y-4">
              {[
                "Cung cấp lộ trình học tập cá nhân hóa bằng AI.",
                "Kết nối học sinh với đội ngũ giáo viên hàng đầu.",
                "Hỗ trợ giải đáp thắc mắc 24/7, mọi lúc mọi nơi."
              ].map((item, i) => (
                <li key={i} className="flex items-start text-gray-700 text-lg">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 shadow-lg shadow-blue-200">
              Xem lộ trình học tập
            </Button>
          </div>
          {/* Image Placeholder */}
          <div className="bg-gray-100 rounded-3xl h-[500px] relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 mix-blend-multiply z-10"></div>
            <img src="https://source.unsplash.com/random/800x600/?students,learning,technology" alt="Học sinh Edu4All" className="object-cover w-full h-full" />
          </div>
        </div>
      </div>

      {/* 4. CORE VALUES (Giá trị cốt lõi) */}
      <div className="bg-slate-50 py-24 mb-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Giá trị cốt lõi</h2>
            <p className="text-gray-600 text-lg">Kim chỉ nam cho mọi hoạt động, giúp chúng tôi tạo ra những giá trị thực sự cho cộng đồng.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Chất lượng", desc: "Nội dung bài giảng được biên soạn và kiểm duyệt khắt khe bởi hội đồng chuyên môn uy tín.", icon: Award },
              { title: "Sáng tạo", desc: "Không ngừng đổi mới phương pháp giảng dạy, áp dụng công nghệ tiên tiến nhất vào học tập.", icon: TrendingUp },
              { title: "Tận tâm", desc: "Luôn đặt người học làm trung tâm, lắng nghe và hỗ trợ nhiệt tình trên mọi hành trình.", icon: Heart }
            ].map((val, idx) => (
              <Card key={idx} className="border-none shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white">
                <CardContent className="p-10 text-center space-y-6">
                  <div className="w-16 h-16 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                    <val.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{val.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{val.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* 5. TEAM (Đội ngũ) */}
      <div className="container mx-auto px-4 py-20 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Đội ngũ chuyên gia</h2>
          <p className="text-gray-600 text-lg">Những người tâm huyết đứng sau sự thành công của Edu4All.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="text-center group">
              <div className="w-48 h-48 mx-auto bg-gray-200 rounded-full mb-6 overflow-hidden border-4 border-white shadow-lg group-hover:border-blue-200 group-hover:shadow-xl transition-all">
                <img src={`https://source.unsplash.com/random/200x200/?portrait,professional,${item}`} alt="Thành viên" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Nguyễn Văn A</h3>
              <p className="text-blue-600 font-medium mb-3">Co-Founder & CEO</p>
              <p className="text-gray-500 text-sm px-4">10+ năm kinh nghiệm trong lĩnh vực EdTech và quản lý giáo dục.</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. CTA (Kêu gọi hành động) - ĐÃ SỬA LỖI */}
      <div className="bg-blue-600 py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-4 flex flex-col items-center text-center text-white relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Sẵn sàng bứt phá điểm số ngay hôm nay?
          </h2>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Gia nhập cộng đồng hơn 50,000 học sinh đang học tập hiệu quả và chinh phục mục tiêu cùng Edu4All.
          </p>
          
          {/* Các nút bấm đã được căn giữa và bổ sung chữ */}
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-10 h-14 text-lg shadow-xl transition-transform hover:scale-105 w-full sm:w-auto">
              Đăng ký miễn phí
            </Button>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-10 h-14 text-lg shadow-xl transition-transform hover:scale-105 w-full sm:w-auto">
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutUs;