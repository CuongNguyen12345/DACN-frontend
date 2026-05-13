import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildBankQuestionParams,
  buildExerciseFromForm,
  buildQuizPayload,
  buildTopicParams,
  defaultExerciseForm,
  filterBankQuestions,
  filterAssignableLessons,
  getDifficultyBadgeClassName,
  getAssignableTopics,
  mergeBankQuestionsIntoFormQuestions,
  normalizeBankQuestionSummary,
  normalizeQuizDetailToForm,
  normalizeQuizSummary,
  normalizeTopicOptions,
  paginateBankQuestions,
} from "./exerciseCreateForm.js";

const lessons = [
  {
    id: "L01",
    title: "Khái niệm đạo hàm",
    subject: "Toán",
    grade: "Lớp 12",
  },
];

test("exercise create page does not render a correct answer selector", () => {
  const source = readFileSync(new URL("./ExerciseCreate.jsx", import.meta.url), "utf8");

  assert.equal(source.includes("correctAnswer"), false);
});

test("exercise create page does not render a manual add question button", () => {
  const source = readFileSync(new URL("./ExerciseCreate.jsx", import.meta.url), "utf8");

  assert.equal(source.includes("addQuestion"), false);
});

test("requires exercise title before creating an exercise", () => {
  assert.throws(
    () => buildExerciseFromForm(defaultExerciseForm, lessons, "EX06"),
    /tên bài tập/i,
  );
});

test("requires at least one question with content", () => {
  assert.throws(
    () =>
      buildExerciseFromForm(
        {
          ...defaultExerciseForm,
          title: "Luyện tập đạo hàm",
        },
        lessons,
        "EX06",
      ),
    /câu hỏi/i,
  );
});

test("builds API payload for quiz table storage", () => {
  assert.deepEqual(
    buildQuizPayload({
      title: " Luyện tập mệnh đề ",
      subject: "Toán",
      grade: "Lớp 10",
      topic: "Mệnh đề",
      lessonId: "",
      duration: "20",
      passScore: "75",
      questions: [
        { bankQuestionId: "Q-12", content: "Câu 1" },
        { bankQuestionId: 15, content: "Câu 2" },
        { content: "Câu nhập tay không lưu vào bảng nối" },
      ],
    }),
    {
      title: "Luyện tập mệnh đề",
      subject: "Toán",
      grade: "Lớp 10",
      topicName: "Mệnh đề",
      lessonId: null,
      duration: 20,
      passingScore: 75,
      questionIds: ["Q-12", "15"],
    },
  );
});

test("requires selected bank questions before saving a quiz", () => {
  assert.throws(
    () =>
      buildQuizPayload({
        ...defaultExerciseForm,
        title: "Luyện tập",
        topic: "Mệnh đề",
        questions: [{ content: "Câu nhập tay" }],
      }),
    /ngân hàng câu hỏi/i,
  );
});

test("normalizes API quiz summary for management table", () => {
  assert.deepEqual(
    normalizeQuizSummary({
      id: 7,
      title: "Luyện tập",
      lessonTitle: "Mệnh đề",
      subject: "Toán",
      grade: "Lớp 10",
      questionCount: 3,
      duration: 20,
      passingScore: 75,
      updatedAt: "2026-05-13",
    }),
    {
      id: 7,
      code: "EX07",
      title: "Luyện tập",
      lessonTitle: "Mệnh đề",
      subject: "Toán",
      grade: "Lớp 10",
      questionCount: 3,
      duration: 20,
      passScore: 75,
      updatedAt: "2026-05-13",
    },
  );
});

test("normalizes API quiz detail back to edit form data", () => {
  assert.deepEqual(
    normalizeQuizDetailToForm({
      id: 7,
      title: "Luyện tập",
      lessonId: null,
      topicName: "Mệnh đề",
      subject: "Toán",
      grade: "Lớp 10",
      duration: 20,
      passingScore: 75,
      questions: [
        {
          id: 12,
          content: "Mệnh đề là gì?",
          options: [
            { content: "Câu có giá trị đúng hoặc sai", correct: true },
            { content: "Một biểu thức bất kỳ", correct: false },
          ],
        },
      ],
    }).questions,
    [
      {
        bankQuestionId: 12,
        content: "Mệnh đề là gì?",
        optionA: "Câu có giá trị đúng hoặc sai",
        optionB: "Một biểu thức bất kỳ",
        optionC: "",
        optionD: "",
        correctAnswer: "A",
      },
    ],
  );
});

