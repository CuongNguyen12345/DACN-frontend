export const unwrapApiData = (payload) => {
  if (payload && typeof payload === "object" && "result" in payload) {
    return payload.result;
  }
  return payload;
};

export const getReportMonthParam = (date = new Date()) => {
  const safeDate = date instanceof Date ? date : new Date(date);
  const year = safeDate.getFullYear();
  const month = String(safeDate.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const formatNumber = (value) => Number(value || 0).toLocaleString("en-US");

const formatTrend = (value) => {
  const numericValue = Number(value || 0);
  return `${numericValue >= 0 ? "+" : ""}${numericValue}%`;
};

const SCORE_RANGE_LABELS = {
  gioi: "Giỏi (8.0 - 10)",
  "gioi (8.0 - 10)": "Giỏi (8.0 - 10)",
  kha: "Khá (6.5 - 7.9)",
  "kha (6.5 - 7.9)": "Khá (6.5 - 7.9)",
  "trung binh": "Trung bình (5.0 - 6.4)",
  "trung binh (5.0 - 6.4)": "Trung bình (5.0 - 6.4)",
  yeu: "Yếu (< 5.0)",
  "yeu (< 5.0)": "Yếu (< 5.0)",
};

const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const localizeScoreRange = (range) => {
  const key = normalizeText(range);
  return SCORE_RANGE_LABELS[key] || range || "";
};

export const buildReportStats = (overview = {}) => {
  const percentChanges = overview.percentChanges || {};

  return [
    {
      title: "Tổng học viên",
      value: formatNumber(overview.totalStudents),
      trend: formatTrend(percentChanges.students),
      trendUp: Number(percentChanges.students || 0) >= 0,
      iconKey: "users",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Đề thi đang mở",
      value: formatNumber(overview.activeExams),
      trend: formatTrend(percentChanges.activeExams),
      trendUp: Number(percentChanges.activeExams || 0) >= 0,
      iconKey: "book",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Lượt thi tháng này",
      value: formatNumber(overview.monthlyAttempts),
      trend: formatTrend(percentChanges.monthlyAttempts),
      trendUp: Number(percentChanges.monthlyAttempts || 0) >= 0,
      iconKey: "file",
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Điểm trung bình",
      value: String(Number(overview.averageScore || 0).toFixed(1)),
      trend: formatTrend(percentChanges.averageScore),
      trendUp: Number(percentChanges.averageScore || 0) >= 0,
      iconKey: "award",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];
};

export const normalizeScoreDistribution = (items = []) =>
  items.map((item) => ({
    range: localizeScoreRange(item.range),
    percent: Number(item.percent ?? item.percentage ?? 0),
    count: Number(item.count || 0),
    color: item.color || "bg-blue-500",
  }));

export const normalizeTopStudents = (items = []) =>
  items.map((student) => ({
    id: student.id,
    name: student.name || student.fullName || "Học viên",
    grade: student.grade || student.class || "",
    score: Number(student.score ?? student.avgScore ?? 0).toFixed(1),
    exams: Number(student.exams ?? student.totalExams ?? student.examCount ?? 0),
  }));
