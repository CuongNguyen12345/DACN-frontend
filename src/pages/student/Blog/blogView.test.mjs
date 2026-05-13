import test from "node:test";
import assert from "node:assert/strict";

import {
  BLOG_CATEGORIES,
  filterBlogPosts,
  getBlogCategoryCounts,
  getBlogPostBySlug,
  getBlogTags,
} from "./blogView.js";

test("filters blog posts by keyword and category", () => {
  const posts = [
    { id: 1, title: "Ôn thi Toán hiệu quả", excerpt: "Lộ trình 30 ngày", category: "Góc học tập", tags: ["Toán"] },
    { id: 2, title: "Chọn ngành Công nghệ", excerpt: "Hướng nghiệp cho học sinh", category: "Hướng nghiệp", tags: ["Đại học"] },
    { id: 3, title: "Tin tuyển sinh mới", excerpt: "Điểm chuẩn dự kiến", category: "Tin giáo dục", tags: ["Tuyển sinh"] },
  ];

  assert.deepEqual(
    filterBlogPosts(posts, { keyword: "toán", category: "Góc học tập" }).map((post) => post.id),
    [1],
  );
  assert.deepEqual(
    filterBlogPosts(posts, { keyword: "đại học", category: "all" }).map((post) => post.id),
    [2],
  );
});

test("builds stable category counts including the all option", () => {
  const counts = getBlogCategoryCounts([
    { category: "Góc học tập" },
    { category: "Góc học tập" },
    { category: "Hướng nghiệp" },
  ]);

  assert.equal(counts.all, 3);
  assert.equal(counts["Góc học tập"], 2);
  assert.equal(counts["Hướng nghiệp"], 1);
  assert.ok(BLOG_CATEGORIES.includes("Tin giáo dục"));
});

test("collects unique tags in first-seen order", () => {
  const tags = getBlogTags([
    { tags: ["Toán", "Tự học"] },
    { tags: ["Tự học", "Đại học"] },
  ]);

  assert.deepEqual(tags, ["Toán", "Tự học", "Đại học"]);
});

test("finds a blog post by slug and exposes detail sections", () => {
  const post = getBlogPostBySlug("lo-trinh-on-thi-dai-hoc-cho-hoc-sinh-mat-goc");

  assert.equal(post.title, "Lộ trình ôn thi đại học cho học sinh mất gốc");
  assert.ok(post.sections.length >= 3);
  assert.ok(post.sections[0].content.length > 0);
});
