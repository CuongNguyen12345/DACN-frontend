import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  HeartHandshake,
  Lightbulb,
  MessageCircle,
  Target,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { value: "50K+", label: "học viên", icon: Users },
  { value: "1.2K", label: "bài học", icon: BookOpen },
  { value: "200+", label: "giáo viên", icon: Award },
  { value: "24/7", label: "hỗ trợ", icon: MessageCircle },
];

const values = [
  {
    title: "Dễ tiếp cận",
    description: "Nội dung được trình bày rõ ràng, theo từng bước để học sinh ở nhiều trình độ đều có thể bắt đầu.",
    icon: HeartHandshake,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Cá nhân hóa",
    description: "Lộ trình, bài luyện tập và gợi ý ôn tập được thiết kế xoay quanh mục tiêu học tập của từng bạn.",
    icon: Target,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    title: "Học có định hướng",
    description: "Edu4All giúp học sinh hiểu mình đang ở đâu, cần học gì tiếp theo và tiến bộ qua từng tuần.",
    icon: Lightbulb,
    tone: "bg-amber-50 text-amber-700",
  },
];

const team = [
  { name: "Nguyễn Minh Anh", role: "Cố vấn học tập", initial: "MA", tone: "bg-blue-600" },
  { name: "Trần Hoàng Nam", role: "Thiết kế lộ trình", initial: "HN", tone: "bg-emerald-600" },
  { name: "Lê Phương Linh", role: "Nội dung giáo dục", initial: "PL", tone: "bg-rose-600" },
  { name: "Phạm Gia Bảo", role: "Công nghệ học tập", initial: "GB", tone: "bg-violet-600" },
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="border-b bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <Badge className="mb-5 w-fit bg-blue-100 text-blue-700 hover:bg-blue-100">Về Edu4All</Badge>
            <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
              Học tập rõ hướng, tiến bộ từng ngày
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Edu4All đồng hành cùng học sinh bằng nội dung dễ hiểu, lộ trình cá nhân hóa và công cụ luyện tập thực tế.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="rounded-full bg-blue-600 px-6 hover:bg-blue-700" onClick={() => navigate("/roadmap")}>
                Xem lộ trình
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-6" onClick={() => navigate("/course")}>
                Khám phá bài học
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((item) => (
            <Card key={item.label} className="border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-blue-700">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="text-3xl font-black">{item.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <Badge variant="outline" className="mb-4 rounded-full">Sứ mệnh</Badge>
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">Biến việc học thành một hành trình có thể theo dõi</h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            Chúng tôi xây dựng Edu4All để học sinh không còn phải tự mò mẫm giữa quá nhiều tài liệu. Mỗi bài học, đề luyện và gợi ý ôn tập đều hướng về một mục tiêu: giúp bạn hiểu rõ phần cần cải thiện và biết bước tiếp theo.
          </p>
        </div>
        <div className="space-y-4">
          {[
            "Cung cấp lộ trình học tập cá nhân hóa theo năng lực.",
            "Kết nối bài học, luyện đề và lịch sử kết quả thành một trải nghiệm thống nhất.",
            "Giúp học sinh tự tin hơn khi chuẩn bị cho các kỳ thi quan trọng.",
          ].map((item) => (
            <div key={item} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
              <p className="leading-7 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-4 rounded-full bg-white">Giá trị cốt lõi</Badge>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">Những nguyên tắc chúng tôi theo đuổi</h2>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {values.map((value) => (
              <Card key={value.title} className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${value.tone}`}>
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-black">{value.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="outline" className="mb-4 rounded-full">Đội ngũ</Badge>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl">Những người đứng sau Edu4All</h2>
          </div>
          <p className="max-w-xl leading-7 text-slate-600">
            Chúng tôi kết hợp kinh nghiệm giáo dục, thiết kế nội dung và công nghệ để tạo ra trải nghiệm học tập thực tế hơn.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <Card key={member.name} className="border-slate-200 shadow-sm">
              <CardContent className="p-5">
                <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-black text-white ${member.tone}`}>
                  {member.initial}
                </div>
                <h3 className="font-black">{member.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-950 px-6 py-10 text-white shadow-xl md:px-10 md:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Sẵn sàng bắt đầu học theo lộ trình?</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Chọn bài học phù hợp, luyện đề thường xuyên và theo dõi tiến bộ của bạn ngay trong Edu4All.
              </p>
            </div>
            <Button size="lg" className="rounded-full bg-white px-6 text-slate-950 hover:bg-slate-100" onClick={() => navigate("/course")}>
              Bắt đầu học
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
