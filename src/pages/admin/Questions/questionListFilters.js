export const SUBJECT_FILTER_OPTIONS = [
  { value: "all", label: "Tất cả môn" },
  { value: "Toán", label: "Toán học" },
  { value: "Vật Lý", label: "Vật Lý" },
  { value: "Hóa Học", label: "Hóa Học" },
  { value: "Tiếng Anh", label: "Tiếng Anh" },
];

export function getScopedSubjectFilter(scope, currentValue) {
  if (scope?.isTeacher && scope.allowedSubject) {
    return {
      value: scope.allowedSubject,
      disabled: true,
    };
  }

  return {
    value: currentValue || "all",
    disabled: false,
  };
}

export function getScopedGradeFilter(scope, currentValue) {
  const allowedGrades = Array.isArray(scope?.allowedGrades)
    ? scope.allowedGrades
    : [];

  if (!scope?.isTeacher || allowedGrades.length === 0) {
    return {
      value: currentValue || "all",
      disabled: false,
    };
  }

  return {
    value: allowedGrades.includes(currentValue) ? currentValue : allowedGrades[0],
    disabled: allowedGrades.length === 1,
  };
}
