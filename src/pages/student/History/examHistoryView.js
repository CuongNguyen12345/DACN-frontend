export const formatDurationSeconds = (seconds = 0) => {
  const totalSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

export const normalizeExamHistory = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item) => item?.id !== null && item?.id !== undefined && Number.isFinite(Number(item.id)))
    .map((item) => ({
      id: Number(item.id),
      examId: Number(item.examId) || 0,
      examTitle: String(item.examTitle || item.title || `Bài thi ${item.id}`).trim(),
      subjectName: item.subjectName || "Khác",
      score: Number(item.score) || 0,
      correctCount: Number(item.correctCount) || 0,
      totalQuestions: Number(item.totalQuestions) || 0,
      durationSeconds: Number(item.durationSeconds) || 0,
      submittedAt: item.submittedAt || null,
      status: "Hoàn thành",
    }));
};

export const buildSubjectOptions = (items = []) => {
  const subjects = items
    .map((item) => item.subjectName)
    .filter(Boolean);

  return ["all", ...Array.from(new Set(subjects))];
};

export const normalizeExamResultDetail = (detail = {}) => {
  const questions = Array.isArray(detail.questions)
    ? detail.questions.map((question) => ({
        id: question.id,
        orderNumber: question.orderNumber,
        content: question.content,
        level: question.level,
        explanation: question.explanation,
        options: Array.isArray(question.options) ? question.options : [],
      }))
    : [];

  const userAnswers = Array.isArray(detail.questions)
    ? detail.questions.reduce((answers, question) => {
        if (question.selectedOptionLabel) {
          answers[question.id] = question.selectedOptionLabel;
        }
        return answers;
      }, {})
    : {};

  return {
    resultId: Number(detail.id) || 0,
    examId: Number(detail.examId) || 0,
    examTitle: detail.examTitle || "Bài thi",
    subjectName: detail.subjectName || "Khác",
    score: Number(detail.score) || 0,
    correct: Number(detail.correctCount) || 0,
    total: Number(detail.totalQuestions) || questions.length,
    timeTaken: formatDurationSeconds(detail.durationSeconds),
    durationSeconds: Number(detail.durationSeconds) || 0,
    submittedAt: detail.submittedAt || null,
    coinsEarned: Number(detail.coinsEarned) || 0,
    coinBalance: Number(detail.coinBalance) || 0,
    coinMessage: detail.coinMessage || "",
    userAnswers,
    questions,
    showResultImmediately: true,
  };
};

export const formatSubmittedAt = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
