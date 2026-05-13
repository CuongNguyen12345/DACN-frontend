export const normalizeSavedLessons = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item) => item?.id !== null && item?.id !== undefined && Number.isFinite(Number(item.id)))
    .map((item) => {
      const id = Number(item.id);
      const subjectName = item.subjectName || "";
      const gradeLevel = item.gradeLevel || "";
      const fallbackBadge = [subjectName, gradeLevel].filter(Boolean).join(" ");

      return {
        id,
        title: String(item.lessonName || item.title || `Bài học ${id}`).trim(),
        chapterName: item.chapterName || "",
        subjectName,
        gradeLevel,
        subjectBadge: item.subjectBadge || fallbackBadge,
        lastWatchedTime: Number.isFinite(Number(item.lastWatchedTime))
          ? Number(item.lastWatchedTime)
          : 0,
        bookmarkedAt: item.bookmarkedAt || null,
        href: `/course/learning/${id}`,
      };
    });
};

export const paginateSavedLessons = (lessons = [], page = 1, itemsPerPage = 5) => {
  const safeItemsPerPage = Math.max(1, Number(itemsPerPage) || 5);
  const totalPages = Math.max(1, Math.ceil(lessons.length / safeItemsPerPage));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const startIndex = (currentPage - 1) * safeItemsPerPage;

  return {
    currentPage,
    totalPages,
    items: lessons.slice(startIndex, startIndex + safeItemsPerPage),
  };
};

export const formatSavedLessonWatchTime = (seconds = 0) => {
  const totalSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  if (minutes <= 0) return `${remainingSeconds}s`;
  return `${minutes}m ${remainingSeconds}s`;
};
