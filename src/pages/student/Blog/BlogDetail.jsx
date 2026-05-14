import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Compass,
  Library,
  Newspaper,
  Tag,
  Timer,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getBlogPostBySlug, getRelatedBlogPosts } from "./blogView";

const postIcons = {
  book: BookOpen,
  timer: Timer,
  news: Newspaper,
  compass: Compass,
  library: Library,
};

const DetailVisual = ({ post }) => {
  const Icon = postIcons[post.icon] || BookOpen;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br", post.accent, "min-h-[280px]")}>
      <div className="absolute inset-x-10 top-10 h-px bg-white/30" />
      <div className="absolute left-10 top-10 rounded-2xl bg-white/20 p-5 text-white backdrop-blur-sm">
        <Icon className="h-12 w-12" />
      </div>
      <div className="absolute bottom-10 left-10 right-10">
        <div className="mb-5 flex flex-wrap gap-2">
          {(post.tags || []).map((tag) => (
            <span key={tag} className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              #{tag}
            </span>
          ))}
        </div>
        <div className="h-2 w-3/4 rounded-full bg-white/70" />
        <div className="mt-3 h-2 w-1/2 rounded-full bg-white/40" />
      </div>
      <div className="absolute right-10 top-10 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
        Edu4All
      </div>
    </div>
  );
};

const BlogDetail = () => {
  const { slug } = useParams();
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16 text-slate-900">
        <Card className="mx-auto max-w-2xl border-slate-200 shadow-sm">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-black">Không tìm thấy bài viết</h1>
            <p className="mt-3 text-slate-600">Bài viết có thể đã được đổi đường dẫn hoặc không còn tồn tại.</p>
            <Link
              to="/blog"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Quay lại Blog
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const relatedPosts = getRelatedBlogPosts(post, 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/blog"
          className="mb-6 inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span>Quay lại Blog</span>
        </Link>

        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <DetailVisual post={post} />

          <div className="p-6 md:p-10">
            <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <Badge className="rounded-full bg-blue-100 text-blue-700 hover:bg-blue-100">{post.category}</Badge>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
              <span className="inline-flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-black leading-tight text-slate-950 md:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{post.excerpt}</p>

            <div className="mt-8 flex flex-wrap gap-2 border-y border-slate-100 py-4">
              {(post.tags || []).map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 space-y-8">
              {(post.sections || []).map((section) => (
                <section key={section.heading} className="max-w-3xl">
                  <h2 className="text-2xl font-black text-slate-950">{section.heading}</h2>
                  <p className="mt-3 text-base leading-8 text-slate-700">{section.content}</p>
                </section>
              ))}
            </div>
          </div>
        </article>

        {relatedPosts.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-black">Bài viết liên quan</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link key={related.id} to={`/blog/${related.slug}`} className="block">
                  <Card className="h-full border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                    <CardContent className="p-5">
                      <Badge variant="outline" className="rounded-full">{related.category}</Badge>
                      <h3 className="mt-3 text-base font-black leading-snug text-slate-950">{related.title}</h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{related.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
