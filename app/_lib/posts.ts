import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type Post = {
  slug: string; title: string; description?: string; date: string;
  formattedDate: string; category?: string; readingTime: number;
  cover?: string; cardClassName?: string; type: "post" | "note"; content: string;
};
const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const NOTES_DIR = path.join(process.cwd(), "content", "notes");

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function estimate(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));
}
async function readDir(dir: string, type: "post" | "note"): Promise<Post[]> {
  let entries: string[] = [];
  try { entries = await fs.readdir(dir); } catch { return []; }
  const files = entries.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const posts = await Promise.all(files.map(async (file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const raw = await fs.readFile(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    const date = String(data.date ?? new Date().toISOString().slice(0, 10));
    return {
      slug, title: String(data.title ?? slug),
      description: data.description ? String(data.description) : undefined,
      date, formattedDate: formatDate(date),
      category: data.category ? String(data.category) : undefined,
      readingTime: data.readingTime ? Number(data.readingTime) : estimate(content),
      cover: data.cover ? String(data.cover) : undefined,
      cardClassName: data.cardClassName ? String(data.cardClassName) : undefined,
      type, content,
    } satisfies Post;
  }));
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
export const getAllPosts = () => readDir(POSTS_DIR, "post");
export const getAllNotes = () => readDir(NOTES_DIR, "note");
export async function getPost(slug: string) { return (await getAllPosts()).find((p) => p.slug === slug) ?? null; }
export async function getNote(slug: string) { return (await getAllNotes()).find((p) => p.slug === slug) ?? null; }
export async function getCategoryCounts() {
  const counts = new Map<string, number>();
  for (const p of await getAllPosts()) {
    if (!p.category) continue;
    counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  }
  return counts;
}
