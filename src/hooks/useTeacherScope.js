import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

const SUBJECT_DB_TO_FE = {
  "Toán": "Toán",
  "Lý":   "Vật Lý",
  "Hóa":  "Hóa Học",
  "Anh":  "Tiếng Anh",
};

/**
 * Returns teacher's allowed subject + grades derived from profile.
 * For admin, returns null (no restriction).
 *
 * @returns {{
 *   isTeacher: boolean,
 *   allowedSubject: string | null,       // FE format, e.g. "Vật Lý"
 *   allowedSubjectDb: string | null,     // DB format, e.g. "Lý"
 *   allowedGrades: string[],             // ["Lớp 10", "Lớp 11"]
 *   canUseSubject: (s: string) => boolean,
 *   canUseGrade: (g: string) => boolean,
 * }}
 */
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

    // schoolName stores DB subject ("Lý", "Hóa", "Toán", "Anh")
    const dbSubject = user.schoolName ?? null;
    const feSubject = dbSubject ? (SUBJECT_DB_TO_FE[dbSubject] ?? dbSubject) : null;

    // grade stores comma-separated grade numbers, e.g. "10,11"
    const allowedGrades = user.grade
      ? user.grade
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean)
          .map((g) => (g.startsWith("Lớp ") ? g : `Lớp ${g}`))
      : [];

    return {
      isTeacher: true,
      allowedSubject: feSubject,
      allowedSubjectDb: dbSubject,
      allowedGrades,
      canUseSubject: (s) => !feSubject || s === feSubject,
      canUseGrade: (g) => allowedGrades.length === 0 || allowedGrades.includes(g),
    };
  }, [user, role]);
}
