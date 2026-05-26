import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { hasAuthToken } from "@/services/authToken";
import { toast } from "sonner";
import {
    PlayCircle,
    CheckCircle2,
    ArrowLeft,
    FileText,
    HelpCircle,
    Bookmark,
    Download,
    Edit3,
    FlaskConical,
    Maximize2,
    Minimize2,
    ChevronDown,
    Lock,
    Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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


const formatVideoDuration = (seconds) => {
    if (!seconds || seconds <= 0) return null;
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
        return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const extractYoutubeId = (url) => {
    if (!url) return null;
    // Handle embed URLs: https://www.youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];
    // Handle watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
    const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];
    // Handle short URLs: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];
    // Might be just the video ID itself
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    return null;
};

const normalizeChapterTitle = (value) =>
    String(value || "")
        .toLowerCase()
        .replace(/^chương\s*\d+\s*[:.-]?\s*/, "")
        .replace("toán học", "")
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();

const getChapterTitleTokens = (value) =>
    normalizeChapterTitle(value)
        .split(/\s+/)
        .filter((token) => token.length >= 2);

const getChapterMatchScore = (chapterTitle, topicTitle) => {
    const chapterTokens = new Set(getChapterTitleTokens(chapterTitle));
    const topicTokens = getChapterTitleTokens(topicTitle);
    if (chapterTokens.size === 0 || topicTokens.length === 0) return 0;

    const matchedCount = topicTokens.filter((token) => chapterTokens.has(token)).length;
    return matchedCount / topicTokens.length;
};

const Learning = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();

    const [chapters, setChapters] = useState([]);
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    const [videoDurations, setVideoDurations] = useState({});
    const [expandedChapters, setExpandedChapters] = useState([]);
    const ytPlayersRef = useRef({});
    const ytContainerRef = useRef(null);
    const mainPlayerRef = useRef(null);
    const saveTimeIntervalRef = useRef(null);
    const lastSavedTimeRef = useRef(0);
    const completedRequestKeysRef = useRef(new Set());
    const mainPlayerContainerId = 'yt-main-player';
    const [completedLessons, setCompletedLessons] = useState([]);
    const [learningTab, setLearningTab] = useState("theory");
    const [courseQuizzes, setCourseQuizzes] = useState([]);
    const [quizzesLoading, setQuizzesLoading] = useState(false);
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [sidebarTab, setSidebarTab] = useState("lessons");

    const getCurrentVideoTime = useCallback(() => {
        const player = mainPlayerRef.current;
        if (!player || typeof player.getCurrentTime !== "function") return 0;

        const currentTime = Number(player.getCurrentTime());
        return Number.isFinite(currentTime) ? Math.floor(currentTime) : 0;
    }, []);
    const activeLessonId = activeLesson?.id;
    const activeLessonVideoUrl = activeLesson?.videoUrl;

    useEffect(() => {
        if (!activeLessonId) {
            setIsBookmarked(false);
            return undefined;
        }

        if (!hasAuthToken()) {
            setIsBookmarked(false);
            return undefined;
        }

        let shouldIgnore = false;
        setBookmarkLoading(true);

        api.get(`/api/learning/bookmarks/${activeLessonId}`)
            .then((res) => {
                if (!shouldIgnore) {
                    setIsBookmarked(Boolean(res.data?.bookmarked));
                }
            })
            .catch(() => {
                if (!shouldIgnore) {
                    setIsBookmarked(false);
                }
            })
            .finally(() => {
                if (!shouldIgnore) {
                    setBookmarkLoading(false);
                }
            });

        return () => {
            shouldIgnore = true;
        };
    }, [activeLessonId]);

    const toggleLessonBookmark = useCallback(async () => {
        if (!activeLessonId) return;

        if (!hasAuthToken()) {
            toast.error("Bạn cần đăng nhập để lưu bài học.");
            navigate("/login");
            return;
        }

        const nextBookmarked = !isBookmarked;
        setBookmarkLoading(true);
        setIsBookmarked(nextBookmarked);

        try {
            const res = nextBookmarked
                ? await api.post(`/api/learning/bookmarks/${activeLessonId}`)
                : await api.delete(`/api/learning/bookmarks/${activeLessonId}`);

            setIsBookmarked(Boolean(res.data?.bookmarked));
            toast.success(nextBookmarked ? "Đã lưu bài học." : "Đã bỏ lưu bài học.");
        } catch {
            setIsBookmarked(!nextBookmarked);
            toast.error("Không thể cập nhật bookmark. Vui lòng thử lại.");
        } finally {
            setBookmarkLoading(false);
        }
    }, [activeLessonId, isBookmarked, navigate]);

    // Hàm đánh dấu bài học hoàn thành — ghi lên server
    const markLessonCompleted = useCallback((id) => {
        const todayKey = new Date().toISOString().slice(0, 10);
        const requestKey = `${id}-${todayKey}`;
        if (completedRequestKeysRef.current.has(requestKey)) return;
        completedRequestKeysRef.current.add(requestKey);

        setCompletedLessons(prev => {
            if (prev.includes(id)) return prev;
            return [...prev, id];
        });
        if (hasAuthToken()) {
            api.post(`/api/learning/progress/complete?lessonId=${id}`).catch(err =>
                console.error("Không thể lưu tiến độ:", err)
            );
        }
    }, []);

    // Fetch chapters and active lesson data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch lesson details
                const lessonRes = await api.get(`/api/learning/lesson/${lessonId}`);
                const lessonData = lessonRes.data;

                // Map API response to expected format
                setActiveLesson({
                    id: lessonData.id,
                    title: lessonData.lessonName,
                    subjectId: lessonData.subjectId,
                    subjectName: lessonData.subjectName,
                    gradeLevel: lessonData.gradeLevel,
                    videoUrl: lessonData.videoUrl?.includes('embed')
                        ? lessonData.videoUrl
                        : `https://www.youtube.com/embed/${lessonData.videoUrl}`,
                    content: lessonData.content || "<p>Nội dung đang được cập nhật...</p>",
                    pdfUrl: lessonData.pdfUrl
                });

                // Fetch chapters for the current course
                const chaptersRes = await api.get(`/api/learning/course/content?lessonId=${lessonId}`);
                const transformedChapters = chaptersRes.data.map(chap => ({
                    id: `c${chap.id}`,
                    rawId: chap.id,
                    title: chap.chapterName,
                    lessons: chap.lessons.map(l => ({
                        id: l.id,
                        title: l.lessonName,
                        duration: "0:00", // Cần bổ sung thời lượng nếu có từ DB
                        videoUrl: l.videoUrl,
                    }))
                }));
                setChapters(transformedChapters);

                // Tự động mở chương chứa bài học hiện tại
                const currentChapter = transformedChapters.find(c =>
                    c.lessons.some(l => l.id === Number(lessonId))
                );
                if (currentChapter) {
                    setExpandedChapters(prev => Array.from(new Set([...prev, currentChapter.id])));
                }

            } catch (error) {
                console.error("Lỗi khi tải dữ liệu học tập:", error);
            } finally {
                setLoading(false);
            }
        };

        if (lessonId) {
            fetchData();
        }
    }, [lessonId]);

    // Tải tiến độ học tập từ server khi chapters load
    useEffect(() => {
        if (chapters.length === 0) return;
        if (!hasAuthToken()) return;

        const allLessonIds = chapters.flatMap(c => c.lessons.map(l => l.id));
        if (allLessonIds.length === 0) return;

        api.get(`/api/learning/progress?lessonIds=${allLessonIds.join(",")}`)
            .then(res => setCompletedLessons(res.data))
            .catch(err => console.error("Không thể tải tiến độ:", err));
    }, [chapters]);

    const allLessonIds = useMemo(
        () => chapters.flatMap((chapter) => chapter.lessons.map((lesson) => lesson.id)),
        [chapters],
    );

    useEffect(() => {
        if (!lessonId || allLessonIds.length === 0) {
            setCourseQuizzes([]);
            return undefined;
        }

        let shouldIgnore = false;
        setQuizzesLoading(true);

        api.get(`/api/learning/quizzes/course?lessonId=${lessonId}`)
            .then((res) => {
                if (!shouldIgnore) {
                    setCourseQuizzes(Array.isArray(res.data) ? res.data : []);
                }
            })
            .catch((err) => {
                console.error("Không thể tải danh sách bài tập:", err);
                if (!shouldIgnore) {
                    setCourseQuizzes([]);
                }
            })
            .finally(() => {
                if (!shouldIgnore) {
                    setQuizzesLoading(false);
                }
            });

        return () => {
            shouldIgnore = true;
        };
    }, [allLessonIds, lessonId]);

    // Tạo/cập nhật YouTube Player chính cho bài học hiện tại
    useEffect(() => {
        if (!activeLessonId || !activeLessonVideoUrl) return;

        const videoId = extractYoutubeId(activeLessonVideoUrl);
        if (!videoId) return;

        const loadYTApi = () => {
            return new Promise((resolve) => {
                if (window.YT && window.YT.Player) {
                    resolve();
                    return;
                }
                if (!document.getElementById('yt-iframe-api')) {
                    const tag = document.createElement('script');
                    tag.id = 'yt-iframe-api';
                    tag.src = 'https://www.youtube.com/iframe_api';
                    document.head.appendChild(tag);
                }
                const prev = window.onYouTubeIframeAPIReady;
                window.onYouTubeIframeAPIReady = () => {
                    prev?.();
                    resolve();
                };
            });
        };

        let cancelled = false;

        loadYTApi().then(async () => {
            if (cancelled) return;

            // Lấy thời gian xem trước đó từ server
            let startSeconds = 0;
            try {
                if (hasAuthToken()) {
                    const res = await api.get(`/api/learning/progress/time?lessonId=${activeLessonId}`);
                    startSeconds = res.data || 0;
                }
            } catch (err) {
                console.error("Lỗi lấy thời gian xem:", err);
            }

            if (cancelled) return;

            // Hủy player cũ nếu có
            if (mainPlayerRef.current) {
                try { mainPlayerRef.current.destroy(); } catch { /* ignore */ }
                mainPlayerRef.current = null;
            }

            // Đảm bảo container tồn tại
            const container = document.getElementById(mainPlayerContainerId);
            if (!container) return;

            mainPlayerRef.current = new window.YT.Player(mainPlayerContainerId, {
                videoId,
                width: '100%',
                height: '100%',
                playerVars: {
                    autoplay: 0,
                    modestbranding: 1,
                    rel: 0,
                    start: Math.floor(startSeconds),
                },
                events: {
                    onStateChange: (event) => {
                        // YT.PlayerState.ENDED = 0
                        if (event.data === 0) {
                            markLessonCompleted(activeLessonId);
                        }
                    },
                },
            });

            // Thiết lập interval lưu thời gian xem mỗi 10 giây
            if (saveTimeIntervalRef.current) clearInterval(saveTimeIntervalRef.current);
            saveTimeIntervalRef.current = setInterval(() => {
                if (mainPlayerRef.current && mainPlayerRef.current.getCurrentTime) {
                    const currentTime = Math.floor(mainPlayerRef.current.getCurrentTime());
                    const duration = mainPlayerRef.current.getDuration?.() || 0;

                    if (duration > 0 && currentTime / duration >= 0.9) {
                        markLessonCompleted(activeLessonId);
                    }

                    if (currentTime > 0 && Math.abs(currentTime - lastSavedTimeRef.current) > 5) {
                         if (hasAuthToken()) {
                             api.post(`/api/learning/progress/time?lessonId=${activeLessonId}&time=${currentTime}`)
                                .then(() => { lastSavedTimeRef.current = currentTime; })
                                .catch(() => {});
                         }
                    }
                }
            }, 10000);
        });

        return () => {
            cancelled = true;
            if (saveTimeIntervalRef.current) clearInterval(saveTimeIntervalRef.current);
            
            // Cố gắng lưu lần cuối khi unmount/đổi bài
            if (mainPlayerRef.current && mainPlayerRef.current.getCurrentTime) {
                const currentTime = Math.floor(mainPlayerRef.current.getCurrentTime());
                if (hasAuthToken() && currentTime > 0) {
                    api.post(`/api/learning/progress/time?lessonId=${activeLessonId}&time=${currentTime}`).catch(() => {});
                }
            }
        };
    }, [activeLessonId, activeLessonVideoUrl, markLessonCompleted]);

    // Fetch video durations via YouTube IFrame API
    useEffect(() => {
        if (chapters.length === 0) return;

        const allLessons = chapters.flatMap(c => c.lessons);
        const lessonsNeedDuration = allLessons.filter(
            l => l.videoUrl && !videoDurations[l.id]
        );
        if (lessonsNeedDuration.length === 0) return;

        const loadYTApi = () => {
            return new Promise((resolve) => {
                if (window.YT && window.YT.Player) {
                    resolve();
                    return;
                }
                if (!document.getElementById('yt-iframe-api')) {
                    const tag = document.createElement('script');
                    tag.id = 'yt-iframe-api';
                    tag.src = 'https://www.youtube.com/iframe_api';
                    document.head.appendChild(tag);
                }
                const prev = window.onYouTubeIframeAPIReady;
                window.onYouTubeIframeAPIReady = () => {
                    prev?.();
                    resolve();
                };
            });
        };

        let cancelled = false;

        loadYTApi().then(() => {
            if (cancelled) return;

            // Create a container for hidden players if not exists
            if (!ytContainerRef.current) {
                const container = document.createElement('div');
                container.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
                document.body.appendChild(container);
                ytContainerRef.current = container;
            }

            lessonsNeedDuration.forEach((lesson) => {
                const videoId = extractYoutubeId(lesson.videoUrl);
                if (!videoId || ytPlayersRef.current[lesson.id]) return;

                const div = document.createElement('div');
                div.id = `yt-duration-${lesson.id}`;
                ytContainerRef.current.appendChild(div);

                ytPlayersRef.current[lesson.id] = new window.YT.Player(div.id, {
                    videoId,
                    width: 1,
                    height: 1,
                    playerVars: { autoplay: 0, controls: 0 },
                    events: {
                        onReady: (event) => {
                            const dur = event.target.getDuration();
                            if (dur > 0) {
                                setVideoDurations(prev => ({ ...prev, [lesson.id]: dur }));
                            }
                            // Clean up this player
                            setTimeout(() => {
                                event.target.destroy();
                                delete ytPlayersRef.current[lesson.id];
                            }, 100);
                        },
                    },
                });
            });
        });

        return () => {
            cancelled = true;
        };
    }, [chapters, videoDurations]);

    // Cleanup YT container on unmount
    useEffect(() => {
        return () => {
            Object.values(ytPlayersRef.current).forEach(p => {
                try { p.destroy(); } catch { /* ignore */ }
            });
            ytPlayersRef.current = {};
            if (ytContainerRef.current) {
                ytContainerRef.current.remove();
                ytContainerRef.current = null;
            }
        };
    }, []);

    const toggleChapter = (chapterId) => {
        setExpandedChapters((prev) =>
            prev.includes(chapterId)
                ? prev.filter((id) => id !== chapterId)
                : [...prev, chapterId]
        );
    };

    // Cleanup main player on unmount
    useEffect(() => {
        return () => {
            if (mainPlayerRef.current) {
                try { mainPlayerRef.current.destroy(); } catch { /* ignore */ }
                mainPlayerRef.current = null;
            }
        };
    }, []);

    const chaptersWithLock = useMemo(() => {
        let previousCompleted = true; // First lesson is unlocked
        return chapters.map(chapter => ({
            ...chapter,
            lessons: chapter.lessons.map(lesson => {
                const isCompleted = completedLessons.includes(lesson.id);
                const isLocked = !previousCompleted;
                previousCompleted = isCompleted;
                
                return {
                    ...lesson,
                    isCompleted,
                    isLocked
                };
            })
        }));
    }, [chapters, completedLessons]);

    const quizzesByChapterId = useMemo(() => {
        return courseQuizzes.reduce((grouped, quiz) => {
            const chapterId = quiz.chapterId ? `c${quiz.chapterId}` : null;
            const matchedChapter = chapterId
                ? null
                : chaptersWithLock.find((chapter) => {
                    const chapterTitle = normalizeChapterTitle(chapter.title);
                    const topicTitle = normalizeChapterTitle(quiz.topicName || quiz.chapterTitle);
                    return chapterTitle === topicTitle ||
                        chapterTitle.includes(topicTitle) ||
                        topicTitle.includes(chapterTitle) ||
                        getChapterMatchScore(chapter.title, quiz.topicName || quiz.chapterTitle) >= 0.5;
                });
            const id = chapterId || matchedChapter?.id;
            if (!id) return grouped;

            if (!grouped[id]) grouped[id] = [];
            grouped[id].push(quiz);
            return grouped;
        }, {});
    }, [chaptersWithLock, courseQuizzes]);

    const chaptersWithExercises = useMemo(() => {
        return chaptersWithLock.map((chapter) => ({
            ...chapter,
            exercises: (quizzesByChapterId[chapter.id] || []).map((quiz) => ({
                ...quiz,
                chapter,
                lesson: quiz.lessonId
                    ? chapter.lessons.find((lesson) => Number(lesson.id) === Number(quiz.lessonId))
                    : null,
                isLocked: chapter.lessons.every((lesson) => lesson.isLocked),
            })),
        }));
    }, [chaptersWithLock, quizzesByChapterId]);

    const activeChapter = useMemo(
        () =>
            chaptersWithExercises.find((chapter) =>
                chapter.lessons.some((lesson) => Number(lesson.id) === Number(activeLesson?.id)),
            ),
        [activeLesson?.id, chaptersWithExercises],
    );

    const handleLessonChange = (lesson) => {
        setLearningTab("theory");
        setSelectedQuizId(null);
        navigate(`/course/learning/${lesson.id}`);
    };

    const handleExerciseChange = (exercise) => {
        if (exercise.isLocked) return;

        setSelectedQuizId(exercise.id);
        setLearningTab("quiz");
        const targetLessonId = exercise.lessonId || exercise.chapter?.lessons?.[0]?.id;
        if (targetLessonId && Number(activeLesson?.id) !== Number(targetLessonId)) {
            navigate(`/course/learning/${targetLessonId}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="text-slate-500 font-medium font-serif italic text-lg animate-pulse">Đang tải nội dung học tập...</p>
            </div>
        );
    }

    if (!activeLesson) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md shadow-md">
                    <CardContent className="py-10 text-center">
                        <h2 className="text-xl font-semibold mb-2">Không tìm thấy bài học</h2>
                        <p className="text-muted-foreground mb-4">
                            Bài học bạn chọn không tồn tại hoặc đã bị xóa.
                        </p>
                        <Button onClick={() => navigate("/course")}>
                            Quay lại danh sách khóa học
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

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


                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
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
                                        : "aspect-video",
                                    learningTab === "quiz" && !focusMode && "hidden"
                                )}
                            >
                                <div
                                    id={mainPlayerContainerId}
                                    key={activeLesson.id}
                                    className="w-full h-full absolute inset-0"
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

                            {!focusMode && learningTab !== "quiz" && (
                                <div className="flex justify-end">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant={isBookmarked ? "default" : "outline"}
                                                onClick={toggleLessonBookmark}
                                                disabled={bookmarkLoading}
                                                className={cn(
                                                    "gap-2",
                                                    isBookmarked && "bg-amber-500 text-white hover:bg-amber-600"
                                                )}
                                            >
                                                {bookmarkLoading ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
                                                )}
                                                {isBookmarked ? "Đã lưu bài học" : "Lưu bài học"}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{isBookmarked ? "Bỏ lưu bài học" : "Lưu bài học vào trang lịch sử"}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            )}

                            {!focusMode && (
                                <Card className={cn(
                                    "flex-1 border-none shadow-md",
                                    learningTab === "quiz" && "min-h-[calc(100vh-220px)]"
                                )}>
                                    <Tabs value={learningTab} onValueChange={setLearningTab} className="w-full h-full flex flex-col">
                                        {learningTab !== "quiz" && (
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
                                                </TabsList>
                                            </div>
                                        )}

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
                                                <NoteTab
                                                    key={activeLesson.id}
                                                    lessonId={activeLesson.id}
                                                    getCurrentTime={getCurrentVideoTime}
                                                />
                                            </TabsContent>

                                            <TabsContent value="qna" className="m-0 h-[500px]">
                                                <QnATab
                                                    lessonId={activeLesson.id}
                                                    subjectId={activeLesson.subjectId}
                                                    lessonName={activeLesson.title}
                                                />
                                            </TabsContent>

                                            <TabsContent value="quiz" className="m-0 min-h-[400px]">
                                                <QuizTab
                                                    lessonId={activeLesson.id}
                                                    quizzes={activeChapter?.exercises || []}
                                                    selectedQuizId={selectedQuizId}
                                                    onSelectQuiz={setSelectedQuizId}
                                                />
                                            </TabsContent>
                                        </CardContent>
                                    </Tabs>
                                </Card>
                            )}
                        </div>

                        {!focusMode && (
                            <div className="lg:col-span-1 h-full">
                                <Card className="h-full flex flex-col border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
                                    <Tabs
                                        value={sidebarTab}
                                        onValueChange={(value) => {
                                            setSidebarTab(value);
                                            if (value === "exercises") {
                                                setLearningTab("quiz");
                                            } else {
                                                setLearningTab("theory");
                                            }
                                        }}
                                        className="w-full h-full flex flex-col"
                                    >
                                        <div className="px-4 pt-4 border-b pb-4">
                                            <TabsList className="w-full grid grid-cols-2 p-1 bg-gray-100/50 rounded-lg">
                                                <TabsTrigger value="lessons" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2">
                                                    Bài học
                                                </TabsTrigger>
                                                <TabsTrigger value="exercises" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md py-2">
                                                    Bài tập
                                                </TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <CardContent className="p-0 flex-1 overflow-hidden">
                                            <TabsContent value="lessons" className="h-full m-0">
                                                <ScrollArea className="h-[calc(100vh-220px)]">
                                                    <div className="flex flex-col border-b border-gray-100">
                                                        {chaptersWithExercises.map((chapter) => {
                                                            const isExpanded = expandedChapters.includes(chapter.id);
                                                            const completedLessonsCount = chapter.lessons.filter(l => l.isCompleted).length;
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
                                                                                {completedLessonsCount}/{chapter.lessons.length} bài học
                                                                            </span>
                                                                        </div>
                                                                        <ChevronDown className={cn("h-5 w-5 text-gray-400 transition-transform duration-200", isExpanded && "rotate-180")} />
                                                                    </div>

                                                                    {isExpanded && (
                                                                        <div className="flex flex-col divide-y divide-gray-50 bg-white">
                                                                            {chapter.lessons.map((item) => (
                                                                                <div
                                                                                    key={item.id}
                                                                                    onClick={() => {
                                                                                        if (!item.isLocked) {
                                                                                            handleLessonChange(item);
                                                                                        }
                                                                                    }}
                                                                                    className={cn(
                                                                                        "p-4 flex gap-3 items-start relative pl-5 transition-colors",
                                                                                        activeLesson.id === item.id && "bg-blue-50/50 hover:bg-blue-50/80",
                                                                                        item.isLocked 
                                                                                            ? "opacity-60 cursor-not-allowed bg-gray-50/80" 
                                                                                            : "cursor-pointer hover:bg-gray-50 group"
                                                                                    )}
                                                                                >
                                                                                    {activeLesson.id === item.id && (
                                                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                                                                                    )}

                                                                                    <div className="mt-1">
                                                                                        {item.isLocked ? (
                                                                                            <Lock className="h-5 w-5 text-gray-400" />
                                                                                        ) : item.isCompleted ? (
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
                                                                                        {formatVideoDuration(videoDurations[item.id]) && (
                                                                                            <span className="text-xs text-muted-foreground">
                                                                                                {formatVideoDuration(videoDurations[item.id])}
                                                                                            </span>
                                                                                        )}
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
                                            </TabsContent>
                                            
                                            <TabsContent value="exercises" className="h-full m-0">
                                                <ScrollArea className="h-[calc(100vh-220px)]">
                                                    <div className="flex flex-col border-b border-gray-100">
                                                        {chaptersWithExercises.map((chapter) => {
                                                            const isExpanded = expandedChapters.includes(`ex_${chapter.id}`);
                                                            return (
                                                                <div key={`ex_${chapter.id}`} className="border-t border-gray-100">
                                                                    <div
                                                                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors bg-gray-50/50 group"
                                                                        onClick={() => {
                                                                            setExpandedChapters(prev => 
                                                                                prev.includes(`ex_${chapter.id}`)
                                                                                    ? prev.filter(id => id !== `ex_${chapter.id}`)
                                                                                    : [...prev, `ex_${chapter.id}`]
                                                                            )
                                                                        }}
                                                                    >
                                                                        <div className="flex flex-col">
                                                                            <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-700 transition-colors">
                                                                                {chapter.title}
                                                                            </h3>
                                                                            <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                                                {quizzesLoading ? "Đang tải..." : `${chapter.exercises.length} bài tập`}
                                                                            </span>
                                                                        </div>
                                                                        <ChevronDown className={cn("h-5 w-5 text-gray-400 transition-transform duration-200", isExpanded && "rotate-180")} />
                                                                    </div>

                                                                    {isExpanded && (
                                                                        <div className="flex flex-col divide-y divide-gray-50 bg-white">
                                                                            {quizzesLoading ? (
                                                                                <div className="px-5 py-6 text-sm text-slate-500">
                                                                                    Đang tải bài tập...
                                                                                </div>
                                                                            ) : null}
                                                                            {chapter.exercises.length === 0 && !quizzesLoading ? (
                                                                                <div className="px-5 py-6 text-sm text-slate-500">
                                                                                    Chưa có bài tập cho chương này.
                                                                                </div>
                                                                            ) : null}
                                                                            {chapter.exercises.map((item) => (
                                                                                <div
                                                                                    key={`ex_item_${item.id}`}
                                                                                    className={cn(
                                                                                        "p-4 flex gap-3 items-start relative pl-5 transition-colors",
                                                                                        Number(selectedQuizId) === Number(item.id) && "bg-blue-50/50 hover:bg-blue-50/80",
                                                                                        item.isLocked
                                                                                            ? "opacity-60 cursor-not-allowed bg-gray-50/80"
                                                                                            : "cursor-pointer hover:bg-gray-50 group"
                                                                                    )}
                                                                                    onClick={() => handleExerciseChange(item)}
                                                                                >
                                                                                    {Number(selectedQuizId) === Number(item.id) && (
                                                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                                                                                    )}

                                                                                    <div className="mt-1">
                                                                                        {item.isLocked ? (
                                                                                            <Lock className="h-5 w-5 text-gray-400" />
                                                                                        ) : (
                                                                                            <FlaskConical className={cn(
                                                                                                "h-5 w-5",
                                                                                                Number(selectedQuizId) === Number(item.id) ? "text-blue-600" : "text-gray-400 group-hover:text-gray-500"
                                                                                            )} />
                                                                                        )}
                                                                                    </div>

                                                                                    <div className="flex-1 space-y-1">
                                                                                        <h4 className={cn(
                                                                                            "text-sm font-medium leading-snug",
                                                                                            Number(selectedQuizId) === Number(item.id) ? "text-blue-700" : "text-gray-700"
                                                                                        )}>
                                                                                            {item.title}
                                                                                        </h4>
                                                                                        <span className="text-xs text-muted-foreground inline-flex items-center">
                                                                                            {item.lesson?.title ? `Bài học: ${item.lesson.title}` : item.topicName || "Bấm để làm bài"}
                                                                                        </span>
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
                                            </TabsContent>
                                        </CardContent>
                                    </Tabs>
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
