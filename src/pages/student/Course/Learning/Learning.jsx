import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  PlayCircle,
  CheckCircle2,
  ArrowLeft,
  FileText,
  HelpCircle,
  Heart,
  Download,
  Edit3,
  FlaskConical,
  Maximize2,
  Minimize2
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import NoteTab from "./components/NoteTab";
import QnATab from "./components/QnATab";
import QuizTab from "./components/QuizTab";

const Learning = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  // Mock data
  const lessons = [
    {
      id: 1,
      title: "Bài 1: Khảo sát hàm số bậc 3",
      duration: "15:30",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      isCompleted: true,
      content: `
        <h3 class="text-lg font-semibold mb-2">1. Khái niệm cơ bản</h3>
        <p class="mb-4">Trong bài học này, chúng ta sẽ tìm hiểu về các khái niệm nền tảng...</p>
        <h3 class="text-lg font-semibold mb-2">2. Nội dung chính</h3>
        <p class="mb-2">Các định luật bảo toàn và ứng dụng thực tiễn trong đời sống.</p>
        <ul class="list-disc list-inside space-y-1">
          <li>Định luật 1</li>
          <li>Định luật 2</li>
        </ul>
      `
    },
    {
      id: 2,
      title: "Bài 2: Các định luật cơ bản",
      duration: "20:45",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      isCompleted: false,
      content: "<p>Nội dung lý thuyết bài 2 đang được cập nhật...</p>"
    },
    {
      id: 3,
      title: "Bài 3: Bài tập vận dụng",
      duration: "45:00",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      isCompleted: false,
      content: "<p>Hướng dẫn giải bài tập chi tiết...</p>"
    },
    {
      id: 4,
      title: "Bài 4: Ôn tập chương 1",
      duration: "30:15",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      isCompleted: false,
      content: "<p>Tổng hợp kiến thức chương 1...</p>"
    },
    {
      id: 5,
      title: "Bài 5: Kiểm tra 15 phút",
      duration: "15:00",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      isCompleted: false,
      content: "<p>Đề kiểm tra trắc nghiệm...</p>"
    },
  ];

  const [activeLesson, setActiveLesson] = useState(lessons[0]);

  return (
    <TooltipProvider>
      <div className={cn(
        "min-h-[calc(100vh-4rem)] bg-gray-50/50 flex flex-col",
        focusMode && "fixed inset-0 z-100 bg-background h-screen"
      )}>
        {/* Header Navigation (Hidden in Focus Mode) */}
        {!focusMode && (
          <div className="bg-background border-b px-6 py-3 shadow-sm">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-1">
                    <ArrowLeft className="h-4 w-4" /> Trang chủ
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink>Toán học</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{activeLesson.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        )}

        <div className={cn(
          "flex-1 p-6 transition-all duration-300",
          focusMode ? "p-0 h-full" : "container mx-auto max-w-[1600px]"
        )}>
          {!focusMode && (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{activeLesson.title}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={cn(isFavorite && "text-red-500 hover:text-red-600 border-red-200 bg-red-50")}
                    >
                      <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isFavorite ? "Bỏ yêu thích" : "Yêu thích"}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" /> Tải tài liệu
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tải tài liệu PDF</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={focusMode ? "default" : "secondary"}
                      onClick={() => setFocusMode(!focusMode)}
                    >
                      {focusMode ? <Minimize2 className="mr-2 h-4 w-4" /> : <Maximize2 className="mr-2 h-4 w-4" />}
                      {focusMode ? "Thoát Focus" : "Focus Mode"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{focusMode ? "Thoát chế độ tập trung" : "Chế độ tập trung"}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}

          <div className={cn("grid gap-6 h-full", focusMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3")}>
            {/* Left Column: Video & Theory */}
            <div className={cn("flex flex-col gap-6", focusMode ? "col-span-1 h-full" : "lg:col-span-2")}>
              {/* Video Player Section */}
              <div className={cn(
                "bg-black relative rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-900/5",
                focusMode ? "h-full flex items-center justify-center rounded-none" : "aspect-video"
              )}>
                <iframe
                  className="w-full h-full absolute inset-0"
                  src={activeLesson.videoUrl}
                  title={activeLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

                {focusMode && (
                  <div className="absolute top-4 right-4 z-50">
                    <Button 
                      variant="destructive" // Màu đỏ cho dễ nhìn
                      onClick={() => setFocusMode(false)}
                      className="shadow-lg"
                    >
                      <Minimize2 className="mr-2 h-4 w-4" /> Thoát Focus
                    </Button>
                  </div>
                )}
              </div>

              {/* Interaction Area (Tabs) - Visible below video in Regular Mode, or distinct area in Focus Mode if we implement split view (simplified here to always show tabs below in regular) */}
              {!focusMode && (
                <Card className="flex-1 border-none shadow-md">
                  <Tabs defaultValue="theory" className="w-full h-full flex flex-col">
                    <div className="px-6 pt-6">
                      <TabsList className="w-full justify-start h-12 p-1 bg-gray-100/50">
                        <TabsTrigger value="theory" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex-1 md:flex-none">
                          <FileText className="mr-2 h-4 w-4" /> Lý thuyết
                        </TabsTrigger>
                        <TabsTrigger value="note" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex-1 md:flex-none">
                          <Edit3 className="mr-2 h-4 w-4" /> Ghi chú
                        </TabsTrigger>
                        <TabsTrigger value="qna" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex-1 md:flex-none">
                          <HelpCircle className="mr-2 h-4 w-4" /> Hỏi đáp
                        </TabsTrigger>
                        <TabsTrigger value="quiz" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex-1 md:flex-none">
                          <FlaskConical className="mr-2 h-4 w-4" /> Bài tập
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <CardContent className="p-0 flex-1">
                      <TabsContent value="theory" className="p-6 m-0 animate-in fade-in-50">
                        <h3 className="text-xl font-bold mb-4 text-primary">{activeLesson.title}</h3>
                        <div
                          className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300"
                          dangerouslySetInnerHTML={{ __html: activeLesson.content }}
                        />
                      </TabsContent>
                      <TabsContent value="note" className="m-0 h-[400px]">
                        <NoteTab lessonId={activeLesson.id} />
                      </TabsContent>
                      <TabsContent value="qna" className="m-0 h-[500px]">
                        <QnATab />
                      </TabsContent>
                      <TabsContent value="quiz" className="m-0 min-h-[400px]">
                        <QuizTab />
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>
              )}
            </div>

            {/* Right Column: Lesson List (Hidden in Focus Mode) */}
            {!focusMode && (
              <div className="lg:col-span-1 h-full">
                <Card className="h-full flex flex-col border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
                  <CardHeader className="border-b bg-white/50 px-6 py-4">
                    <CardTitle className="text-lg">Danh sách bài học</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex-1 overflow-hidden">
                    <ScrollArea className="h-[calc(100vh-250px)]">
                      <div className="divide-y divide-gray-100">
                        {lessons.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => setActiveLesson(item)}
                            className={cn(
                              "p-4 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 items-start group relative",
                              activeLesson.id === item.id && "bg-blue-50/50 hover:bg-blue-50/80"
                            )}
                          >
                            {activeLesson.id === item.id && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                            )}
                            <div className="mt-1">
                              {item.isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <PlayCircle className={cn(
                                  "h-5 w-5",
                                  activeLesson.id === item.id ? "text-blue-600" : "text-gray-300 group-hover:text-gray-400"
                                )} />
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <h4 className={cn(
                                "text-sm font-medium leading-snug",
                                activeLesson.id === item.id ? "text-blue-700" : "text-gray-700"
                              )}>
                                {item.title}
                              </h4>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{item.duration}</span>
                                {activeLesson.id === item.id && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700 hover:bg-blue-100">
                                    Đang học
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Learning;