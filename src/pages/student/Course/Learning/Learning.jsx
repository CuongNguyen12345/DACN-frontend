import { useEffect, useRef, useState } from "react";
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
    Minimize2,
    ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import NoteTab from "./components/NoteTab";
import QnATab from "./components/QnATab";
import QuizTab from "./components/QuizTab";

const mockChapters = [
    {
        id: "c1",
        title: "Chương 1: Mệnh đề toán học. Tập hợp",
        lessons: [
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
                `,
            },
            {
                id: 2,
                title: "Bài 2: Các định luật cơ bản",
                duration: "20:45",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                isCompleted: false,
                content: "<p>Nội dung lý thuyết bài 2 đang được cập nhật...</p>",
            },
        ],
    },
    {
        id: "c2",
        title: "Chương 2: Bất phương trình và hệ bất phương trình bậc nhất hai ẩn",
        lessons: [
            {
                id: 3,
                title: "Bài 3: Bài tập vận dụng",
                duration: "45:00",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                isCompleted: false,
                content: "<p>Hướng dẫn giải bài tập chi tiết...</p>",
            },
            {
                id: 4,
                title: "Bài 4: Ôn tập chương 1",
                duration: "30:15",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                isCompleted: false,
                content: "<p>Tổng hợp kiến thức chương 1...</p>",
            },
        ],
    },
    {
        id: "c3",
        title: "Chương 3: Hàm số và đồ thị",
        lessons: [
            {
                id: 5,
                title: "Bài 5: Kiểm tra 15 phút",
                duration: "15:00",
                videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                isCompleted: false,
                content: "<p>Đề kiểm tra trắc nghiệm...</p>",
            },
        ],
    },
];

const mockLessons = mockChapters.flatMap(chapter => chapter.lessons);

const formatStudyTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
};

const Learning = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();

    const [isFavorite, setIsFavorite] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    const [studySeconds, setStudySeconds] = useState(0);
    const [isPageVisible, setIsPageVisible] = useState(!document.hidden);
    const [lessonStudyMap, setLessonStudyMap] = useState({});
    const [expandedChapters, setExpandedChapters] = useState(["c1"]);

    const activeLesson =
        mockLessons.find((item) => item.id === Number(lessonId)) || null;

    const activeLessonRef = useRef(activeLesson);

    const toggleChapter = (chapterId) => {
        setExpandedChapters((prev) =>
            prev.includes(chapterId)
                ? prev.filter((id) => id !== chapterId)
                : [...prev, chapterId]
        );
    };

    useEffect(() => {
        if (activeLesson) {
            setExpandedChapters((prev) => {
                const chapter = mockChapters.find((c) =>
                    c.lessons.some((l) => l.id === activeLesson.id)
                );
                if (chapter && !prev.includes(chapter.id)) {
                    return [...prev, chapter.id];
                }
                return prev;
            });
        }
    }, [activeLesson]);
    const studySecondsRef = useRef(studySeconds);

    useEffect(() => {
        activeLessonRef.current = activeLesson;
    }, [activeLesson]);

    useEffect(() => {
        studySecondsRef.current = studySeconds;
    }, [studySeconds]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPageVisible(!document.hidden);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        if (!activeLesson) return;

        const savedSeconds = lessonStudyMap[activeLesson.id] || 0;
        setStudySeconds(savedSeconds);
    }, [lessonId]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isPageVisible && activeLesson) {
                setStudySeconds((prev) => prev + 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPageVisible, activeLesson]);

    useEffect(() => {
        const handleBeforeUnload = () => {
            const currentLesson = activeLessonRef.current;
            const currentSeconds = studySecondsRef.current;

            if (!currentLesson) return;

            console.log("Lưu tiến độ học trước khi rời trang:", {
                lessonId: currentLesson.id,
                watchedSeconds: currentSeconds,
            });
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const handleLessonChange = (lesson) => {
        if (activeLesson) {
            setLessonStudyMap((prev) => ({
                ...prev,
                [activeLesson.id]: studySeconds,
            }));
        }

        navigate(`/course/learning/${lesson.id}`);
    };

    if (!activeLesson) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md shadow-md">
                    <CardContent className="py-10 text-center">
                        <h2 className="text-xl font-semibold mb-2">Không tìm thấy bài học</h2>
                        <p className="text-muted-foreground mb-4">
                            Bài học bạn chọn không tồn tại hoặc đã bị xóa.
                        </p>
                        <Button onClick={() => navigate("/course/learning/1")}>
                            Về bài học đầu tiên
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isCompletedByTime = studySeconds >= 60;

    return (
        <TooltipProvider>
            <div
                className={cn(
                    "min-h-[calc(100vh-4rem)] bg-gray-50/50 flex flex-col",
                    focusMode && "fixed inset-0 z-[100] bg-background h-screen"
                )}
            >
                {!focusMode && (
                    <div className="bg-background border-b px-6 py-3 shadow-sm">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        onClick={() => navigate("/")}
                                        className="cursor-pointer flex items-center gap-1"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Trang chủ
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbSeparator />

                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        onClick={() => navigate("/course")}
                                        className="cursor-pointer flex items-center gap-1"
                                    >
                                        Khóa học
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbSeparator />

                                <BreadcrumbItem>
                                    <BreadcrumbPage>{activeLesson.title}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                )}

                <div
                    className={cn(
                        "flex-1 p-6 transition-all duration-300",
                        focusMode ? "p-0 h-full" : "container mx-auto max-w-[1600px]"
                    )}
                >
                    {!focusMode && (
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div className="space-y-2">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {activeLesson.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary">
                                        Đã học: {formatStudyTime(studySeconds)}
                                    </Badge>

                                    <Badge variant={isPageVisible ? "default" : "outline"}>
                                        {isPageVisible ? "Đang học" : "Tạm dừng do chuyển tab"}
                                    </Badge>

                                    {isCompletedByTime && (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                            Đủ điều kiện hoàn thành
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => setIsFavorite((prev) => !prev)}
                                            className={cn(
                                                isFavorite &&
                                                    "text-red-500 hover:text-red-600 border-red-200 bg-red-50"
                                            )}
                                        >
                                            <Heart
                                                className={cn("h-5 w-5", isFavorite && "fill-current")}
                                            />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{isFavorite ? "Bỏ yêu thích" : "Yêu thích"}</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline">
                                            <Download className="mr-2 h-4 w-4" />
                                            Tải tài liệu
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
                                            onClick={() => setFocusMode((prev) => !prev)}
                                        >
                                            {focusMode ? (
                                                <Minimize2 className="mr-2 h-4 w-4" />
                                            ) : (
                                                <Maximize2 className="mr-2 h-4 w-4" />
                                            )}
                                            {focusMode ? "Thoát Focus" : "Focus Mode"}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            {focusMode
                                                ? "Thoát chế độ tập trung"
                                                : "Chế độ tập trung"}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    )}

                    <div
                        className={cn(
                            "grid gap-6 h-full",
                            focusMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
                        )}
                    >
                        <div
                            className={cn(
                                "flex flex-col gap-6",
                                focusMode ? "col-span-1 h-full" : "lg:col-span-2"
                            )}
                        >
                            <div
                                className={cn(
                                    "bg-black relative rounded-xl overflow-hidden shadow-lg ring-1 ring-gray-900/5",
                                    focusMode
                                        ? "h-full flex items-center justify-center rounded-none"
                                        : "aspect-video"
                                )}
                            >
                                <iframe
                                    key={activeLesson.id}
                                    className="w-full h-full absolute inset-0"
                                    src={activeLesson.videoUrl}
                                    title={activeLesson.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />

                                {focusMode && (
                                    <div className="absolute top-4 right-4 z-50">
                                        <Button
                                            variant="destructive"
                                            onClick={() => setFocusMode(false)}
                                            className="shadow-lg"
                                        >
                                            <Minimize2 className="mr-2 h-4 w-4" />
                                            Thoát Focus
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {!focusMode && (
                                <Card className="flex-1 border-none shadow-md">
                                    <Tabs defaultValue="theory" className="w-full h-full flex flex-col">
                                        <div className="px-6 pt-6">
                                            <TabsList className="w-full justify-start h-12 p-1 bg-gray-100/50">
                                                <TabsTrigger value="theory" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex-1 md:flex-none">
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    Lý thuyết
                                                </TabsTrigger>

                                                <TabsTrigger value="note" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex-1 md:flex-none">
                                                    <Edit3 className="mr-2 h-4 w-4" />
                                                    Ghi chú
                                                </TabsTrigger>

                                                <TabsTrigger value="qna" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex-1 md:flex-none">
                                                    <HelpCircle className="mr-2 h-4 w-4" />
                                                    Hỏi đáp
                                                </TabsTrigger>

                                                <TabsTrigger value="quiz" className="data-[state=active]:bg-white data-[state=active]:shadow-sm flex-1 md:flex-none">
                                                    <FlaskConical className="mr-2 h-4 w-4" />
                                                    Bài tập
                                                </TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <CardContent className="p-0 flex-1">
                                            <TabsContent value="theory" className="p-6 m-0 animate-in fade-in-50">
                                                <h3 className="text-xl font-bold mb-4 text-primary">
                                                    {activeLesson.title}
                                                </h3>
                                                <div
                                                    className="prose prose-sm max-w-none text-gray-600 dark:text-gray-300"
                                                    dangerouslySetInnerHTML={{ __html: activeLesson.content }}
                                                />
                                            </TabsContent>

                                            <TabsContent value="note" className="m-0 h-[400px]">
                                                <NoteTab lessonId={activeLesson.id} />
                                            </TabsContent>

                                            <TabsContent value="qna" className="m-0 h-[500px]">
                                                <QnATab lessonId={activeLesson.id} />
                                            </TabsContent>

                                            <TabsContent value="quiz" className="m-0 min-h-[400px]">
                                                <QuizTab lessonId={activeLesson.id} />
                                            </TabsContent>
                                        </CardContent>
                                    </Tabs>
                                </Card>
                            )}
                        </div>

                        {!focusMode && (
                            <div className="lg:col-span-1 h-full">
                                <Card className="h-full flex flex-col border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
                                    <CardHeader className="border-b bg-white/50 px-6 py-4">
                                        <CardTitle className="text-lg">Danh sách bài học</CardTitle>
                                    </CardHeader>

                                    <CardContent className="p-0 flex-1 overflow-hidden">
                                        <ScrollArea className="h-[calc(100vh-250px)]">
                                            <div className="flex flex-col border-b border-gray-100">
                                                {mockChapters.map((chapter) => {
                                                    const isExpanded = expandedChapters.includes(chapter.id);
                                                    const completedLessons = chapter.lessons.filter(l => l.isCompleted).length;
                                                    return (
                                                        <div key={chapter.id} className="border-t border-gray-100">
                                                            <div 
                                                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors bg-gray-50/50 group"
                                                                onClick={() => toggleChapter(chapter.id)}
                                                            >
                                                                <div className="flex flex-col">
                                                                    <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-700 transition-colors">
                                                                        {chapter.title}
                                                                    </h3>
                                                                    <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                                        {completedLessons}/{chapter.lessons.length} bài học
                                                                    </span>
                                                                </div>
                                                                <ChevronDown className={cn("h-5 w-5 text-gray-400 transition-transform duration-200", isExpanded && "rotate-180")} />
                                                            </div>
                                                            
                                                            {isExpanded && (
                                                                <div className="flex flex-col divide-y divide-gray-50 bg-white">
                                                                    {chapter.lessons.map((item) => (
                                                                        <div
                                                                            key={item.id}
                                                                            onClick={() => handleLessonChange(item)}
                                                                            className={cn(
                                                                                "p-4 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 items-start group relative pl-5",
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
                                                                                    <PlayCircle
                                                                                        className={cn(
                                                                                            "h-5 w-5",
                                                                                            activeLesson.id === item.id
                                                                                                ? "text-blue-600"
                                                                                                : "text-gray-300 group-hover:text-gray-400"
                                                                                        )}
                                                                                    />
                                                                                )}
                                                                            </div>

                                                                            <div className="flex-1 space-y-1">
                                                                                <h4 className={cn(
                                                                                        "text-sm font-medium leading-snug",
                                                                                        activeLesson.id === item.id ? "text-blue-700" : "text-gray-700"
                                                                                    )}
                                                                                >
                                                                                    {item.title}
                                                                                </h4>
                                                                                <div className="flex items-center justify-between">
                                                                                    <span className="text-xs text-muted-foreground">
                                                                                        {item.duration}
                                                                                    </span>
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                                                            {formatStudyTime(lessonStudyMap[item.id] || 0)}
                                                                                        </Badge>
                                                                                        {activeLesson.id === item.id && (
                                                                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700 hover:bg-blue-100">
                                                                                                Đang học
                                                                                            </Badge>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
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