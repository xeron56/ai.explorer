import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type Post = {
  slug: string; title: string; description?: string; date: string;
  formattedDate: string; category?: string; readingTime: number;
  cover?: string; cardClassName?: string; type: "post" | "note"; content: string;
  tags: string[]; pinned?: boolean; favorite?: boolean; accent?: string;
  hideFromListings?: boolean;
  noteKind?: string; collection?: string; updated?: string; recentLabel?: string;
  liveCode?: string; liveOutput?: string;
};
export type Project = {
  slug: string; title: string; description: string; date: string; formattedDate: string;
  status: string; stars: number; tags: string[]; techStack: string[]; type: string;
  variant: string; featured: boolean; github?: string; content: string;
};
export type ResearchItem = {
  slug: string; title: string; description: string; topic: string; progress: number;
  tone: string; status: string; content: string;
};
export type ResearchPaper = {
  slug: string; title: string; authors: string; topic: string; date: string;
  formattedDate: string; status: string; content: string;
};
export type ResearchCollection = {
  slug: string; title: string; description: string; count: string; tone: string; content: string;
};
export type ResearchArea = {
  slug: string; title: string; description: string; href: string; icon: string; tone: string; order: number; content: string;
};
export type LearningResource = { label: string; icon: string };
export type LearningSeriesLink = { title: string; slug: string; icon: string; tone: string; chapters: string };
export type LearningSeries = {
  slug: string; title: string; description: string; category: string; chapterCount: number;
  difficulty: string; lastUpdated: string; formattedLastUpdated: string; totalReadTime: string;
  completed: number; icon: string; tone: string; order: number; resources: LearningResource[];
  related: LearningSeriesLink[]; content: string;
};
export type LearningChapter = {
  slug: string; series: string; order: number; title: string; description: string;
  chapterTitle: string; topicTitle: string; topicSlug: string; author: string; topicCount: number; date: string; formattedDate: string;
  readingTime: number; thumbnail: string; tone: string; bookmarked: boolean; tags: string[];
  lessons: string[]; takeaways: string[]; related: string[]; content: string;
};
export type AboutInterest = { title: string; description: string; icon: string; tone: string };
export type AboutTool = { name: string; icon: string; tone: string };
export type AboutJourney = { label: string; description: string };
export type AboutProfile = {
  slug: string; title: string; intro: string; quote: string; quoteAuthor: string; bio: string;
  location: string; focus: string; experience: string; mission: string; doing: string[];
  interests: AboutInterest[]; tools: AboutTool[]; journey: AboutJourney[]; email: string;
  github: string; content: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const NOTES_DIR = path.join(process.cwd(), "content", "notes");
const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");
const RESEARCH_DIR = path.join(process.cwd(), "content", "research");
const LEARNING_DIR = path.join(process.cwd(), "content", "learning");
const ABOUT_DIR = path.join(process.cwd(), "content", "about");

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function estimate(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 220));
}
function arrayValue(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}
function boolValue(value: unknown) {
  return value === true || value === "true";
}
function objectArray<T extends Record<string, string | number | boolean>>(value: unknown): T[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is T => typeof item === "object" && item !== null);
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
      tags: arrayValue(data.tags),
      pinned: boolValue(data.pinned),
      favorite: boolValue(data.favorite),
      hideFromListings: boolValue(data.hideFromListings),
      accent: data.accent ? String(data.accent) : undefined,
      noteKind: data.noteKind ? String(data.noteKind) : undefined,
      collection: data.collection ? String(data.collection) : undefined,
      updated: data.updated ? String(data.updated) : undefined,
      recentLabel: data.recentLabel ? String(data.recentLabel) : undefined,
      liveCode: data.liveCode ? String(data.liveCode) : undefined,
      liveOutput: data.liveOutput ? String(data.liveOutput) : undefined,
      type, content,
    } satisfies Post;
  }));
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}
async function readMdxFiles(dir: string) {
  let entries: string[] = [];
  try { entries = await fs.readdir(dir); } catch { return []; }
  const files = entries.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return Promise.all(files.map(async (file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const raw = await fs.readFile(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    return { slug, data, content };
  }));
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
export async function getAllProjects(): Promise<Project[]> {
  const projects = await Promise.all((await readMdxFiles(PROJECTS_DIR)).map(async ({ slug, data, content }) => {
    const date = String(data.date ?? new Date().toISOString().slice(0, 10));
    return {
      slug,
      title: String(data.title ?? slug),
      description: String(data.description ?? ""),
      date,
      formattedDate: formatDate(date),
      status: String(data.status ?? "Completed"),
      stars: Number(data.stars ?? 0),
      tags: arrayValue(data.tags),
      techStack: arrayValue(data.techStack),
      type: String(data.type ?? "Research"),
      variant: String(data.variant ?? "network"),
      featured: boolValue(data.featured),
      github: data.github ? String(data.github) : undefined,
      content,
    } satisfies Project;
  }));
  return projects.sort((a, b) => (a.date < b.date ? 1 : -1));
}
export async function getResearchItems(): Promise<ResearchItem[]> {
  return (await readMdxFiles(path.join(RESEARCH_DIR, "ongoing"))).map(({ slug, data, content }) => ({
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    topic: String(data.topic ?? "Deep Learning"),
    progress: Number(data.progress ?? 0),
    tone: String(data.tone ?? "purple"),
    status: String(data.status ?? "In Progress"),
    content,
  }));
}
export async function getResearchPapers(): Promise<ResearchPaper[]> {
  const papers = (await readMdxFiles(path.join(RESEARCH_DIR, "papers"))).map(({ slug, data, content }) => {
    const date = String(data.date ?? new Date().toISOString().slice(0, 10));
    return {
      slug,
      title: String(data.title ?? slug),
      authors: String(data.authors ?? ""),
      topic: String(data.topic ?? "Deep Learning"),
      date,
      formattedDate: formatDate(date),
      status: String(data.status ?? "To Read"),
      content,
    } satisfies ResearchPaper;
  });
  return papers.sort((a, b) => (a.date < b.date ? 1 : -1));
}
export async function getResearchCollections(): Promise<ResearchCollection[]> {
  return (await readMdxFiles(path.join(RESEARCH_DIR, "collections"))).map(({ slug, data, content }) => ({
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    count: String(data.count ?? "0 notes"),
    tone: String(data.tone ?? "purple"),
    content,
  }));
}
export async function getResearchAreas(): Promise<ResearchArea[]> {
  const areas = (await readMdxFiles(path.join(RESEARCH_DIR, "areas"))).map(({ slug, data, content }) => ({
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    href: String(data.href ?? `/research?topic=${encodeURIComponent(slug)}`),
    icon: String(data.icon ?? "brain"),
    tone: String(data.tone ?? "indigo"),
    order: Number(data.order ?? 999),
    content,
  } satisfies ResearchArea));
  return areas.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
export async function getLearningSeries(): Promise<LearningSeries[]> {
  const series = (await readMdxFiles(path.join(LEARNING_DIR, "series"))).map(({ slug, data, content }) => {
    const lastUpdated = String(data.lastUpdated ?? data.date ?? new Date().toISOString().slice(0, 10));
    return {
      slug,
      title: String(data.title ?? slug),
      description: String(data.description ?? ""),
      category: String(data.category ?? data.title ?? slug),
      chapterCount: Number(data.chapterCount ?? 0),
      difficulty: String(data.difficulty ?? "Beginner"),
      lastUpdated,
      formattedLastUpdated: formatDate(lastUpdated),
      totalReadTime: String(data.totalReadTime ?? ""),
      completed: Number(data.completed ?? 0),
      icon: String(data.icon ?? "network"),
      tone: String(data.tone ?? "purple"),
      order: Number(data.order ?? 999),
      resources: objectArray<LearningResource>(data.resources),
      related: objectArray<LearningSeriesLink>(data.related),
      content,
    } satisfies LearningSeries;
  });
  return series.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
export async function getLearningSeriesBySlug(slug: string) {
  return (await getLearningSeries()).find((series) => series.slug === slug) ?? null;
}
export async function getLearningChapters(seriesSlug?: string): Promise<LearningChapter[]> {
  const chapters = (await readMdxFiles(path.join(LEARNING_DIR, "chapters"))).map(({ slug, data, content }) => {
    const date = String(data.date ?? new Date().toISOString().slice(0, 10));
    return {
      slug,
      series: String(data.series ?? "deep-learning"),
      order: Number(data.order ?? 999),
      title: String(data.title ?? slug),
      description: String(data.description ?? ""),
      chapterTitle: String(data.chapterTitle ?? data.title ?? slug),
      topicTitle: String(data.topicTitle ?? data.chapterTitle ?? data.title ?? slug),
      topicSlug: String(data.topicSlug ?? slug),
      author: String(data.author ?? "MD Shahidul Islam"),
      topicCount: Number(data.topicCount ?? 0),
      date,
      formattedDate: formatDate(date),
      readingTime: data.readingTime ? Number(data.readingTime) : estimate(content),
      thumbnail: String(data.thumbnail ?? "network"),
      tone: String(data.tone ?? "purple"),
      bookmarked: boolValue(data.bookmarked),
      tags: arrayValue(data.tags),
      lessons: arrayValue(data.lessons),
      takeaways: arrayValue(data.takeaways),
      related: arrayValue(data.related),
      content,
    } satisfies LearningChapter;
  });
  return chapters
    .filter((chapter) => !seriesSlug || chapter.series === seriesSlug)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
export async function getAboutProfile(): Promise<AboutProfile | null> {
  const [profile] = await readMdxFiles(ABOUT_DIR);
  if (!profile) return null;
  const { slug, data, content } = profile;
  return {
    slug,
    title: String(data.title ?? "About ai.explorer"),
    intro: String(data.intro ?? ""),
    quote: String(data.quote ?? ""),
    quoteAuthor: String(data.quoteAuthor ?? ""),
    bio: String(data.bio ?? ""),
    location: String(data.location ?? ""),
    focus: String(data.focus ?? ""),
    experience: String(data.experience ?? ""),
    mission: String(data.mission ?? ""),
    doing: arrayValue(data.doing),
    interests: objectArray<AboutInterest>(data.interests),
    tools: objectArray<AboutTool>(data.tools),
    journey: objectArray<AboutJourney>(data.journey),
    email: String(data.email ?? "hi@ai.explorer"),
    github: String(data.github ?? "https://github.com"),
    content,
  };
}
