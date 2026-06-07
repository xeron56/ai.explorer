import { FinanceBlogHome } from "../_components/FinanceBlogHome";
import { buildHomeArticles } from "../_lib/homeArticles";
import { getAllPosts } from "../_lib/posts";

export const metadata = { title: "Blog" };

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const posts = await getAllPosts();
  return <FinanceBlogHome query={q} articles={buildHomeArticles(posts)} />;
}