test("builds an exercise from a valid create form", () => {
  const exercise = buildExerciseFromForm(
    {
      ...defaultExerciseForm,
      title: "Luyện tập đạo hàm",
      lessonId: "L01",
      duration: "12",
      passScore: "70",
      questions: [
        {
          content: "Đạo hàm của x^2 là gì?",
          optionA: "2x",
          optionB: "x",
          optionC: "2",
          optionD: "x^3",
          correctAnswer: "A",
        },
      ],
    },
    lessons,
    "EX06",
    "2026-05-12",
  );

  assert.deepEqual(exercise, {
    id: "EX06",
    title: "Luyện tập đạo hàm",
    lessonId: "L01",
    lessonTitle: "Khái niệm đạo hàm",
    subject: "Toán",
    grade: "Lớp 12",
    questionCount: 1,
    duration: 12,
    passScore: 70,
    status: "Bản nháp",
    updatedAt: "2026-05-12",
  });
});

test("builds an exercise from selected subject grade and topic when no lesson is selected", () => {
  const exercise = buildExerciseFromForm(
    {
      ...defaultExerciseForm,
      title: "Luyện tập mệnh đề",
      lessonId: "",
      subject: "Toán",
      grade: "Lớp 10",
      topic: "Mệnh đề",
      questions: [
        {
          content: "Mệnh đề là gì?",
          optionA: "Câu có giá trị đúng hoặc sai",
          optionB: "Một biểu thức bất kỳ",
          optionC: "Một số nguyên",
          optionD: "Một phương trình",
          correctAnswer: "A",
        },
      ],
    },
    lessons,
    "EX07",
    "2026-05-12",
  );

  assert.deepEqual(exercise, {
    id: "EX07",
    title: "Luyện tập mệnh đề",
    lessonId: "",
    lessonTitle: "Mệnh đề",
    subject: "Toán",
    grade: "Lớp 10",
    questionCount: 1,
    duration: 15,
    passScore: 70,
    status: "Bản nháp",
    updatedAt: "2026-05-12",
  });
});

test("merges selected bank questions into the create form and replaces a blank starter row", () => {
  const result = mergeBankQuestionsIntoFormQuestions(defaultExerciseForm.questions, [
    {
      id: "Q01",
      content: "Đạo hàm của x^2 là gì?",
      options: [
        { content: "2x", isCorrect: true },
        { content: "x", isCorrect: false },
        { content: "2", isCorrect: false },
        { content: "x^3", isCorrect: false },
      ],
    },
  ]);

  assert.deepEqual(result, [
    {
      bankQuestionId: "Q01",
      content: "Đạo hàm của x^2 là gì?",
      optionA: "2x",
      optionB: "x",
      optionC: "2",
      optionD: "x^3",
      correctAnswer: "A",
    },
  ]);
});

test("filters bank questions by grade topic and difficulty", () => {
  const bankQuestions = [
    {
      id: "Q01",
      content: "Đạo hàm của x^2 là gì?",
      subject: "Toán",
      grade: "Lớp 12",
      topicName: "Đạo hàm",
      level: "Dễ",
    },
    {
      id: "Q02",
      content: "Cực trị hàm bậc ba",
      subject: "Toán",
      grade: "Lớp 12",
      topicName: "Cực trị",
      level: "Khó",
    },
    {
      id: "Q03",
      content: "Dao động điều hòa",
      subject: "Vật Lý",
      grade: "Lớp 11",
      topicName: "Dao động",
      level: "Trung bình",
    },
  ];

  const result = filterBankQuestions(bankQuestions, {
    keyword: "",
    subject: "Toán",
    grade: "Lớp 12",
    topic: "Cực trị",
    level: "Khó",
  });

  assert.deepEqual(result.map((question) => question.id), ["Q02"]);
});

