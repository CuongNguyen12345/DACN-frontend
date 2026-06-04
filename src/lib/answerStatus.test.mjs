import test from "node:test";
import assert from "node:assert/strict";

import {
  ANSWER_STATUS,
  buildIncorrectQuestions,
  getAnswerCounts,
  getQuestionAnswerStatus,
} from "./answerStatus.js";

const questions = [
  {
    id: 101,
    content: "1 + 1 = ?",
    options: [
      { label: "A", content: "2", correct: true },
      { label: "B", content: "3", correct: false },
    ],
  },
  {
    id: 102,
    content: "2 + 2 = ?",
    options: [
      { label: "A", content: "3", correct: false },
      { label: "B", content: "4", correct: true },
    ],
  },
  {
    id: 103,
    content: "3 + 3 = ?",
    options: [
      { label: "A", content: "6", correct: true },
      { label: "B", content: "7", correct: false },
    ],
  },
];

test("classifies unanswered questions separately from incorrect answers", () => {
  assert.equal(getQuestionAnswerStatus(questions[0], { 101: "A" }), ANSWER_STATUS.CORRECT);
  assert.equal(getQuestionAnswerStatus(questions[1], { 102: "A" }), ANSWER_STATUS.INCORRECT);
  assert.equal(getQuestionAnswerStatus(questions[2], {}), ANSWER_STATUS.UNSELECTED);
});

test("counts correct, incorrect and unselected answers independently", () => {
  const counts = getAnswerCounts(questions, {
    101: "A",
    102: "A",
  });

  assert.deepEqual(counts, {
    correct: 1,
    incorrect: 1,
    unselected: 1,
    total: 3,
  });
});

test("builds incorrect question list without unanswered questions", () => {
  const incorrectQuestions = buildIncorrectQuestions(questions, {
    101: "A",
    102: "A",
  });

  assert.deepEqual(incorrectQuestions.map((question) => question.questionId), [102]);
  assert.equal(incorrectQuestions[0].userAnswer, "A");
  assert.equal(incorrectQuestions[0].correctAnswer, "B");
});
