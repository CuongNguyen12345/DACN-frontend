import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  GraduationCap,
  ChevronRight,
  Calculator,
  FlaskConical,
  Globe,
  Zap,
  Search,
} from "lucide-react";

/**
 * Trang danh sách khóa học tổng quát
 * Hiển thị các khối lớp và môn học (Toán 10, Lý 11, ...)
 */
const CourseList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get("/api/learning/subjects");
        setSubjects(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách môn học:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const getSubjectIcon = (name) => {
    if (name.includes("Toán"))
      return <Calculator className="h-8 w-8 text-blue-500" />;
    if (name.includes("Lý")) return <Zap className="h-8 w-8 text-orange-500" />;
    if (name.includes("Hóa"))
      return <FlaskConical className="h-8 w-8 text-green-500" />;
    if (name.includes("Anh"))
      return <Globe className="h-8 w-8 text-purple-500" />;
    return <BookOpen className="h-8 w-8 text-slate-500" />;
  };

  const handleSubjectClick = async (name, grade) => {
    try {
      const response = await api.get("/api/learning/course/first-lesson", {
        params: { grade, subject: name }
      });
      const firstLessonId = response.data;
      if (firstLessonId) {
        navigate(`/course/learning/${firstLessonId}`);
      } else {
        // Nếu không có bài học nào, mặc định sang trang search
        navigate(`/course/search?subject=${name}&grade=${grade}`);
      }
    } catch (error) {
      console.error("Lỗi khi lấy bài học đầu tiên:", error);
      navigate(`/course/search?subject=${name}&grade=${grade}`);
    }
  };

  const groupedByGrade = subjects.reduce((acc, sub) => {
    const grade = sub.grade || "Khác";
    if (!acc[grade]) acc[grade] = [];
    acc[grade].push(sub);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <header className="space-y-4 text-left md:text-left flex-1">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wide">
              <GraduationCap className="w-4 h-4 mr-2" />
              HÀNH TRÌNH TRI THỨC
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Chọn Khối Lớp & Môn Học
            </h1>
            <p className="text-xl text-slate-500 max-w-3xl font-medium">
              Hệ thống bài giảng được phân loại khoa học theo chương trình mới
              nhất của Bộ Giáo dục.
            </p>
          </header>
          <button
            onClick={() => navigate("/course/search")}
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 group h-fit"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Tìm bài giảng nhanh
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : (
          Object.keys(groupedByGrade)
            .sort((a, b) => a - b)
            .map((grade) => (
              <div key={grade} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Khối Lớp {grade}
                  </h2>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {groupedByGrade[grade].map((sub) => (
                    <Card
                      key={sub.id}
                      className="group relative overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-white rounded-2xl p-6"
                      onClick={() => handleSubjectClick(sub.name, sub.grade)}
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        {getSubjectIcon(sub.name)}
                      </div>

                      <div className="flex flex-col h-full space-y-4">
                        <div className="p-3 bg-slate-50 rounded-xl w-fit group-hover:bg-primary/10 transition-colors">
                          {getSubjectIcon(sub.name)}
                        </div>

                        <div className="space-y-1">
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-600 border-none font-bold"
                          >
                            Lớp {sub.grade}
                          </Badge>
                          <CardTitle className="text-2xl font-black text-slate-800 group-hover:text-primary transition-colors">
                            {sub.name}
                          </CardTitle>
                        </div>

                        <div className="pt-4 flex items-center text-sm font-bold text-slate-400 group-hover:text-primary transition-colors">
                          KHÁM PHÁ NGAY
                          <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default CourseList;
