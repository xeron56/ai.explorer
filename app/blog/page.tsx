import { FinanceBlogHome } from "../_components/FinanceBlogHome";

export const metadata = { title: "Blog" };

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <FinanceBlogHome query={q} />;
}
