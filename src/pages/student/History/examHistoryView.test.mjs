import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSubjectOptions,
  formatDurationSeconds,
  normalizeExamHistory,
  normalizeExamResultDetail,
} from "./examHistoryView.js";

test("normalizes exam history API rows", () => {
  const history = normalizeExamHistory([
    {
      id: 9,
      examId: 3,
      examTitle: "  Kiểm tra Toán  ",
      subjectName: "Toán học",
      score: 8.5,
      correctCount: 17,
      totalQuestions: 20,
      durationSeconds: 740,
      submittedAt: "2026-05-14T01:00:00.000Z",
    },
    { id: null, examTitle: "bad" },
  ]);

  assert.deepEqual(history, [
    {
      id: 9,
      examId: 3,
      examTitle: "Kiểm tra Toán",
      subjectName: "Toán học",
      score: 8.5,
      correctCount: 17,
      totalQuestions: 20,
      durationSeconds: 740,
      submittedAt: "2026-05-14T01:00:00.000Z",
      status: "Hoàn thành",
    },
  ]);
});

test("builds unique subject filter options", () => {
  const subjects = buildSubjectOptions([
    { subjectName: "Toán học" },
    { subjectName: "Vật Lý" },
    { subjectName: "Toán học" },
    { subjectName: "" },
  ]);

  assert.deepEqual(subjects, ["all", "Toán học", "Vật Lý"]);
});

test("normalizes exam result detail for result and review screens", () => {
  const detail = normalizeExamResultDetail({
    id: 9,
    examId: 3,
    examTitle: "Kiểm tra Toán",
    subjectName: "Toán học",
    score: 8.5,
    correctCount: 17,
    totalQuestions: 20,
    durationSeconds: 740,
    questions: [
      {
        id: 101,
        orderNumber: 1,
        content: "1 + 1 = ?",
        level: "Dễ",
        explanation: "Vì 1 + 1 = 2",
        selectedOptionLabel: "A",
        options: [
          { label: "A", content: "2", correct: true },
          { label: "B", content: "3", correct: false },
        ],
      },
    ],
  });

  assert.equal(detail.resultId, 9);
  assert.equal(detail.examId, 3);
  assert.equal(detail.examTitle, "Kiểm tra Toán");
  assert.equal(detail.subjectName, "Toán học");
  assert.equal(detail.correct, 17);
  assert.equal(detail.total, 20);
  assert.equal(detail.timeTaken, "12:20");
  assert.deepEqual(detail.userAnswers, { 101: "A" });
  assert.equal(detail.questions[0].options[0].correct, true);
});

test("formats durations as mm:ss", () => {
  assert.equal(formatDurationSeconds(740), "12:20");
  assert.equal(formatDurationSeconds(-5), "00:00");
});
