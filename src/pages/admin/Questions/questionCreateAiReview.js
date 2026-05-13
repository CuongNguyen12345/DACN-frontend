export const QUESTION_SUBJECT_OPTIONS = ["Toán", "Vật Lý", "Hóa Học", "Tiếng Anh"];

const normalizeText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const normalizeGeneratedSubject = (value, fallback = "Toán") => {
  const raw = String(value || "").trim();
  const normalized = normalizeText(raw);

  if (!normalized) return fallback;
  if (["toan", "toan hoc", "math"].includes(normalized)) return "Toán";
  if (["ly", "vat ly", "vat li", "physics"].includes(normalized)) return "Vật Lý";
  if (["hoa", "hoa hoc", "chemistry"].includes(normalized)) return "Hóa Học";
  if (["anh", "tieng anh", "english"].includes(normalized)) return "Tiếng Anh";

  return QUESTION_SUBJECT_OPTIONS.includes(raw) ? raw : fallback;
};

export const normalizeGeneratedGrade = (value, fallback = "10") => {
  const raw = String(value || fallback || "10").trim();
  const match = raw.match(/10|11|12/);
  return match ? match[0] : "10";
};

export const toGradeLabel = (value, fallback = "10") =>
  `Lớp ${normalizeGeneratedGrade(value, fallback)}`;

export const normalizeGeneratedLevel = (value, fallback = "Dễ") => {
  const normalized = normalizeText(value || fallback);

  if (["de", "easy"].includes(normalized)) return "Dễ";
  if (["trung binh", "medium", "tb"].includes(normalized)) return "Trung Bình";
  if (["kho", "hard"].includes(normalized)) return "Khó";

  return fallback || "Dễ";
};

export const getGeneratedTopicName = (question = {}) =>
  String(question.topic || question.topicName || "").trim();

export const normalizeGeneratedQuestionMeta = (question = {}, defaults = {}) => ({
  ...question,
  subject: normalizeGeneratedSubject(question.subject, defaults.subject || "Toán"),
  class: normalizeGeneratedGrade(
    question.class || question.grade,
    defaults.class || String(defaults.grade || "Lớp 10").replace("Lớp ", ""),
  ),
  level: normalizeGeneratedLevel(question.level || question.difficulty, defaults.level || "Dễ"),
  topic: getGeneratedTopicName(question),
});

export const buildGeneratedTopicOptions = (questions = []) => {
  const topics = questions
    .map(getGeneratedTopicName)
    .filter(Boolean);

  return ["all", ...Array.from(new Set(topics))];
};

export const getGeneratedQuestionTopicKey = (question = {}, defaults = {}) => {
  const normalized = normalizeGeneratedQuestionMeta(question, defaults);
  return `${normalized.subject}|${toGradeLabel(normalized.class)}`;
};

export const resolveGeneratedTopicValue = (question = {}, topicOptions = []) => {
  const currentTopic = getGeneratedTopicName(question);
  if (currentTopic) return currentTopic;

  return topicOptions[0] || undefined;
};

export const shouldSubmitAiPromptOnKeyDown = (event = {}) =>
  event.key === "Enter" &&
  !event.shiftKey &&
  !event.ctrlKey &&
  !event.metaKey &&
  !event.altKey &&
  !event.isComposing;

export const updateGeneratedQuestionTopic = (questions = [], index, topicName) =>
  questions.map((question, currentIndex) => {
    if (currentIndex !== index) return question;

    return {
      ...question,
      topic: topicName,
      topicName,
    };
  });