test("paginates bank questions for a compact modal", () => {
  const bankQuestions = ["Q01", "Q02", "Q03", "Q04", "Q05"].map((id) => ({
    id,
  }));

  assert.deepEqual(paginateBankQuestions(bankQuestions, 2, 2), {
    totalPages: 3,
    currentItems: [{ id: "Q03" }, { id: "Q04" }],
  });
});

test("returns semantic color classes for difficulty levels", () => {
  assert.match(getDifficultyBadgeClassName("Dễ"), /emerald/);
  assert.match(getDifficultyBadgeClassName("Trung bình"), /amber/);
  assert.match(getDifficultyBadgeClassName("Khó"), /red/);
});

test("builds API params for bank question search without all filters", () => {
  assert.deepEqual(
    buildBankQuestionParams({
      keyword: "đạo hàm",
      subject: "Toán",
      grade: "Lớp 12",
      topic: "Đạo hàm",
      level: "Dễ",
    }),
    {
      keyword: "đạo hàm",
      subject: "Toán",
      grade: "Lớp 12",
      topicName: "Đạo hàm",
      level: "Dễ",
    },
  );

  assert.deepEqual(
    buildBankQuestionParams({
      keyword: "",
      subject: "all",
      grade: "all",
      topic: "all",
      level: "all",
    }),
    {},
  );
});

test("builds topic params only after subject and grade are selected", () => {
  assert.equal(
    buildTopicParams({
      subject: "Toán",
      grade: "all",
    }),
    null,
  );

  assert.deepEqual(
    buildTopicParams({
      subject: "Toán",
      grade: "Lớp 10",
    }),
    {
      subject: "Toán",
      grade: "Lớp 10",
    },
  );
});

test("normalizes API topics for topic dropdowns", () => {
  assert.deepEqual(
    normalizeTopicOptions([
      { id: 1, name: "Mệnh đề" },
      { topicName: "Hàm số" },
      "Vectơ",
      { id: 4, name: "" },
      null,
    ]),
    [
      { id: 1, name: "Mệnh đề" },
      { id: "Hàm số", name: "Hàm số" },
      { id: "Vectơ", name: "Vectơ" },
    ],
  );
});

test("normalizes API question summary grade from status field", () => {
  assert.deepEqual(
    normalizeBankQuestionSummary({
      id: "Q-12",
      content: "Câu hỏi",
      subject: "Toán",
      status: "Lớp 12",
      topicName: "Đạo hàm",
      level: "Dễ",
    }),
    {
      id: "Q-12",
      content: "Câu hỏi",
      subject: "Toán",
      grade: "Lớp 12",
      topicName: "Đạo hàm",
      level: "Dễ",
    },
  );
});

test("only returns assignable topics after subject and grade are selected", () => {
  const lessons = [
    { title: "Đạo hàm", subject: "Toán", grade: "Lớp 12", topicName: "Đạo hàm" },
    { title: "Cực trị", subject: "Toán", grade: "Lớp 12", topicName: "Cực trị" },
    { title: "Dao động", subject: "Vật Lý", grade: "Lớp 11", topicName: "Dao động" },
  ];

  assert.deepEqual(getAssignableTopics(lessons, "Toán", "all"), []);
  assert.deepEqual(getAssignableTopics(lessons, "Toán", "Lớp 12"), [
    "Đạo hàm",
    "Cực trị",
  ]);
});

test("filters assignable lessons by subject grade and topic", () => {
  const lessons = [
    { id: "L01", subject: "Toán", grade: "Lớp 12", topicName: "Đạo hàm" },
    { id: "L02", subject: "Toán", grade: "Lớp 12", topicName: "Cực trị" },
    { id: "L03", subject: "Vật Lý", grade: "Lớp 11", topicName: "Dao động" },
  ];

  const result = filterAssignableLessons(lessons, {
    subject: "Toán",
    grade: "Lớp 12",
    topic: "Cực trị",
  });

  assert.deepEqual(result.map((lesson) => lesson.id), ["L02"]);
});
