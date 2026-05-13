export const defaultQuestion = {
  bankQuestionId: null,
  content: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctAnswer: "A",
};

const ANSWER_KEYS = ["A", "B", "C", "D"];
const normalize = (value) => String(value || "").trim().toLowerCase();

const isBlankQuestion = (question) =>
  !String(question?.content || "").trim() &&
  !String(question?.optionA || "").trim() &&
  !String(question?.optionB || "").trim() &&
  !String(question?.optionC || "").trim() &&
  !String(question?.optionD || "").trim();

export function convertBankQuestionToExerciseQuestion(bankQuestion) {
  const options = Array.isArray(bankQuestion.options) ? bankQuestion.options : [];
  const correctIndex = options.findIndex((option) => option.isCorrect || option.correct);

  return {
    bankQuestionId: bankQuestion.id,
    content: bankQuestion.content || "",
    optionA: options[0]?.content || options[0]?.text || bankQuestion.optionA || "",
    optionB: options[1]?.content || options[1]?.text || bankQuestion.optionB || "",
    optionC: options[2]?.content || options[2]?.text || bankQuestion.optionC || "",
    optionD: options[3]?.content || options[3]?.text || bankQuestion.optionD || "",
    correctAnswer:
      bankQuestion.correctAnswer || ANSWER_KEYS[correctIndex >= 0 ? correctIndex : 0],
  };
}

export function mergeBankQuestionsIntoFormQuestions(currentQuestions, bankQuestions) {
  const importedQuestions = bankQuestions.map(convertBankQuestionToExerciseQuestion);
  const shouldReplaceStarterRow =
    currentQuestions.length === 1 && isBlankQuestion(currentQuestions[0]);

  return shouldReplaceStarterRow
    ? importedQuestions
    : [...currentQuestions, ...importedQuestions];
}

export function filterBankQuestions(
  bankQuestions,
  {
    keyword = "",
    subject = "all",
    grade = "all",
    topic = "all",
    level = "all",
  } = {},
) {
  const searchTerm = normalize(keyword);

  return bankQuestions.filter((question) => {
    const matchesSearch =
      !searchTerm ||
      normalize(question.content).includes(searchTerm) ||
      normalize(question.topicName).includes(searchTerm);
    const matchesSubject = subject === "all" || question.subject === subject;
    const matchesGrade = grade === "all" || question.grade === grade;
    const matchesTopic = topic === "all" || question.topicName === topic;
    const matchesLevel = level === "all" || question.level === level;

    return (
      matchesSearch &&
      matchesSubject &&
      matchesGrade &&
      matchesTopic &&
      matchesLevel
    );
  });
}

