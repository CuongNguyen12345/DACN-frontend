import test from "node:test";
import assert from "node:assert/strict";

import {
  filterExercises,
  paginateExercises,
  getExerciseStats,
} from "./exerciseManagementFilters.js";

const exercises = [
  {
    id: "EX01",
    title: "Dao ham co ban",
    lessonTitle: "Khai niem dao ham",
    subject: "Toan",
    grade: "Lop 12",
    status: "Da xuat ban",
    questionCount: 8,
  },
  {
    id: "EX02",
    title: "Cuc tri ham so",
    lessonTitle: "Cuc tri cua ham so",
    subject: "Toan",
    grade: "Lop 12",
    status: "Ban nhap",
    questionCount: 10,
  },
  {
    id: "EX03",
    title: "Dao dong dieu hoa",
    lessonTitle: "Dao dong co hoc",
    subject: "Vat Ly",
    grade: "Lop 11",
    status: "Dang an",
    questionCount: 6,
  },
];

test("filters exercises by keyword across title and lesson title", () => {
  const result = filterExercises(exercises, {
    keyword: "cuc tri",
    subject: "all",
    grade: "all",
    lesson: "all",
    status: "all",
  });

  assert.deepEqual(result.map((item) => item.id), ["EX02"]);
});

test("combines subject, grade, lesson and status filters", () => {
  const result = filterExercises(exercises, {
    keyword: "",
    subject: "Toan",
    grade: "Lop 12",
    lesson: "Khai niem dao ham",
    status: "Da xuat ban",
  });

  assert.deepEqual(result.map((item) => item.id), ["EX01"]);
});

test("paginates exercises with a minimum total page of one", () => {
  assert.deepEqual(paginateExercises(exercises, 2, 2), {
    totalPages: 2,
    currentItems: [exercises[2]],
  });

  assert.deepEqual(paginateExercises([], 1, 5), {
    totalPages: 1,
    currentItems: [],
  });
});

test("calculates exercise dashboard stats", () => {
  assert.deepEqual(getExerciseStats(exercises), {
    total: 3,
    published: 1,
    draft: 1,
    hidden: 1,
    questions: 24,
  });
});
