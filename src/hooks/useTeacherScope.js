import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

const SUBJECT_DB_TO_FE = {
  "Toán": "Toán",
  "Lý": "Vật Lý",
  "Hóa": "Hóa Học",
  "Anh": "Tiếng Anh",
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
    const feSubject = dbSubject ? (SUBJECT_DB_TO_FE[dbSubject] ?? dbSubject) : null;
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
      canUseSubject: (subject) => !dbSubject || subject === dbSubject || subject === feSubject,
      canUseGrade: (grade) => allowedGrades.length === 0 || allowedGrades.includes(normalizeGradeLabel(grade)),
    };
  }, [user, role]);
}