export function paginateBankQuestions(bankQuestions, currentPage, itemsPerPage) {
  const totalPages = Math.max(1, Math.ceil(bankQuestions.length / itemsPerPage));
  const safePage = Math.min(Math.max(Number(currentPage) || 1, 1), totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;

  return {
    totalPages,
    currentItems: bankQuestions.slice(startIndex, startIndex + itemsPerPage),
  };
}

export function getDifficultyBadgeClassName(level) {
  switch (level) {
    case "Dễ":
      return "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700";
    case "Trung bình":
      return "inline-flex rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700";
    case "Khó":
      return "inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-700";
    default:
      return "inline-flex rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700";
  }
}

export function buildBankQuestionParams({
  keyword = "",
  subject = "all",
  grade = "all",
  topic = "all",
  level = "all",
} = {}) {
  const params = {};
  const trimmedKeyword = String(keyword || "").trim();

  if (trimmedKeyword) params.keyword = trimmedKeyword;
  if (subject !== "all") params.subject = subject;
  if (grade !== "all") params.grade = grade;
  if (topic !== "all") params.topicName = topic;
  if (level !== "all") params.level = level;

  return params;
}

export function buildTopicParams({ subject = "all", grade = "all" } = {}) {
  if (!subject || subject === "all" || !grade || grade === "all") return null;

  return { subject, grade };
}

export function normalizeTopicOptions(topics) {
  if (!Array.isArray(topics)) return [];

  return topics.reduce((options, topic) => {
    const rawName =
      typeof topic === "string" ? topic : topic?.name || topic?.topicName;
    const name = String(rawName || "").trim();

    if (!name) return options;

    options.push({
      id: typeof topic === "string" ? topic : topic?.id ?? name,
      name,
    });

    return options;
  }, []);
}

export function normalizeBankQuestionSummary(question) {
  return {
    id: question.id,
    content: question.content,
    subject: question.subject,
    grade: question.grade || question.status || "",
    topicName: question.topicName || "",
    level: question.level || "",
  };
}

export function buildQuizPayload(formData) {
  const title = String(formData.title || "").trim();
  const subject = formData.subject || "";
  const grade = formData.grade || "";
  const topicName =
    formData.topic && formData.topic !== "all" ? String(formData.topic).trim() : "";
  const questionIds = (formData.questions || [])
    .map((question) => question.bankQuestionId)
    .filter((id) => id !== null && id !== undefined && String(id).trim())
    .map((id) => String(id));

  if (!title) {
    throw new Error("Vui lòng nhập tên bài tập.");
  }

  if (!subject || subject === "all" || !grade || grade === "all") {
    throw new Error("Vui lòng chọn môn học và lớp hợp lệ.");
  }

  if (!topicName) {
    throw new Error("Vui lòng chọn chủ đề.");
  }

  if (questionIds.length === 0) {
    throw new Error("Vui lòng chọn ít nhất một câu hỏi từ ngân hàng câu hỏi.");
  }

  return {
    title,
    subject,
    grade,
    topicName,
    lessonId: formData.lessonId ? Number(formData.lessonId) : null,
    duration: Number(formData.duration) || 0,
    passingScore: Number(formData.passScore) || 0,
    questionIds,
  };
}

export function normalizeQuizSummary(quiz) {
  const id = Number(quiz.id);
  return {
    id,
    code: `EX${String(id || 0).padStart(2, "0")}`,
    title: quiz.title || "",
    lessonTitle: quiz.lessonTitle || quiz.topicName || "Chưa gắn bài học",
    subject: quiz.subject || "",
    grade: quiz.grade || "",
    questionCount: Number(quiz.questionCount) || 0,
    duration: Number(quiz.duration) || 0,
    passScore: Number(quiz.passingScore ?? quiz.passScore) || 0,
    updatedAt: quiz.updatedAt || quiz.createdAt || "",
  };
}

export function normalizeQuizDetailToForm(quiz) {
  return {
    ...defaultExerciseForm,
    title: quiz.title || "",
    lessonId: quiz.lessonId ? String(quiz.lessonId) : "",
    subject: quiz.subject || defaultExerciseForm.subject,
    grade: quiz.grade || defaultExerciseForm.grade,
    topic: quiz.topicName || "all",
    duration: Number(quiz.duration) || defaultExerciseForm.duration,
    passScore: Number(quiz.passingScore ?? quiz.passScore) || defaultExerciseForm.passScore,
    questions: Array.isArray(quiz.questions)
      ? quiz.questions.map(convertBankQuestionToExerciseQuestion)
      : [],
  };
}

export function getAssignableTopics(lessons, subject, grade) {
  if (subject === "all" || grade === "all") return [];

  return [
    ...new Set(
      lessons
        .filter((lesson) => lesson.subject === subject && lesson.grade === grade)
        .map((lesson) => lesson.topicName)
        .filter(Boolean),
    ),
  ];
}

export function filterAssignableLessons(
  lessons,
  { subject = "all", grade = "all", topic = "all" } = {},
) {
  return lessons.filter((lesson) => {
    const matchesSubject = subject === "all" || lesson.subject === subject;
    const matchesGrade = grade === "all" || lesson.grade === grade;
    const matchesTopic = topic === "all" || lesson.topicName === topic;

    return matchesSubject && matchesGrade && matchesTopic;
  });
}

export const defaultExerciseForm = {
  title: "",
  lessonId: "L01",
  subject: "Toán",
  grade: "Lớp 12",
  topic: "Đạo hàm",
  duration: 15,
  passScore: 70,
  questions: [{ ...defaultQuestion }],
};

export function buildExerciseFromForm(
  formData,
  lessons,
  exerciseId,
  updatedAt = new Date().toISOString().slice(0, 10),
) {
  const title = String(formData.title || "").trim();
  const validQuestions = formData.questions.filter((question) =>
    String(question.content || "").trim(),
  );
  const lesson = lessons.find((item) => item.id === formData.lessonId);
  const subject = lesson?.subject || formData.subject || "";
  const grade = lesson?.grade || formData.grade || "";
  const topic = formData.topic && formData.topic !== "all" ? formData.topic : "";

  if (!title) {
    throw new Error("Vui lòng nhập tên bài tập.");
  }

  if (!lesson && (!subject || subject === "all" || !grade || grade === "all")) {
    throw new Error("Vui lòng chọn môn học và lớp hợp lệ.");
  }

  if (validQuestions.length === 0) {
    throw new Error("Vui lòng nhập ít nhất một câu hỏi trắc nghiệm.");
  }

  return {
    id: exerciseId,
    title,
    lessonId: lesson?.id || "",
    lessonTitle: lesson?.title || topic || "Chưa gắn bài học",
    subject,
    grade,
    questionCount: validQuestions.length,
    duration: Number(formData.duration) || 0,
    passScore: Number(formData.passScore) || 0,
    status: "Bản nháp",
    updatedAt,
  };
}
