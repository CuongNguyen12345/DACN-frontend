import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Flame } from "lucide-react";

import api from "@/services/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

dayjs.locale("vi");

const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const getUserStreak = (user) => user?.currentStreak ?? user?.streak ?? user?.streakhientai ?? 0;

const normalizeDates = (dates = []) =>
    dates
        .map((date) => {
            if (!date) return null;
            if (typeof date === "string") return dayjs(date).format("YYYY-MM-DD");
            return dayjs(date).format("YYYY-MM-DD");
        })
        .filter(Boolean);

const StudyCalendar = ({ user }) => {
    const [visibleMonth, setVisibleMonth] = useState(dayjs().startOf("month"));
    const [activity, setActivity] = useState({
        currentStreak: getUserStreak(user),
        totalStudyDays: 0,
        studyDates: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchStudyActivity = async () => {
            try {
                const response = await api.get("/api/learning/progress/study-activity");
                const data = response.data?.result || response.data || {};

                if (isMounted) {
                    const studyDates = normalizeDates(data.studyDates || data.studiedDates || user?.studyDates || []);
                    setActivity({
                        currentStreak: data.currentStreak ?? getUserStreak(user),
                        totalStudyDays: data.totalStudyDays ?? studyDates.length,
                        studyDates,
                    });
                }
            } catch (error) {
                console.error("Khong the tai lich hoc tap:", error);
                if (isMounted) {
                    const studyDates = normalizeDates(user?.studyDates || user?.studiedDates || []);
                    setActivity({
                        currentStreak: getUserStreak(user),
                        totalStudyDays: studyDates.length,
                        studyDates,
                    });
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchStudyActivity();

        return () => {
            isMounted = false;
        };
    }, [user]);

    const studyDateSet = useMemo(() => new Set(activity.studyDates), [activity.studyDates]);

    const calendarDays = useMemo(() => {
        const firstDay = visibleMonth.startOf("month");
        const emptyDays = (firstDay.day() + 6) % 7;
        const daysInMonth = visibleMonth.daysInMonth();

        return [
            ...Array.from({ length: emptyDays }, (_, index) => ({ key: `empty-${index}`, day: null })),
            ...Array.from({ length: daysInMonth }, (_, index) => {
                const date = visibleMonth.date(index + 1);
                const dateKey = date.format("YYYY-MM-DD");
                return {
                    key: dateKey,
                    day: index + 1,
                    dateKey,
                    isToday: date.isSame(dayjs(), "day"),
                    isStudied: studyDateSet.has(dateKey),
                };
            }),
        ];
    }, [studyDateSet, visibleMonth]);

    const studiedDaysInMonth = useMemo(
        () => activity.studyDates.filter((date) => dayjs(date).isSame(visibleMonth, "month")).length,
        [activity.studyDates, visibleMonth]
    );

    return (
        <Card className="shadow-sm">
            <CardHeader className="flex flex-col gap-4 pb-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-blue-600" />
                        Lịch học tập
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {visibleMonth.format("[Tháng] M, YYYY")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setVisibleMonth((month) => month.subtract(1, "month"))}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Tháng trước</span>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setVisibleMonth(dayjs().startOf("month"))}
                    >
                        <CalendarDays className="h-4 w-4" />
                        <span className="sr-only">Tháng hiện tại</span>
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setVisibleMonth((month) => month.add(1, "month"))}
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Tháng sau</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-orange-100 bg-orange-50 p-4">
                        <div className="flex items-center gap-2 text-orange-600">
                            <Flame className="h-4 w-4 fill-current" />
                            <span className="text-xs font-semibold uppercase">Streak</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-gray-900">{activity.currentStreak} ngày</p>
                    </div>
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                        <div className="flex items-center gap-2 text-blue-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase">Tháng này</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-gray-900">{studiedDaysInMonth} ngày</p>
                    </div>
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                        <div className="flex items-center gap-2 text-emerald-600">
                            <CalendarDays className="h-4 w-4" />
                            <span className="text-xs font-semibold uppercase">Tổng ngày</span>
                        </div>
                        <p className="mt-2 text-2xl font-bold text-gray-900">{activity.totalStudyDays} ngày</p>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-100 bg-white p-3">
                    <div className="grid grid-cols-7 gap-2">
                        {weekDays.map((day) => (
                            <div key={day} className="text-center text-xs font-semibold text-muted-foreground">
                                {day}
                            </div>
                        ))}
                        {calendarDays.map((item) => (
                            <div key={item.key} className="aspect-square">
                                {item.day && (
                                    <div
                                        className={cn(
                                            "relative flex h-full min-h-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors",
                                            item.isStudied
                                                ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                                                : "border-gray-100 bg-gray-50 text-gray-500",
                                            item.isToday && "ring-2 ring-blue-500 ring-offset-2"
                                        )}
                                    >
                                        {item.day}
                                        {item.isStudied && (
                                            <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {isLoading && <p className="text-center text-sm text-muted-foreground">Đang tải lịch học...</p>}
            </CardContent>
        </Card>
    );
};

export default StudyCalendar;
