const normalize = (value) => String(value || "").trim().toLowerCase();

const matchesAnyStatus = (value, statusList) => {
  const normalizedValue = normalize(value);
  return statusList.some((status) => normalize(status) === normalizedValue);
};

export function filterExercises(
  exercises,
  {
    keyword = "",
    subject = "all",
    grade = "all",
    lesson = "all",
    difficulty = "all",
    status = "all",
  } = {},
) {
  const searchTerm = normalize(keyword);

  return exercises.filter((exercise) => {
    const matchesSearch =
      !searchTerm ||
      normalize(exercise.title).includes(searchTerm) ||
      normalize(exercise.lessonTitle).includes(searchTerm);
    const matchesSubject = subject === "all" || exercise.subject === subject;
    const matchesGrade = grade === "all" || exercise.grade === grade;
    const matchesLesson = lesson === "all" || exercise.lessonTitle === lesson;
    const matchesDifficulty = difficulty === "all" || exercise.difficulty === difficulty;
    const matchesStatus = status === "all" || exercise.status === status;

    return (
      matchesSearch &&
      matchesSubject &&
      matchesGrade &&
      matchesLesson &&
      matchesDifficulty &&
      matchesStatus
    );
  });
}

export function paginateExercises(exercises, currentPage, itemsPerPage) {
  const totalPages = Math.max(1, Math.ceil(exercises.length / itemsPerPage));
  const safePage = Math.min(Math.max(Number(currentPage) || 1, 1), totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;

  return {
    totalPages,
    currentItems: exercises.slice(startIndex, startIndex + itemsPerPage),
  };
}

export function getExerciseStats(exercises) {
  return exercises.reduce(
    (stats, exercise) => {
      stats.total += 1;
      stats.questions += Number(exercise.questionCount) || 0;

      if (matchesAnyStatus(exercise.status, ["Da xuat ban", "Đã xuất bản"])) {
        stats.published += 1;
      }
      if (matchesAnyStatus(exercise.status, ["Ban nhap", "Bản nháp"])) {
        stats.draft += 1;
      }
      if (matchesAnyStatus(exercise.status, ["Dang an", "Đang ẩn"])) {
        stats.hidden += 1;
      }

      return stats;
    },
    {
      total: 0,
      published: 0,
      draft: 0,
      hidden: 0,
      questions: 0,
    },
  );
}
