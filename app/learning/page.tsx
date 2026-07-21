import Link from "next/link";
import type { ReactNode } from "react";
import {
  FiBarChart2,
  FiBookOpen,
  FiBookmark,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiFileText,
  FiGrid,
  FiLink,
  FiList,
} from "react-icons/fi";
import { HiOutlineArrowSmallRight } from "react-icons/hi2";
import {
  PiGraph,
  PiMathOperations,
  PiNetwork,
  PiTreeStructure,
} from "react-icons/pi";
import { SiPytorch, SiTensorflow } from "react-icons/si";
import {
  getLearningChapters,
  getLearningSeries,
  type LearningChapter,
  type LearningResource,
  type LearningSeries,
  type LearningSeriesLink,
} from "../_lib/posts";
import { LearningCatalogPage } from "../_components/LearningCatalogPage";

export const metadata = { title: "Learning" };

const PAGE_SIZE = 8;

type SearchParams = Promise<{
  series?: string;
  q?: string;
  page?: string;
  view?: string;
}>;

type DisplayChapter = Pick<
  LearningChapter,
  "slug" | "series" | "order" | "title" | "description" | "formattedDate" | "readingTime" | "thumbnail" | "tone" | "bookmarked"
> & {
  href?: string;
};

const FALLBACK_SYLLABI: Record<string, Array<Omit<DisplayChapter, "slug" | "series" | "formattedDate" | "bookmarked">>> = {
  "machine-learning": [
    { order: 1, title: "Machine Learning Foundations", description: "Core vocabulary, workflows, and model families.", readingTime: 8, thumbnail: "network", tone: "green" },
    { order: 2, title: "Data Preparation", description: "Cleaning, encoding, scaling, and splitting datasets.", readingTime: 10, thumbnail: "equation", tone: "green" },
    { order: 3, title: "Linear Regression", description: "Least squares, residuals, and interpretable baselines.", readingTime: 9, thumbnail: "sigmoid", tone: "blue" },
    { order: 4, title: "Classification Models", description: "Logistic regression, decision boundaries, and probabilities.", readingTime: 11, thumbnail: "layers", tone: "purple" },
    { order: 5, title: "Decision Trees", description: "Splits, impurity, pruning, and readable rules.", readingTime: 8, thumbnail: "regularization", tone: "amber" },
    { order: 6, title: "Ensemble Methods", description: "Random forests, boosting, and variance reduction.", readingTime: 12, thumbnail: "optimization", tone: "purple" },
    { order: 7, title: "Support Vector Machines", description: "Margins, kernels, and high-dimensional classifiers.", readingTime: 10, thumbnail: "sigmoid", tone: "blue" },
    { order: 8, title: "Clustering", description: "K-means, hierarchical clustering, and cluster validation.", readingTime: 9, thumbnail: "network", tone: "green" },
    { order: 9, title: "Dimensionality Reduction", description: "PCA, embeddings, and visual exploration.", readingTime: 10, thumbnail: "equation", tone: "amber" },
    { order: 10, title: "Model Evaluation", description: "Metrics, cross-validation, calibration, and error analysis.", readingTime: 12, thumbnail: "loss", tone: "rose" },
    { order: 11, title: "Feature Engineering", description: "Creating durable signals from raw business data.", readingTime: 8, thumbnail: "layers", tone: "blue" },
    { order: 12, title: "Practical ML Workflow", description: "Experiments, reproducibility, and deployment handoff.", readingTime: 10, thumbnail: "optimization", tone: "purple" },
  ],
  tensorflow: [
    { order: 1, title: "TensorFlow Setup", description: "Environment, tensors, eager execution, and project layout.", readingTime: 7, thumbnail: "network", tone: "amber" },
    { order: 2, title: "Tensor Operations", description: "Shapes, broadcasting, slicing, and numerical routines.", readingTime: 10, thumbnail: "equation", tone: "green" },
    { order: 3, title: "Keras Fundamentals", description: "Layers, models, compilation, and training APIs.", readingTime: 11, thumbnail: "layers", tone: "blue" },
    { order: 4, title: "Input Pipelines", description: "tf.data datasets, batching, caching, and prefetching.", readingTime: 9, thumbnail: "regularization", tone: "amber" },
    { order: 5, title: "Custom Training Loops", description: "GradientTape, metrics, and manual optimization.", readingTime: 13, thumbnail: "optimization", tone: "purple" },
    { order: 6, title: "Computer Vision Models", description: "Convolutional networks and image augmentation.", readingTime: 10, thumbnail: "sigmoid", tone: "blue" },
    { order: 7, title: "Sequence Models", description: "Text vectorization, RNNs, and transformer layers.", readingTime: 12, thumbnail: "network", tone: "purple" },
    { order: 8, title: "Saving Models", description: "Checkpoints, SavedModel, and model versioning.", readingTime: 8, thumbnail: "loss", tone: "rose" },
    { order: 9, title: "Serving TensorFlow", description: "Exporting, serving, and production inference basics.", readingTime: 10, thumbnail: "optimization", tone: "amber" },
    { order: 10, title: "TensorFlow Best Practices", description: "Performance, debugging, and experiment hygiene.", readingTime: 9, thumbnail: "regularization", tone: "green" },
  ],
  pytorch: [
    { order: 1, title: "PyTorch Tensors", description: "Tensor creation, shapes, devices, and operations.", readingTime: 8, thumbnail: "equation", tone: "green" },
    { order: 2, title: "Autograd", description: "Computation graphs, gradients, and detach semantics.", readingTime: 11, thumbnail: "backprop", tone: "green" },
    { order: 3, title: "Modules and Parameters", description: "nn.Module, layers, state dicts, and initialization.", readingTime: 10, thumbnail: "layers", tone: "blue" },
    { order: 4, title: "Datasets and Loaders", description: "Dataset classes, batching, workers, and transforms.", readingTime: 9, thumbnail: "network", tone: "purple" },
    { order: 5, title: "Training Loops", description: "Losses, optimizers, metrics, and validation passes.", readingTime: 12, thumbnail: "optimization", tone: "purple" },
    { order: 6, title: "CNNs in PyTorch", description: "Image models, pooling, normalization, and augmentation.", readingTime: 10, thumbnail: "sigmoid", tone: "blue" },
    { order: 7, title: "Sequence Models", description: "Embeddings, recurrent layers, and transformer blocks.", readingTime: 13, thumbnail: "network", tone: "rose" },
    { order: 8, title: "Experiment Tracking", description: "Checkpoints, logs, reproducibility, and comparisons.", readingTime: 8, thumbnail: "regularization", tone: "amber" },
    { order: 9, title: "Deployment Patterns", description: "TorchScript, ONNX, inference, and serving choices.", readingTime: 10, thumbnail: "loss", tone: "rose" },
  ],
};

