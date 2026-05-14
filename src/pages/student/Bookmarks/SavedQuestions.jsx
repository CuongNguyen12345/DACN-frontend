import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Clock, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  formatSavedLessonWatchTime,
  normalizeSavedLessons,
  paginateSavedLessons,
} from "./savedLessonsView";

const ITEMS_PER_PAGE = 5;

const formatSavedDate = (value) => {
  if (!value) return "Vừa lưu";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Vừa lưu";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const SavedLessons = () => {
  const navigate = useNavigate();
  const [rawLessons, setRawLessons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    let shouldIgnore = false;

    setLoading(true);
    api
      .get("/api/learning/bookmarks")
      .then((res) => {
        if (!shouldIgnore) {
          setRawLessons(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch(() => {
        if (!shouldIgnore) {
          setRawLessons([]);
          toast.error("Không thể tải bài học đã lưu.");
        }
      })
      .finally(() => {
        if (!shouldIgnore) {
          setLoading(false);
        }
      });

    return () => {
      shouldIgnore = true;
    };
  }, []);

  const savedLessons = useMemo(() => normalizeSavedLessons(rawLessons), [rawLessons]);
  const pageData = useMemo(
    () => paginateSavedLessons(savedLessons, currentPage, ITEMS_PER_PAGE),
    [currentPage, savedLessons],
  );

  useEffect(() => {
    if (currentPage !== pageData.currentPage) {
      setCurrentPage(pageData.currentPage);
    }
  }, [currentPage, pageData.currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pageData.totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRemove = async (lessonId) => {
    setRemovingId(lessonId);
    try {
      await api.delete(`/api/learning/bookmarks/${lessonId}`);
      setRawLessons((prev) => prev.filter((lesson) => Number(lesson.id) !== Number(lessonId)));
      toast.success("Đã bỏ lưu bài học.");
    } catch {
      toast.error("Không thể bỏ lưu bài học. Vui lòng thử lại.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Bài học đã lưu của bạn</h3>
        <Badge variant="outline">{savedLessons.length} bài học</Badge>
      </div>

      {loading ? (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-8 flex items-center justify-center gap-3 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Đang tải bài học đã lưu...
          </CardContent>
        </Card>
      ) : null}

      {!loading && pageData.items.length === 0 ? (
        <Card className="border-dashed border-slate-300 shadow-none">
          <CardContent className="p-10 text-center text-slate-500">
            <BookOpen className="mx-auto mb-3 h-9 w-9 text-slate-300" />
            Bạn chưa lưu bài học nào.
          </CardContent>
        </Card>
      ) : null}

      {!loading && pageData.items.length > 0 ? (
        <div className="space-y-4">
          {pageData.items.map((lesson) => (
            <Card key={lesson.id} className="border-slate-200 shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {lesson.subjectBadge ? (
                        <Badge className="border-none bg-indigo-100 text-indigo-700">
                          {lesson.subjectBadge}
                        </Badge>
                      ) : null}
                      {lesson.chapterName ? (
                        <span className="text-xs font-medium text-slate-500">{lesson.chapterName}</span>
                      ) : null}
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-slate-900">{lesson.title}</h4>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span>Đã lưu: {formatSavedDate(lesson.bookmarkedAt)}</span>
                        {lesson.lastWatchedTime > 0 ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Đã xem {formatSavedLessonWatchTime(lesson.lastWatchedTime)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-slate-400 hover:text-red-500"
                    disabled={removingId === lesson.id}
                    onClick={() => handleRemove(lesson.id)}
                    aria-label="Bỏ lưu bài học"
                  >
                    {removingId === lesson.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="mt-5">
                  <Button onClick={() => navigate(lesson.href)} className="rounded-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Học tiếp
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {!loading && pageData.totalPages > 1 ? (
        <Pagination className="justify-end mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(pageData.currentPage - 1)}
                className={pageData.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {Array.from({ length: pageData.totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  isActive={pageData.currentPage === pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className="cursor-pointer"
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(pageData.currentPage + 1)}
                className={
                  pageData.currentPage === pageData.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
};

export default SavedLessons;
