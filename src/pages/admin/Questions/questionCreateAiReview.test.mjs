import test from "node:test";
import assert from "node:assert/strict";

import {
  buildGeneratedTopicOptions,
  getGeneratedQuestionTopicKey,
  normalizeGeneratedQuestionMeta,
  shouldSubmitAiPromptOnKeyDown,
  resolveGeneratedTopicValue,
  updateGeneratedQuestionTopic,
} from "./questionCreateAiReview.js";

test("normalizes short AI subject aliases for edit selects", () => {
  assert.equal(normalizeGeneratedQuestionMeta({ subject: "Hóa" }, { subject: "Toán" }).subject, "Hóa Học");
  assert.equal(normalizeGeneratedQuestionMeta({ subject: "Lý" }, { subject: "Toán" }).subject, "Vật Lý");
  assert.equal(normalizeGeneratedQuestionMeta({ subject: "Anh" }, { subject: "Toán" }).subject, "Tiếng Anh");
  assert.equal(normalizeGeneratedQuestionMeta({ subject: "" }, { subject: "Toán" }).subject, "Toán");
});

test("normalizes class, level, and topic fallback", () => {
  const result = normalizeGeneratedQuestionMeta(
    { grade: "Lớp 10", difficulty: "Trung bình", topicName: "Bảng tuần hoàn" },
    { grade: "Lớp 12", level: "Dễ" },
  );

  assert.equal(result.class, "10");
  assert.equal(result.level, "Trung Bình");
  assert.equal(result.topic, "Bảng tuần hoàn");
});

test("builds generated topic filter options from current results", () => {
  const topics = buildGeneratedTopicOptions([
    { topic: "Bảng tuần hoàn" },
    { topicName: "Liên kết hóa học" },
    { topic: "Bảng tuần hoàn" },
    { topic: "" },
  ]);

  assert.deepEqual(topics, ["all", "Bảng tuần hoàn", "Liên kết hóa học"]);
});

test("updates one generated question topic without mutating the original array", () => {
  const original = [
    { question: "A", topic: "Bảng tuần hoàn" },
    { question: "B", topicName: "Liên kết hóa học" },
  ];

  const updated = updateGeneratedQuestionTopic(original, 1, "Nguyên tố nhóm halogen");

  assert.equal(updated[1].topic, "Nguyên tố nhóm halogen");
  assert.equal(updated[1].topicName, "Nguyên tố nhóm halogen");
  assert.equal(original[1].topicName, "Liên kết hóa học");
});

test("builds topic cache keys from normalized subject and class", () => {
  const key = getGeneratedQuestionTopicKey(
    { subject: "Hóa", class: "10" },
    { subject: "Toán", grade: "Lớp 12" },
  );

  assert.equal(key, "Hóa Học|Lớp 10");
});

test("resolves selected topic from current question or first matching option", () => {
  assert.equal(
    resolveGeneratedTopicValue({ topic: "Nguyên tố nhóm halogen" }, ["Bảng tuần hoàn", "Nguyên tố nhóm halogen"]),
    "Nguyên tố nhóm halogen",
  );
  assert.equal(
    resolveGeneratedTopicValue({ topic: "" }, ["Bảng tuần hoàn", "Nguyên tố nhóm halogen"]),
    "Bảng tuần hoàn",
  );
});

test("submits AI prompt on Enter but keeps multiline shortcuts", () => {
  assert.equal(shouldSubmitAiPromptOnKeyDown({ key: "Enter" }), true);
  assert.equal(shouldSubmitAiPromptOnKeyDown({ key: "Enter", shiftKey: true }), false);
  assert.equal(shouldSubmitAiPromptOnKeyDown({ key: "Enter", ctrlKey: true }), false);
  assert.equal(shouldSubmitAiPromptOnKeyDown({ key: "a" }), false);
  assert.equal(shouldSubmitAiPromptOnKeyDown({ key: "Enter", isComposing: true }), false);
});