const FALLBACK_SERIES_META: Record<string, Pick<LearningSeries, "title" | "description" | "category" | "chapterCount" | "difficulty" | "totalReadTime" | "completed" | "icon" | "tone" | "order">> = {
  "mathematics-for-ml": {
    title: "Mathematics for ML",
    description: "Essential mathematics for machine learning, covering linear algebra, calculus, probability, and optimization.",
    category: "Mathematics",
    chapterCount: 16,
    difficulty: "Beginner to Intermediate",
    totalReadTime: "2h 45m",
    completed: 5,
    icon: "network",
    tone: "purple",
    order: 5,
  },
  "statistics-probability": {
    title: "Statistics & Probability",
    description: "Probability distributions, inference, hypothesis testing, regression, and uncertainty for applied ML.",
    category: "Mathematics",
    chapterCount: 13,
    difficulty: "Beginner to Intermediate",
    totalReadTime: "2h 25m",
    completed: 3,
    icon: "cube",
    tone: "green",
    order: 6,
  },
  "data-science-fundamentals": {
    title: "Data Science Fundamentals",
    description: "Data analysis, visualization, preprocessing, and practical workflows for turning data into evidence.",
    category: "Data Science",
    chapterCount: 11,
    difficulty: "Beginner to Intermediate",
    totalReadTime: "2h 00m",
    completed: 2,
    icon: "cube",
    tone: "green",
    order: 7,
  },
  "natural-language-processing": {
    title: "Natural Language Processing",
    description: "Text processing, embeddings, sequence models, transformers, and practical language model workflows.",
    category: "NLP",
    chapterCount: 20,
    difficulty: "Intermediate to Advanced",
    totalReadTime: "3h 30m",
    completed: 1,
    icon: "network",
    tone: "purple",
    order: 8,
  },
  "computer-vision": {
    title: "Computer Vision",
    description: "Image processing, convolutional networks, object detection, segmentation, and visual model evaluation.",
    category: "Computer Vision",
    chapterCount: 17,
    difficulty: "Intermediate to Advanced",
    totalReadTime: "2h 50m",
    completed: 0,
    icon: "network",
    tone: "purple",
    order: 9,
  },
  "reinforcement-learning": {
    title: "Reinforcement Learning",
    description: "Agents, environments, rewards, value functions, policy gradients, and practical RL algorithms.",
    category: "Others",
    chapterCount: 12,
    difficulty: "Intermediate to Advanced",
    totalReadTime: "1h 55m",
    completed: 1,
    icon: "cube",
    tone: "green",
    order: 10,
  },
  mlops: {
    title: "MLOps",
    description: "Deploy, monitor, version, and scale machine learning systems in production environments.",
    category: "Others",
    chapterCount: 10,
    difficulty: "Intermediate to Advanced",
    totalReadTime: "1h 45m",
    completed: 0,
    icon: "tensorflow",
    tone: "amber",
    order: 11,
  },
};

