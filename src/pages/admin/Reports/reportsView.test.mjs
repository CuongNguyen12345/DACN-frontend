import test from "node:test";
import assert from "node:assert/strict";

import {
  buildReportStats,
  getReportMonthParam,
  normalizeScoreDistribution,
  normalizeTopStudents,
  unwrapApiData,
} from "./reportsView.js";

test("unwraps plain payloads and ApiResponse result payloads", () => {
  assert.deepEqual(unwrapApiData({ result: { totalStudents: 10 } }), { totalStudents: 10 });
  assert.deepEqual(unwrapApiData([{ id: 1 }]), [{ id: 1 }]);
});

test("formats report month as backend YearMonth query value", () => {
  assert.equal(getReportMonthParam(new Date("2026-05-14T00:00:00")), "2026-05");
});

test("builds report stat cards from backend overview field names", () => {
  const stats = buildReportStats({
    totalStudents: 1250,
    activeExams: 45,
    monthlyAttempts: 3240,
    averageScore: 7.8,
    percentChanges: {
      students: 12,
      activeExams: 5,
      monthlyAttempts: 18,
      averageScore: -2,
    },
  });

  assert.equal(stats[0].value, "1,250");
  assert.equal(stats[1].trend, "+5%");
  assert.equal(stats[2].trend, "+18%");
  assert.equal(stats[3].trend, "-2%");
  assert.equal(stats[3].trendUp, false);
});

test("normalizes score distribution and top student payloads", () => {
  const distribution = normalizeScoreDistribution([
    { range: "Gioi", percent: 25, count: 2, color: "bg-emerald-500" },
    { range: "Kha", percentage: 50, count: 4 },
    { range: "Trung binh (5.0 - 6.4)", percent: 0, count: 0 },
    { range: "Yeu (< 5.0)", percent: 25, count: 2 },
  ]);
  assert.equal(distribution[0].range, "Giỏi (8.0 - 10)");
  assert.equal(distribution[1].range, "Khá (6.5 - 7.9)");
  assert.equal(distribution[2].range, "Trung bình (5.0 - 6.4)");
  assert.equal(distribution[3].range, "Yếu (< 5.0)");
  assert.equal(distribution[0].percent, 25);
  assert.equal(distribution[1].percent, 50);

  const students = normalizeTopStudents([
    { id: 7, name: "Nguyen Van A", grade: "Lop 12", score: 8.75, exams: 3 },
    { id: 8, fullName: "Tran Thi B", class: "Lop 11", avgScore: 8, totalExams: 2 },
  ]);
  assert.equal(students[0].name, "Nguyen Van A");
  assert.equal(students[0].score, "8.8");
  assert.equal(students[1].exams, 2);
});
