import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Phone, Calendar, Shield, MapPin, 
  Activity, BookOpen, Award, Edit, Key, GraduationCap, CheckCircle2, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // Giả lập gọi API lấy chi tiết học viên dựa trên ID (HV001...)
    setStudent({
      id: id || "HV001",
      name: "Nguyễn Văn An",
      email: "nguyenvana@gmail.com",
      phone: "0901234567",
      address: "Thủ Dầu Một, Bình Dương",
      classGroup: "Lớp 12A1",
      status: "Hoạt động",
      joinedAt: "01/09/2025",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${id || "HV001"}`,
      stats: {
        totalExams: 15,
        avgScore: 8.5,
        completedCourses: 5
      },
      recentActivities: [
        { id: 1, action: "Nộp bài thi", target: "Toán Học Giữa Kỳ 1", date: "10:30 - 12/03/2026", status: "Hoàn thành" },
        { id: 2, action: "Đăng nhập", target: "Trình duyệt Chrome (Windows)", date: "08:15 - 12/03/2026", status: "Thành công" },
        { id: 3, action: "Xem kết quả", target: "Bài kiểm tra 15p Vật Lý", date: "14:20 - 10/03/2026", status: "Thành công" },
      ],
      recentExams: [
        { id: "E101", title: "Đề thi thử THPT Quốc gia môn Toán", subject: "Toán", score: 8.5, date: "10/03/2026", timeSpent: "85 phút" },
        { id: "E102", title: "Kiểm tra 15 phút Vật Lý chương 2", subject: "Vật Lý", score: 9.0, date: "08/03/2026", timeSpent: "12 phút" },
        { id: "E103", title: "Thi giữa kỳ Hóa Học lớp 12", subject: "Hóa Học", score: 7.5, date: "01/03/2026", timeSpent: "40 phút" },
      ]
    });
  }, [id]);

  if (!student) return <div className="p-6 text-center text-gray-500 flex items-center justify-center h-64">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)} // Nút Back quay lại trang danh sách trước đó
            className="p-2 hover:bg-gray-100 rounded-full transition-colors outline-none"
            title="Quay lại"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Hồ sơ Học viên</h2>
              <Badge variant="outline" className="font-mono text-xs bg-white text-gray-600">{student.id}</Badge>
            </div>
            <p className="text-sm text-gray-500">Xem chi tiết thông tin và kết quả học tập.</p>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Nút Khóa đã bị xóa vì có ở UserList. Nút Đặt lại pass dời xuống Card Bảo mật. */}
          <Button className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 gap-2">
            <Edit className="h-4 w-4" /> Chỉnh sửa hồ sơ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Thông tin cá nhân */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <CardContent className="px-6 pb-6 pt-0 relative flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-white -mt-12 overflow-hidden shadow-sm mb-4">
                <img src={student.avatar} alt={student.name} className="h-full w-full object-cover bg-gray-50" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{student.email}</p>
              
              <div className="flex gap-2 mb-6">
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none shadow-none font-medium flex items-center gap-1">
                  <GraduationCap className="h-3 w-3" /> {student.classGroup}
                </Badge>
                <Badge className={cn("border-none shadow-none font-medium", 
                  student.status === "Hoạt động" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                )}>
                  {student.status}
                </Badge>
              </div>

              <div className="w-full space-y-3 text-sm text-left">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{student.address}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Tham gia: {student.joinedAt}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-gray-500 flex items-center gap-2 uppercase tracking-wider">
                <Shield className="h-4 w-4" /> Bảo mật & Tài khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800">
                <Key className="h-4 w-4 text-orange-500" /> Đặt lại mật khẩu
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Cột phải: Thống kê & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-none shadow-sm bg-blue-50/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Lượt thi</p>
                  <p className="text-2xl font-bold text-gray-900">{student.stats.totalExams}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-emerald-50/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Điểm trung bình</p>
                  <p className="text-2xl font-bold text-gray-900">{student.stats.avgScore}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-purple-50/50">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Khóa học</p>
                  <p className="text-2xl font-bold text-gray-900">{student.stats.completedCourses}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs Control */}
          <Card className="border-none shadow-sm">
            <div className="border-b border-gray-100">
              <div className="flex gap-6 px-6">
                <button 
                  onClick={() => setActiveTab("overview")}
                  className={cn("py-4 text-sm font-medium border-b-2 transition-colors outline-none", 
                    activeTab === "overview" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                >
                  Lịch sử hoạt động
                </button>
                <button 
                  onClick={() => setActiveTab("exams")}
                  className={cn("py-4 text-sm font-medium border-b-2 transition-colors outline-none", 
                    activeTab === "exams" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
                  )}
                >
                  Kết quả bài thi
                </button>
              </div>
            </div>
            
            <CardContent className="p-0">
              {/* Tab: Lịch sử hoạt động */}
              {activeTab === "overview" && (
                <div className="divide-y divide-gray-100">
                  {student.recentActivities.map((activity) => (
                    <div key={activity.id} className="p-6 flex items-start sm:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                      <div className="p-2 bg-gray-100 rounded-full text-gray-500 mt-1 sm:mt-0">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action} <span className="font-normal text-gray-500">tại</span> {activity.target}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {activity.date}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs bg-white text-gray-600">
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab: Kết quả bài thi */}
              {activeTab === "exams" && (
                <div className="divide-y divide-gray-100">
                  {student.recentExams.map((exam) => (
                    <div key={exam.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-bold text-gray-900">{exam.title}</h4>
                          <Badge variant="secondary" className="text-[10px] bg-slate-100">{exam.subject}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {exam.date}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {exam.timeSpent}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">Điểm số</div>
                          <div className={cn("text-lg font-bold", 
                            exam.score >= 8 ? "text-emerald-600" : 
                            exam.score >= 5 ? "text-blue-600" : "text-red-600"
                          )}>
                            {exam.score} / 10
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;