export default async function LearningPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  if (!params.series) {
    return <LearningCatalogPage initialQuery={params.q ?? ""} />;
  }

  const [seriesItems, chapterItems] = await Promise.all([getLearningSeries(), getLearningChapters()]);
  const requestedSeries = params.series;
  const selectedSeries =
    seriesItems.find((item) => item.slug === requestedSeries) ??
    fallbackSeries(requestedSeries);

  const query = (params.q ?? "").trim().toLowerCase();
  const view = params.view === "bookmarks" ? "bookmarks" : "all";
  const currentPage = Math.max(1, Number(params.page ?? 1) || 1);
  const chapters = getDisplayChapters(selectedSeries, chapterItems);
  const filteredChapters = chapters.filter((chapter) => {
    if (view === "bookmarks" && !chapter.bookmarked) return false;
    if (!query) return true;
    return [chapter.title, chapter.description].some((value) => value.toLowerCase().includes(query));
  });
  const totalPages = Math.max(1, Math.ceil(filteredChapters.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleChapters = filteredChapters.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const firstChapterHref = chapters[0]?.href ?? seriesPath(selectedSeries.slug);
  const completed = Math.min(selectedSeries.completed, chapters.length);
  const progress = chapters.length ? Math.round((completed / chapters.length) * 100) : 0;

  return (
    <div className="pb-10 pt-[38px]">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_336px]">
        <section className="min-w-0">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#69758f]">
            <Link href="/learning" className="transition-colors hover:text-[#5b35f4]">Learning</Link>
            <span>/</span>
            <span>{selectedSeries.title}</span>
          </div>

          <header className="mt-[34px] flex flex-col gap-5 border-b border-[#e7ebf3] pb-[44px] md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 flex-col gap-5 md:flex-row md:items-center">
              <div className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-[8px] bg-[linear-gradient(135deg,#704cff_0%,#5734f4_100%)] text-[44px] text-white shadow-[0_18px_34px_rgba(91,53,244,0.2)]">
                <SeriesIcon icon={selectedSeries.icon} />
              </div>
              <div className="min-w-0">
                <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.035em] text-[#10172d] dark:text-[var(--color-fg)] md:text-[38px]">
                  {selectedSeries.title}
                </h1>
                <p className="mt-3 max-w-[720px] text-[14px] font-medium leading-6 text-[#5c6881]">
                  {selectedSeries.description}
                </p>
              </div>
            </div>

            <Link
              href={firstChapterHref}
              className="inline-flex h-[42px] w-fit items-center justify-center gap-2 rounded-[8px] border border-[#d8d2ff] px-5 text-[13px] font-bold text-[#5b35f4] transition-colors hover:bg-[#f4f1ff]"
            >
              <FiBookmark className="h-4 w-4" />
              Follow
            </Link>
          </header>

          <div className="mt-[25px] flex flex-wrap items-center gap-x-8 gap-y-3 text-[13px] font-semibold text-[#64708a]">
            <MetaItem icon={<FiBookOpen />}>{chapters.length} Chapters</MetaItem>
            <MetaItem icon={<FiBarChart2 />}>{selectedSeries.difficulty}</MetaItem>
            <MetaItem icon={<FiCalendar />}>Last updated: {selectedSeries.formattedLastUpdated}</MetaItem>
          </div>

          <nav className="mt-[47px] flex flex-wrap gap-6 border-b border-[#e7ebf3] pb-4">
            <TabLink href={withParams(selectedSeries.slug)} active={view === "all"} icon={<FiGrid />}>All Chapters</TabLink>
            <TabLink href={`${withParams(selectedSeries.slug)}#chapter-list`} active={false} icon={<FiList />}>By Category</TabLink>
            <TabLink href={withParams(selectedSeries.slug, { view: "bookmarks" })} active={view === "bookmarks"} icon={<FiBookmark />}>Bookmarks</TabLink>
          </nav>

          <div id="chapter-list" className="mt-[26px] grid gap-4">
            {visibleChapters.length ? (
              visibleChapters.map((chapter) => (
                <ChapterCard key={chapter.slug} chapter={chapter} />
              ))
            ) : (
              <div className="rounded-[8px] border border-[#e6eaf2] bg-white p-8 text-center text-[14px] font-semibold text-[#66718a] dark:bg-[var(--color-bg)]">
                No chapters match this filter.
              </div>
            )}
          </div>

          <Pagination page={safePage} totalPages={totalPages} seriesSlug={selectedSeries.slug} view={view} query={params.q} />

          <div className="mt-[35px] flex flex-col gap-4 rounded-[8px] border border-[#ded8ff] bg-[linear-gradient(90deg,#f3efff_0%,#fbf9ff_100%)] px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#ece6ff] text-[26px] text-[#6547ff]">
                <PiMathOperations />
              </span>
              <div>
                <h2 className="text-[18px] font-extrabold tracking-[-0.025em] text-[#17213b]">New to {selectedSeries.title}?</h2>
                <p className="mt-1 text-[13px] font-medium text-[#66718a]">Start from the beginning and build a strong foundation.</p>
              </div>
            </div>
            <Link
              href={firstChapterHref}
              className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[8px] border border-[#9f8cff] bg-white px-5 text-[13px] font-bold text-[#5b35f4] transition-colors hover:bg-[#f7f4ff]"
            >
              Start Chapter 1 <HiOutlineArrowSmallRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <aside className="space-y-6 xl:sticky xl:top-[114px] xl:self-start">
          <SideCard title="Series Overview">
            <MiniChart />
            <div className="mt-6 space-y-4 text-[13px]">
              <InfoRow label="Total Chapters" value={String(chapters.length)} />
              <InfoRow label="Total Read Time" value={selectedSeries.totalReadTime || formatMinutes(sumReadTime(chapters))} />
              <InfoRow label="Difficulty" value={selectedSeries.difficulty} />
              <InfoRow label="Last Updated" value={selectedSeries.formattedLastUpdated} />
            </div>
          </SideCard>

          <SideCard title="Chapters">
            <div className="space-y-1">
              {chapters.map((chapter, index) => (
                <ChapterMiniLink key={chapter.slug} chapter={chapter} active={index === 0} />
              ))}
            </div>
          </SideCard>

          <SideCard title="Resources">
            <div className="space-y-3">
              {resourceItems(selectedSeries.resources).map((resource) => (
                <div key={resource.label} className="flex items-center gap-3 text-[13px] font-semibold text-[#64708a]">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-[5px] ${resource.tint}`}>
                    {resource.icon}
                  </span>
                  <span>{resource.label}</span>
                </div>
              ))}
            </div>
          </SideCard>

          <SideCard title="Your Progress">
            <div className="flex items-center justify-between text-[13px] font-semibold text-[#64708a]">
              <span>{completed} / {chapters.length} chapters completed</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-4 h-[7px] overflow-hidden rounded-full bg-[#e6e8ef]">
              <div className="h-full rounded-full bg-[#6547ff]" style={{ width: `${progress}%` }} />
            </div>
            <Link
              href={firstChapterHref}
              className="mt-6 inline-flex h-[42px] w-full items-center justify-center rounded-[8px] bg-[linear-gradient(90deg,#6547ff,#4d31ee)] text-[13px] font-bold text-white shadow-[0_14px_28px_rgba(101,71,255,0.24)]"
            >
              Continue Learning
            </Link>
            <div className="mt-4 flex items-center justify-center gap-2 text-[13px] font-semibold text-[#5c6680]">
              <FiBarChart2 className="h-4 w-4" /> View Progress Analytics
            </div>
          </SideCard>

          <SideCard title="Related Series">
            <div className="space-y-3">
              {relatedItems(selectedSeries, seriesItems).map((item) => (
                <RelatedSeriesLink key={item.slug} item={item} />
              ))}
            </div>
          </SideCard>
        </aside>
      </div>
    </div>
  );
}

function getDisplayChapters(series: LearningSeries, chapters: LearningChapter[]): DisplayChapter[] {
  const realChapters = chapters
    .filter((chapter) => chapter.series === series.slug)
    .map((chapter) => ({ ...chapter, href: `/learning/${chapter.slug}` }));

  if (realChapters.length) return realChapters;

  return (FALLBACK_SYLLABI[series.slug] ?? genericSyllabus(series)).map((chapter) => ({
    ...chapter,
    slug: `${series.slug}-${chapter.order}`,
    series: series.slug,
    formattedDate: series.formattedLastUpdated,
    bookmarked: chapter.order <= Math.max(1, Math.min(3, series.completed)),
  }));
}

function fallbackSeries(slug: string): LearningSeries {
  const meta = FALLBACK_SERIES_META[slug] ?? {
    title: titleFromSlug(slug),
    description: `A practical learning path covering the fundamentals and applied workflows for ${titleFromSlug(slug)}.`,
    category: titleFromSlug(slug),
    chapterCount: 8,
    difficulty: "Beginner to Intermediate",
    totalReadTime: "1h 20m",
    completed: 0,
    icon: "network",
    tone: "purple",
    order: 999,
  };

  return {
    ...meta,
    slug,
    lastUpdated: "2024-05-16",
    formattedLastUpdated: "May 16, 2024",
    resources: [],
    related: [],
    content: "",
  };
}

function genericSyllabus(series: LearningSeries): Array<Omit<DisplayChapter, "slug" | "series" | "formattedDate" | "bookmarked">> {
  const topics = [
    ["Foundations", "Core ideas, vocabulary, and the mental model for the topic."],
    ["Mathematical Intuition", "The key math and assumptions needed to reason about the methods."],
    ["Data and Problem Setup", "How to prepare inputs, targets, constraints, and evaluation plans."],
    ["Baseline Methods", "Simple models and reference approaches before adding complexity."],
    ["Advanced Techniques", "More capable methods, tradeoffs, and when to use them."],
    ["Evaluation", "Metrics, validation patterns, and error analysis."],
    ["Practical Workflow", "Implementation habits, debugging, and reproducible experiments."],
    ["Deployment & Best Practices", "Production considerations, monitoring, and next steps."],
  ];

  return topics.slice(0, Math.max(1, Math.min(series.chapterCount, topics.length))).map(([title, description], index) => ({
    order: index + 1,
    title: `${series.title} ${title}`,
    description,
    readingTime: 10 + (index % 4),
    thumbnail: ["network", "equation", "layers", "optimization"][index % 4],
    tone: ["purple", "green", "blue", "amber"][index % 4],
  }));
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ChapterCard({ chapter }: { chapter: DisplayChapter }) {
  const body = (
    <>
      <ChapterVisual type={chapter.thumbnail} tone={chapter.tone} />
      <div className="min-w-0">
        <h2 className="text-[18px] font-extrabold leading-snug tracking-[-0.02em] text-[#14203a] dark:text-[var(--color-fg)]">
          <span className="text-[#4f35f2]">{String(chapter.order).padStart(2, "0")}.</span> {chapter.title}
        </h2>
        <p className="mt-2 max-w-[560px] text-[14px] font-medium leading-6 text-[#5c6881]">
          {chapter.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] font-medium text-[#64708a]">
          <span>{chapter.formattedDate}</span>
          <span>•</span>
          <span>{chapter.readingTime} min read</span>
        </div>
      </div>
      <div className="ml-auto hidden items-center gap-7 text-[#40506e] md:flex">
        <FiBookmark className="h-5 w-5" />
        <HiOutlineArrowSmallRight className="h-5 w-5" />
      </div>
    </>
  );

  const className =
    "grid min-h-[148px] w-full grid-cols-1 gap-5 rounded-[8px] border border-[#e4e8f1] bg-white p-4 text-left shadow-[0_16px_34px_rgba(15,23,42,0.025)] transition-colors hover:border-[#d5ceff] dark:bg-[var(--color-bg)] md:grid-cols-[184px_minmax(0,1fr)_96px] md:items-center";

  if (!chapter.href) {
    return <div id={`chapter-${chapter.order}`} className={className}>{body}</div>;
  }

  return (
    <Link href={chapter.href} id={`chapter-${chapter.order}`} className={className}>
      {body}
    </Link>
  );
}

function ChapterVisual({ type, tone }: { type: string; tone: string }) {
  const colors = visualColors(tone);

  return (
    <div className={`relative h-[118px] overflow-hidden rounded-[8px] border ${colors.border} ${colors.bg}`}>
      {type === "equation" ? (
        <div className="flex h-full flex-col justify-center px-7 text-[#5e8274]">
          <div className="text-[18px] italic">σ(x) = 1 / 1 + e^-x</div>
          <div className="mt-4 text-[16px] italic">Σ xᵢ</div>
        </div>
      ) : type === "sigmoid" ? (
        <svg viewBox="0 0 180 116" className="h-full w-full">
          <path d="M20 86 C56 88 58 32 94 58 C122 77 128 22 160 24" fill="none" stroke={colors.stroke} strokeWidth="4" />
          <path d="M22 90 H162 M24 18 V92" stroke="#c9cedc" strokeWidth="1.5" />
        </svg>
      ) : type === "layers" ? (
        <div className="flex h-full items-center justify-center gap-4">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex h-14 w-14 items-center justify-center rounded-[6px] border border-[#b9cdf3] bg-[#eef6ff] text-[20px] text-[#6091dd]">
              <PiNetwork />
            </div>
          ))}
        </div>
      ) : type === "loss" ? (
        <div className="flex h-full items-center px-7 text-[22px] italic text-[#627086]">
          L = -Σ y log(ŷ)
        </div>
      ) : type === "optimization" ? (
        <svg viewBox="0 0 180 116" className="h-full w-full">
          {[20, 36, 52, 68, 84].map((radius) => (
            <ellipse key={radius} cx="88" cy="58" rx={radius} ry={radius / 1.7} fill="none" stroke="#d8ccff" strokeWidth="1.4" />
          ))}
          <path d="M112 30 L89 55 L104 55 L76 88" fill="none" stroke={colors.stroke} strokeWidth="3" />
          <circle cx="88" cy="58" r="4" fill={colors.stroke} />
        </svg>
      ) : type === "backprop" ? (
        <svg viewBox="0 0 180 116" className="h-full w-full">
          {[34, 82, 130].map((x) => (
            <g key={x}>
              <circle cx={x} cy="34" r="8" fill="#dff7ec" stroke="#8ccbb0" />
              <circle cx={x} cy="78" r="8" fill="#dff7ec" stroke="#8ccbb0" />
            </g>
          ))}
          <path d="M42 34 L74 34 M42 78 L74 78 M90 34 L122 34 M90 78 L122 78 M42 34 L74 78 M42 78 L74 34 M90 34 L122 78 M90 78 L122 34" stroke="#8ccbb0" strokeWidth="1.6" />
        </svg>
      ) : (
        <svg viewBox="0 0 180 116" className="h-full w-full">
          {[
            [35, 32], [66, 25], [98, 42], [131, 30], [51, 72], [91, 80], [130, 70],
          ].map(([x, y], index) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="4" fill={colors.stroke} />
              {index > 0 ? <line x1={x} y1={y} x2={index % 2 ? 91 : 66} y2={index % 2 ? 80 : 25} stroke="#cfc6fb" strokeWidth="1.5" /> : null}
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}

function SideCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[8px] border border-[#e3e7f0] bg-white p-5 shadow-[0_16px_34px_rgba(15,23,42,0.025)] dark:bg-[var(--color-bg)]">
      <h3 className="text-[16px] font-extrabold tracking-[-0.02em] text-[#17213b] dark:text-[var(--color-fg)]">{title}</h3>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function ChapterMiniLink({ chapter, active }: { chapter: DisplayChapter; active: boolean }) {
  const className = `grid grid-cols-[20px_minmax(0,1fr)_42px] items-center gap-2 rounded-[6px] px-2 py-2 text-[12px] font-semibold transition-colors ${
    active ? "bg-[#f2efff] text-[#5b35f4] shadow-[inset_3px_0_0_#6547ff]" : "text-[#5f6b84] hover:bg-[#f7f8fc]"
  }`;
  const content = (
    <>
      <span>{chapter.order}.</span>
      <span className="truncate">{chapter.title}</span>
      <span className="text-right text-[11px] font-medium text-[#8172dd]">{chapter.readingTime} min</span>
    </>
  );

  if (!chapter.href) return <div className={className}>{content}</div>;
  return <Link href={chapter.href} className={className}>{content}</Link>;
}

function RelatedSeriesLink({ item }: { item: LearningSeriesLink }) {
  return (
    <Link href={seriesPath(item.slug)} className="grid grid-cols-[38px_minmax(0,1fr)_18px] items-center gap-3 rounded-[8px] py-1.5 text-[#17213b] transition-colors hover:bg-[#f7f8fc]">
      <span className={`flex h-9 w-9 items-center justify-center rounded-[8px] ${relatedTint(item.tone)}`}>
        <SeriesIcon icon={item.icon} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-bold">{item.title}</span>
        <span className="mt-0.5 block text-[12px] font-medium text-[#6b768e]">{item.chapters}</span>
      </span>
      <HiOutlineArrowSmallRight className="h-4 w-4 text-[#58647d]" />
    </Link>
  );
}

function Pagination({
  page,
  totalPages,
  seriesSlug,
  view,
  query,
}: {
  page: number;
  totalPages: number;
  seriesSlug: string;
  view: string;
  query?: string;
}) {
  if (totalPages <= 1) return null;
  const items = pageItems(page, totalPages);

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <PageLink disabled={page === 1} href={withParams(seriesSlug, { page: page - 1, view, q: query })}>
        <FiChevronLeft />
      </PageLink>
      {items.map((item, index) =>
        item === "..." ? (
          <span key={`ellipsis-${index}`} className="flex h-9 min-w-9 items-center justify-center rounded-[8px] border border-[#e4e8f1] bg-white px-3 text-[13px] font-semibold text-[#8b96ac]">...</span>
        ) : (
          <PageLink key={item} active={page === item} href={withParams(seriesSlug, { page: item as number, view, q: query })}>
            {item}
          </PageLink>
        ),
      )}
      <PageLink disabled={page === totalPages} href={withParams(seriesSlug, { page: page + 1, view, q: query })}>
        <FiChevronRight />
      </PageLink>
    </div>
  );
}

function PageLink({
  href,
  active = false,
  disabled = false,
  children,
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
}) {
  const className = `flex h-9 min-w-9 items-center justify-center rounded-[8px] border px-3 text-[13px] font-bold ${
    active
      ? "border-[#6547ff] bg-[#6547ff] text-white"
      : "border-[#e4e8f1] bg-white text-[#5f6b84] hover:border-[#cfc7ff] hover:text-[#4f35f2]"
  } ${disabled ? "pointer-events-none opacity-45" : ""}`;

  return <Link href={href} aria-disabled={disabled} className={className}>{children}</Link>;
}

function TabLink({ href, active, icon, children }: { href: string; active: boolean; icon: ReactNode; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`inline-flex h-9 items-center gap-2 rounded-[7px] px-3 text-[13px] font-bold transition-colors ${
        active ? "bg-[#f1eeff] text-[#5b35f4]" : "text-[#56627a] hover:bg-[#f7f8fc] hover:text-[#263148]"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}

function MetaItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-[#7f8ca6]">{icon}</span>
      {children}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-semibold text-[#6b768e]">{label}</span>
      <span className="text-right font-extrabold text-[#17213b] dark:text-[var(--color-fg)]">{value}</span>
    </div>
  );
}

function MiniChart() {
  return (
    <svg viewBox="0 0 260 106" className="h-[106px] w-full">
      <defs>
        <linearGradient id="seriesChartFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7a5cff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#7a5cff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M14 76 L34 58 L55 66 L78 64 L102 61 L125 50 L148 42 L171 49 L194 30 L216 18 L238 26 L238 92 L14 92 Z" fill="url(#seriesChartFill)" />
      <path d="M14 76 L34 58 L55 66 L78 64 L102 61 L125 50 L148 42 L171 49 L194 30 L216 18 L238 26" fill="none" stroke="#6547ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {[14, 34, 55, 78, 102, 125, 148, 171, 194, 216, 238].map((x, index) => (
        <circle key={x} cx={x} cy={[76, 58, 66, 64, 61, 50, 42, 49, 30, 18, 26][index]} r="3.5" fill="#fff" stroke="#6547ff" strokeWidth="2" />
      ))}
    </svg>
  );
}

function SeriesIcon({ icon }: { icon: string }) {
  if (icon === "cube") return <PiTreeStructure />;
  if (icon === "tensorflow") return <SiTensorflow />;
  if (icon === "flame") return <SiPytorch />;
  return <PiGraph />;
}

function resourceItems(resources: LearningResource[]) {
  const fallback = resources.length
    ? resources
    : [
      { label: "Cheatsheet (PDF)", icon: "pdf" },
      { label: "Formula Sheet", icon: "formula" },
      { label: "Recommended Books", icon: "book" },
      { label: "Useful Links", icon: "link" },
    ];

  return fallback.map((resource) => ({
    label: resource.label,
    icon: resourceIcon(resource.icon),
    tint: resourceTint(resource.icon),
  }));
}

function relatedItems(series: LearningSeries, allSeries: LearningSeries[]): LearningSeriesLink[] {
  if (series.related.length) return series.related;
  return allSeries
    .filter((item) => item.slug !== series.slug)
    .slice(0, 3)
    .map((item) => ({
      title: item.title,
      slug: item.slug,
      icon: item.icon,
      tone: item.tone,
      chapters: `${item.chapterCount} chapters`,
    }));
}

function resourceIcon(icon: string) {
  if (icon === "pdf") return <FiFileText className="h-3.5 w-3.5" />;
  if (icon === "formula") return <PiMathOperations className="h-3.5 w-3.5" />;
  if (icon === "book") return <FiBookOpen className="h-3.5 w-3.5" />;
  return <FiLink className="h-3.5 w-3.5" />;
}

function resourceTint(icon: string) {
  if (icon === "pdf") return "bg-[#fff0f4] text-[#f04d76]";
  if (icon === "formula") return "bg-[#eef5ff] text-[#4284f4]";
  if (icon === "book") return "bg-[#f0efff] text-[#6547ff]";
  return "bg-[#f3f5fa] text-[#65718a]";
}

function visualColors(tone: string) {
  if (tone === "green") return { bg: "bg-[#effaf5]", border: "border-[#d8f0e4]", stroke: "#35a978" };
  if (tone === "blue") return { bg: "bg-[#edf6ff]", border: "border-[#dbeafa]", stroke: "#5794e8" };
  if (tone === "amber") return { bg: "bg-[#fff7eb]", border: "border-[#f4e5c9]", stroke: "#e69a33" };
  if (tone === "rose") return { bg: "bg-[#fff1f5]", border: "border-[#f2d7e1]", stroke: "#df6385" };
  return { bg: "bg-[#f5f2ff]", border: "border-[#e5ddff]", stroke: "#6547ff" };
}

function relatedTint(tone: string) {
  if (tone === "green") return "bg-[#e9fbf4] text-[#22a973]";
  if (tone === "amber") return "bg-[#fff3e8] text-[#f08a20]";
  if (tone === "red") return "bg-[#fff0eb] text-[#f05f42]";
  return "bg-[#f0edff] text-[#6547ff]";
}

function sumReadTime(chapters: DisplayChapter[]) {
  return chapters.reduce((sum, chapter) => sum + chapter.readingTime, 0);
}

function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (!hours) return `${minutes}m`;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function pageItems(page: number, totalPages: number) {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (page <= 3) return [1, 2, 3, "...", totalPages];
  if (page >= totalPages - 2) return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  return [1, page, page + 1, "...", totalPages];
}

function seriesPath(slug: string) {
  return `/learning?series=${encodeURIComponent(slug)}`;
}

function withParams(seriesSlug: string, extra?: { page?: number; view?: string; q?: string }) {
  const params = new URLSearchParams({ series: seriesSlug });
  if (extra?.view && extra.view !== "all") params.set("view", extra.view);
  if (extra?.q) params.set("q", extra.q);
  if (extra?.page && extra.page > 1) params.set("page", String(extra.page));
  return `/learning?${params.toString()}`;
}
