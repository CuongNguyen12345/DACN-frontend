import React from "react";
import { 
  Search, 
  Calendar, 
  User, 
  ArrowRight, 
  Clock, 
  Tag 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Blog = () => {
  // Mock Data
  const posts = [
    {
      id: 1,
      title: "Bí quyết ôn thi THPT Quốc gia đạt điểm 9+ môn Toán",
      excerpt: "Tổng hợp các phương pháp giải nhanh và lộ trình ôn tập nước rút trong 3 tháng cuối...",
      category: "Góc học tập",
      author: "Thầy Nguyễn Văn A",
      date: "12/10/2023",
      image: "bg-blue-100", // Placeholder màu
    },
    {
      id: 2,
      title: "Cấu trúc đề thi Tiếng Anh năm 2024 có gì mới?",
      excerpt: "Phân tích chi tiết ma trận đề thi và những thay đổi quan trọng mà sĩ tử cần lưu ý.",
      category: "Tin tức",
      author: "Cô Sarah",
      date: "10/10/2023",
      image: "bg-orange-100",
    },
    {
      id: 3,
      title: "5 thói quen giúp bạn tập trung cao độ khi học online",
      excerpt: "Làm sao để không bị xao nhãng bởi mạng xã hội khi ngồi trước máy tính?",
      category: "Kỹ năng mềm",
      author: "Admin",
      date: "08/10/2023",
      image: "bg-green-100",
    },
    {
      id: 4,
      title: "Review chi tiết các trường Đại học khối ngành Kinh tế",
      excerpt: "Nên chọn NEU, FTU hay AOF? Cùng phân tích điểm mạnh yếu của từng trường.",
      category: "Hướng nghiệp",
      author: "Admin",
      date: "05/10/2023",
      image: "bg-purple-100",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-white border-b py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog & Tin tức</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Cập nhật những thông tin mới nhất về giáo dục, kinh nghiệm ôn thi và hướng nghiệp dành cho học sinh.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Featured Post (Bài nổi bật nhất) */}
          <Card className="overflow-hidden border-none shadow-lg group cursor-pointer">
            <div className="h-64 bg-slate-200 w-full relative">
                 {/* Giả lập ảnh */}
                 <div className="absolute inset-0 flex items-center justify-center text-gray-400">Featured Image 800x400</div>
            </div>
            <CardContent className="p-6">
              <div className="flex gap-2 mb-3">
                 <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">Nổi bật</Badge>
                 <span className="flex items-center text-xs text-gray-500"><Calendar className="h-3 w-3 mr-1"/> 15/10/2023</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors">
                Lộ trình ôn thi Đại học toàn diện cho học sinh mất gốc
              </h2>
              <p className="text-gray-600 mb-4">
                Bạn đang lo lắng vì kiến thức nền tảng chưa vững? Đừng lo, bài viết này sẽ vạch ra lộ trình chi tiết từng ngày để bạn lấy lại phong độ...
              </p>
              <Button variant="link" className="p-0 h-auto text-blue-600 font-semibold">
                Đọc tiếp <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Recent Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full">
                <div className={`h-40 w-full ${post.image} flex items-center justify-center text-gray-400 text-sm font-medium`}>
                    Thumbnail
                </div>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline" className="text-xs font-normal">{post.category}</Badge>
                    <span className="text-xs text-gray-400 flex items-center"><Clock className="h-3 w-3 mr-1"/> 5 min read</span>
                  </div>
                  <CardTitle className="text-lg leading-tight hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-1">
                  <p className="text-sm text-gray-500 line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter className="p-4 border-t bg-gray-50/50 flex justify-between items-center text-xs text-gray-500">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center"><User className="h-3 w-3"/></div>
                      {post.author}
                   </div>
                   <span>{post.date}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <div className="space-y-8">
          {/* Search Widget */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tìm kiếm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Nhập từ khóa..." className="pl-9" />
              </div>
            </CardContent>
          </Card>

          {/* Categories Widget */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Danh mục</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {["Góc học tập", "Tin tức giáo dục", "Review sách", "Kỹ năng mềm", "Hướng nghiệp"].map((cat) => (
                <div key={cat} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded cursor-pointer transition-colors">
                  <span className="text-sm text-gray-600">{cat}</span>
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">12</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tags Widget */}
          <Card>
             <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tags phổ biến</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
               {["#Toan12", "#TiengAnh", "#DaiHoc", "#Motivation", "#TuHoc"].map(tag => (
                 <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-blue-50 hover:text-blue-600 border-gray-300">
                    {tag}
                 </Badge>
               ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Blog;