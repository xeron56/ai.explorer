import { FinanceBlogHome } from "./_components/FinanceBlogHome";
import { buildHomeArticles } from "./_lib/homeArticles";
import { getAllPosts } from "./_lib/posts";

export default async function HomePage() {
  const posts = await getAllPosts();
  return <FinanceBlogHome articles={buildHomeArticles(posts)} />;
}
