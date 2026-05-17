import { Suspense } from "react";
import { getAllPosts } from "../_lib/posts";
import { BlogPostGrid } from "../_components/BlogPostGrid";

export const metadata = { title: "Blog" };

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-5xl pb-16 pt-10">
      <h1 className="text-4xl font-extrabold tracking-tight">Blog</h1>
      <Suspense fallback={null}>
        <BlogPostGrid posts={posts} />
      </Suspense>
    </div>
  );
}
