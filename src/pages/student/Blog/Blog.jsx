import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Compass,
  Library,
  Newspaper,
  Search,
  Tag,
  Timer,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  BLOG_CATEGORIES,
  BLOG_POSTS,
  filterBlogPosts,
  getBlogCategoryCounts,
  getBlogTags,
} from "./blogView";

const postIcons = {
  book: BookOpen,
  timer: Timer,
  news: Newspaper,
  compass: Compass,
  library: Library,
};

const PostVisual = ({ post, featured = false }) => {
  const Icon = postIcons[post.icon] || BookOpen;

  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br", post.accent, featured ? "h-72" : "h-44")}>
      <div className="absolute inset-x-8 top-8 h-px bg-white/30" />
      <div className="absolute left-8 top-8 rounded-2xl bg-white/20 p-4 text-white backdrop-blur-sm">
        <Icon className={featured ? "h-10 w-10" : "h-7 w-7"} />
      </div>
      <div className="absolute bottom-7 left-8 right-8">
        <div className="mb-4 flex gap-2">
          {(post.tags || []).slice(0, featured ? 3 : 2).map((tag) => (
            <span key={tag} className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              #{tag}
            </span>
          ))}
        </div>
        <div className="h-2 w-3/4 rounded-full bg-white/70" />
        <div className="mt-3 h-2 w-1/2 rounded-full bg-white/40" />
      </div>
      <div className="absolute right-8 top-8 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
        Edu4All
      </div>
    </div>
  );
};

const Blog = () => {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");

  const featuredPost = BLOG_POSTS.find((post) => post.featured) || BLOG_POSTS[0];
  const regularPosts = BLOG_POSTS.filter((post) => post.id !== featuredPost.id);
  const filteredPosts = useMemo(
    () => filterBlogPosts(regularPosts, { keyword, category }),
    [category, keyword, regularPosts],
  );
  const categoryCounts = useMemo(() => getBlogCategoryCounts(BLOG_POSTS), []);
  const tags = useMemo(() => getBlogTags(BLOG_POSTS).slice(0, 8), []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-blue-50 text-blue-700 hover:bg-blue-50">Blog Edu4All</Badge>
          <h1 className="text-4xl font-black tracking-tight md:text-5xl">Blog & Tin tức</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Cập nhật kinh nghiệm học tập, thông tin tuyển sinh và định hướng nghề nghiệp cho học sinh.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <main className="space-y-8">
          <Card className="overflow-hidden border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
              <PostVisual post={featuredPost} featured />
              <CardContent className="flex flex-col justify-center p-6 md:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Nổi bật</Badge>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <h2 className="text-2xl font-black leading-tight text-slate-950 md:text-3xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 leading-7 text-slate-600">{featuredPost.excerpt}</p>
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="mt-6 inline-flex w-fit items-center justify-center gap-2 whitespace-nowrap rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <span>Đọc tiếp</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </Link>
              </CardContent>
            </div>
          </Card>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black">Bài viết mới</h2>
              <p className="mt-1 text-sm text-slate-500">{filteredPosts.length} bài viết phù hợp</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={category === "all" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setCategory("all")}
              >
                Tất cả
              </Button>
              {BLOG_CATEGORIES.slice(0, 3).map((item) => (
                <Button
                  key={item}
                  variant={category === item ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setCategory(item)}
                >
                  {item}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="block">
                <Card className="overflow-hidden border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <PostVisual post={post} />
                  <CardContent className="p-5">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      <Badge variant="outline" className="rounded-full">
                        {post.category}
                      </Badge>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="min-h-14 text-lg font-black leading-snug text-slate-950">{post.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                    <div className="mt-5 flex items-center justify-between border-t pt-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                          <User className="h-3.5 w-3.5" />
                        </span>
                        {post.author}
                      </span>
                      <span>{post.date}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 ? (
            <Card className="border-dashed border-slate-300 shadow-none">
              <CardContent className="p-10 text-center text-slate-500">Không tìm thấy bài viết phù hợp.</CardContent>
            </Card>
          ) : null}
        </main>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-black">Tìm kiếm</h3>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Nhập từ khóa..."
                  className="rounded-full pl-9"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-black">Danh mục</h3>
              <div className="mt-4 divide-y divide-slate-100">
                {[["all", "Tất cả"], ...BLOG_CATEGORIES.map((item) => [item, item])].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCategory(value)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2 py-3 text-left text-sm transition",
                      category === value ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    <span>{label}</span>
                    <Badge variant="secondary" className="rounded-full">
                      {categoryCounts[value] || 0}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <h3 className="font-black">Tags phổ biến</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setKeyword(tag)}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
};

export default Blog;
