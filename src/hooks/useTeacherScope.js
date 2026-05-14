import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

const normalizeSubjectLabel = (subject) => {
  const value = String(subject || "").trim();
  const normalized = value.toLowerCase();

  if (!normalized) return null;
  if (normalized.includes("toán") || normalized.includes("toan")) return "Toán";
  if (normalized.includes("vật") || normalized.includes("vat") || normalized === "lý" || normalized === "ly") return "Vật Lý";
  if (normalized.includes("hóa") || normalized.includes("hoa")) return "Hóa Học";
  if (normalized.includes("sinh")) return "Sinh học";
  if (normalized.includes("anh")) return "Tiếng Anh";

  return value;
};

const normalizeGradeLabel = (grade) => {
  const value = String(grade || "").trim();
  if (!value) return "";

  const gradeNumber = value
    .replace(/^lớp\s*/i, "")
    .replace(/^lop\s*/i, "")
    .replace(/^class\s*/i, "")
    .trim();

  return `Lớp ${gradeNumber}`;
};

export function useTeacherScope() {
  const { user, role } = useAuth();

  return useMemo(() => {
    const isTeacher = role === "teacher";

    if (!isTeacher || !user) {
      return {
        isTeacher: false,
        allowedSubject: null,
        allowedSubjectDb: null,
        allowedGrades: [],
        canUseSubject: () => true,
        canUseGrade: () => true,
      };
    }

    const dbSubject = user.schoolName ?? null;
    const feSubject = normalizeSubjectLabel(dbSubject);
    const allowedGrades = user.grade
      ? user.grade
          .split(",")
          .map(normalizeGradeLabel)
          .filter(Boolean)
      : [];

    return {
      isTeacher: true,
      allowedSubject: feSubject,
      allowedSubjectDb: dbSubject,
      allowedGrades,
      canUseSubject: (subject) => !dbSubject || normalizeSubjectLabel(subject) === feSubject,
      canUseGrade: (grade) => allowedGrades.length === 0 || allowedGrades.includes(normalizeGradeLabel(grade)),
    };
  }, [user, role]);
}
