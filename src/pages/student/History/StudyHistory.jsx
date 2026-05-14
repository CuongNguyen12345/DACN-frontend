import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart3, Bookmark, History, Loader2, Search } from "lucide-react";

import api from "@/services/api";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SavedLessons from "../Bookmarks/SavedQuestions";
import {
  buildSubjectOptions,
  formatDurationSeconds,
  formatSubmittedAt,
  normalizeExamHistory,
  normalizeExamResultDetail,
} from "./examHistoryView";

const getScoreColor = (score) => {
  if (score >= 8) return "text-emerald-600";
  if (score >= 5) return "text-amber-600";
  return "text-rose-600";
};

const StudyHistory = ({ navigate }) => {
  const routerNavigate = useNavigate();
  const goTo = navigate || routerNavigate;
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [historyRecords, setHistoryRecords] = useState([]);
  const [allHistoryRecords, setAllHistoryRecords] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [reviewingId, setReviewingId] = useState(null);

  useEffect(() => {
    let shouldIgnore = false;

    api
      .get("/api/exam/history")
      .then((res) => {
        if (!shouldIgnore) {
          setAllHistoryRecords(normalizeExamHistory(res.data));
        }
      })
      .catch(() => {
        if (!shouldIgnore) {
          setAllHistoryRecords([]);
        }
      });

    return () => {
      shouldIgnore = true;
    };
  }, []);

  useEffect(() => {
    let shouldIgnore = false;
    setLoadingHistory(true);

    api
      .get("/api/exam/history", {
        params: {
          keyword: searchTerm.trim() || undefined,
          subject: subjectFilter === "all" ? undefined : subjectFilter,
        },
      })
      .then((res) => {
        if (!shouldIgnore) {
          setHistoryRecords(normalizeExamHistory(res.data));
        }
      })
      .catch(() => {
        if (!shouldIgnore) {
          setHistoryRecords([]);
        }
      })
      .finally(() => {
        if (!shouldIgnore) {
          setLoadingHistory(false);
        }
      });

    return () => {
      shouldIgnore = true;
    };
  }, [searchTerm, subjectFilter]);

  const subjectOptions = useMemo(() => buildSubjectOptions(allHistoryRecords), [allHistoryRecords]);
  const averageScore = useMemo(() => {
    if (allHistoryRecords.length === 0) return 0;
    const total = allHistoryRecords.reduce((sum, record) => sum + record.score, 0);
    return Number((total / allHistoryRecords.length).toFixed(2));
  }, [allHistoryRecords]);

  const handleReview = async (record) => {
    setReviewingId(record.id);
    try {
      const res = await api.get(`/api/exam/history/${record.id}`);
      goTo(`/practice/review/${record.id}`, {
        state: normalizeExamResultDetail(res.data),
      });
    } catch {
      alert("Không thể tải chi tiết bài làm. Vui lòng thử lại.");
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10 p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <History className="h-8 w-8 text-indigo-600" />
            Lịch sử học tập
          </h2>
          <p className="text-slate-500 mt-1">Theo dõi tiến độ và quay lại các bài học quan trọng.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-none shadow-sm bg-indigo-50/50">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-indigo-600 font-medium">Điểm trung bình</p>
                <h3 className="text-2xl font-bold text-slate-900">{averageScore || "--"}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="history" className="w-full space-y-6">
        <TabsList className="inline-flex h-12 items-center justify-start rounded-xl bg-slate-100 p-1 text-slate-500 w-full md:w-auto">
          <TabsTrigger
            value="history"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-bold ring-offset-white transition-all focus-visible:outline-none data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
          >
            <History className="w-4 h-4 mr-2" />
            Lịch sử thi
          </TabsTrigger>
          <TabsTrigger
            value="bookmarks"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-bold ring-offset-white transition-all focus-visible:outline-none data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm"
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Bài học đã lưu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4 outline-none">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                placeholder="Tìm kiếm tên bài thi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full md:w-52 rounded-full bg-white shadow-sm">
                <SelectValue placeholder="Lọc môn" />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject === "all" ? "Tất cả môn" : subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loadingHistory ? (
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-8 flex items-center justify-center gap-3 text-slate-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Đang tải lịch sử thi...
              </CardContent>
            </Card>
          ) : null}

          {!loadingHistory && historyRecords.length === 0 ? (
            <Card className="border-dashed border-slate-300 shadow-none">
              <CardContent className="p-10 text-center text-slate-500">
                Chưa có lịch sử thi phù hợp.
              </CardContent>
            </Card>
          ) : null}

          {!loadingHistory && historyRecords.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {historyRecords.map((record) => (
                <Card key={record.id} className="group hover:border-indigo-200 transition-all border-slate-200 shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center p-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{record.subjectName}</Badge>
                          <span className="text-xs text-slate-400">{formatSubmittedAt(record.submittedAt)}</span>
                          <span className="text-xs text-slate-400">{formatDurationSeconds(record.durationSeconds)}</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-800">{record.examTitle}</h4>
                        <p className="mt-1 text-xs text-slate-500">
                          Đúng {record.correctCount}/{record.totalQuestions} câu
                        </p>
                      </div>
                      <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <div className="text-center">
                          <span className={cn("text-2xl font-black", getScoreColor(record.score))}>{record.score}</span>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Điểm</p>
                        </div>
                        <Button
                          onClick={() => handleReview(record)}
                          disabled={reviewingId === record.id}
                          className="rounded-full"
                        >
                          {reviewingId === record.id ? "Đang tải..." : "Xem lại"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="bookmarks" className="outline-none">
          <SavedLessons />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyHistory;
