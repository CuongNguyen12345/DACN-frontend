import test from "node:test";
import assert from "node:assert/strict";

import {
  getScopedGradeFilter,
  getScopedSubjectFilter,
} from "./questionListFilters.js";

test("locks teacher subject filter to the assigned subject", () => {
  const result = getScopedSubjectFilter(
    { isTeacher: true, allowedSubject: "Vật Lý" },
    "all",
  );

  assert.deepEqual(result, {
    value: "Vật Lý",
    disabled: true,
  });
});

test("keeps admin subject filter editable", () => {
  const result = getScopedSubjectFilter(
    { isTeacher: false, allowedSubject: null },
    "all",
  );

  assert.deepEqual(result, {
    value: "all",
    disabled: false,
  });
});

test("locks teacher grade filter when assigned one grade", () => {
  const result = getScopedGradeFilter(
    { isTeacher: true, allowedGrades: ["Lớp 10"] },
    "all",
  );

  assert.deepEqual(result, {
    value: "Lớp 10",
    disabled: true,
  });
});

test("defaults teacher grade filter to first assigned grade and keeps it editable when assigned multiple grades", () => {
  const result = getScopedGradeFilter(
    { isTeacher: true, allowedGrades: ["Lớp 10", "Lớp 11"] },
    "all",
  );

  assert.deepEqual(result, {
    value: "Lớp 10",
    disabled: false,
  });
});

test("keeps the selected teacher grade when it is assigned", () => {
  const result = getScopedGradeFilter(
    { isTeacher: true, allowedGrades: ["Lớp 10", "Lớp 11"] },
    "Lớp 11",
  );

  assert.deepEqual(result, {
    value: "Lớp 11",
    disabled: false,
  });
});
