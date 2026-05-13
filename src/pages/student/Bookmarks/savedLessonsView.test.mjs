import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeSavedLessons,
  paginateSavedLessons,
} from "./savedLessonsView.js";

test("normalizes saved lesson API data for the list UI", () => {
  const lessons = normalizeSavedLessons([
    {
      id: 11,
      lessonName: "  Bai 1: Menh de  ",
      chapterName: "Chuong 1",
      subjectName: "Toan hoc",
      gradeLevel: "12",
      subjectBadge: "Toan hoc 12",
      lastWatchedTime: 125,
      bookmarkedAt: "2026-05-13T02:00:00.000Z",
    },
    { id: null, lessonName: "Missing id" },
  ]);

  assert.deepEqual(lessons, [
    {
      id: 11,
      title: "Bai 1: Menh de",
      chapterName: "Chuong 1",
      subjectName: "Toan hoc",
      gradeLevel: "12",
      subjectBadge: "Toan hoc 12",
      lastWatchedTime: 125,
      bookmarkedAt: "2026-05-13T02:00:00.000Z",
      href: "/course/learning/11",
    },
  ]);
});

test("paginates saved lessons and clamps invalid pages", () => {
  const lessons = Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    title: `Lesson ${index + 1}`,
  }));

  const secondPage = paginateSavedLessons(lessons, 2, 5);
  assert.equal(secondPage.totalPages, 3);
  assert.equal(secondPage.currentPage, 2);
  assert.deepEqual(secondPage.items.map((lesson) => lesson.id), [6, 7, 8, 9, 10]);

  const lastPage = paginateSavedLessons(lessons, 99, 5);
  assert.equal(lastPage.currentPage, 3);
  assert.deepEqual(lastPage.items.map((lesson) => lesson.id), [11, 12]);
});
