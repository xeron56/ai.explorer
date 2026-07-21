"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { FiChevronDown, FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { HiOutlineArrowSmallRight } from "react-icons/hi2";
import {
  PiBookmarkSimple,
  PiBookOpenText,
  PiBooks,
  PiCertificate,
  PiChartBar,
  PiCheckCircle,
  PiClock,
  PiGraduationCap,
  PiMapTrifold,
  PiMathOperations,
  PiNotebook,
  PiRocketLaunch,
  PiSparkle,
} from "react-icons/pi";
import { TbAdjustmentsHorizontal, TbCategory, TbChartBarPopular, TbFilterBolt } from "react-icons/tb";

type Topic = {
  slug: string;
  title: string;
  description: string;
  chapters: number;
  completed: number;
  difficulty: string;
  category: string;
  readMinutes: number;
  bookmarked: boolean;
  completedTopic: boolean;
  icon: string;
  popularity: number;
};

const TOPICS: Topic[] = [
  {
    slug: "deep-learning",
    title: "Deep Learning",
    description: "Learn the foundations and advanced concepts of deep learning from scratch.",
    chapters: 15,
    completed: 3,
    difficulty: "Beginner to Advanced",
    category: "Deep Learning",
    readMinutes: 165,
    bookmarked: true,
    completedTopic: true,
    icon: "/learning-icons/deep-learning.png",
    popularity: 100,
  },
  {
    slug: "machine-learning",
    title: "Machine Learning",
    description: "Explore ML algorithms, models, evaluation techniques and real-world applications.",
    chapters: 18,
    completed: 6,
    difficulty: "Beginner to Advanced",
    category: "Machine Learning",
    readMinutes: 180,
    bookmarked: true,
    completedTopic: true,
    icon: "/learning-icons/machine-learning.png",
    popularity: 96,
  },
  {
    slug: "tensorflow",
    title: "TensorFlow",
    description: "Build and train ML and deep learning models using TensorFlow.",
    chapters: 14,
    completed: 2,
    difficulty: "Beginner to Advanced",
    category: "Deep Learning",
    readMinutes: 150,
    bookmarked: false,
    completedTopic: false,
    icon: "/learning-icons/tensorflow.png",
    popularity: 90,
  },
  {
    slug: "pytorch",
    title: "PyTorch",
    description: "Learn PyTorch fundamentals and build neural networks with ease.",
    chapters: 12,
    completed: 4,
    difficulty: "Beginner to Advanced",
    category: "Deep Learning",
    readMinutes: 140,
    bookmarked: true,
    completedTopic: true,
    icon: "/learning-icons/pytorch.png",
    popularity: 88,
  },
  {
    slug: "cnn",
    title: "CNN",
    description: "Convolutional Neural Networks from first principles, convolution math, training, evaluation, and optimization.",
    chapters: 11,
    completed: 0,
    difficulty: "Beginner to Advanced",
    category: "Computer Vision",
    readMinutes: 182,
    bookmarked: true,
    completedTopic: false,
    icon: "/learning-icons/computer-vision.png",
    popularity: 86,
  },
  {
    slug: "mathematics-for-ml",
    title: "Mathematics for ML",
    description: "Essential math concepts for machine learning and data science.",
    chapters: 16,
    completed: 5,
    difficulty: "Beginner to Intermediate",
    category: "Mathematics",
    readMinutes: 165,
    bookmarked: true,
    completedTopic: true,
    icon: "/learning-icons/mathematics-for-ml.png",
    popularity: 84,
  },
  {
    slug: "statistics-probability",
    title: "Statistics & Probability",
    description: "Probability distributions, hypothesis testing, regression and more.",
    chapters: 13,
    completed: 3,
    difficulty: "Beginner to Intermediate",
    category: "Mathematics",
    readMinutes: 145,
    bookmarked: false,
    completedTopic: false,
    icon: "/learning-icons/statistics-probability.png",
    popularity: 81,
  },
  {
    slug: "data-science-fundamentals",
    title: "Data Science Fundamentals",
    description: "Data analysis, visualization, and data preprocessing essentials.",
    chapters: 11,
    completed: 2,
    difficulty: "Beginner to Intermediate",
    category: "Data Science",
    readMinutes: 120,
    bookmarked: false,
    completedTopic: false,
    icon: "/learning-icons/data-science-fundamentals.png",
    popularity: 78,
  },
  {
    slug: "natural-language-processing",
    title: "Natural Language Processing",
    description: "Text processing, embeddings, transformers and language models.",
    chapters: 20,
    completed: 1,
    difficulty: "Intermediate to Advanced",
    category: "NLP",
    readMinutes: 210,
    bookmarked: false,
    completedTopic: false,
    icon: "/learning-icons/nlp.png",
    popularity: 76,
  },
  {
    slug: "computer-vision",
    title: "Computer Vision",
    description: "Image processing, CNNs, object detection and image segmentation.",
    chapters: 17,
    completed: 0,
    difficulty: "Intermediate to Advanced",
    category: "Computer Vision",
    readMinutes: 170,
    bookmarked: false,
    completedTopic: false,
    icon: "/learning-icons/computer-vision.png",
    popularity: 73,
  },
  {
    slug: "reinforcement-learning",
    title: "Reinforcement Learning",
    description: "Learn RL concepts, algorithms and real-world applications.",
    chapters: 12,
    completed: 1,
    difficulty: "Intermediate to Advanced",
    category: "Others",
    readMinutes: 115,
    bookmarked: false,
    completedTopic: false,
    icon: "/learning-icons/reinforcement-learning.png",
    popularity: 72,
  },
  {
    slug: "mlops",
    title: "MLOps",
    description: "Deploy, monitor and scale ML models in production.",
    chapters: 10,
    completed: 0,
    difficulty: "Intermediate to Advanced",
    category: "Others",
    readMinutes: 105,
    bookmarked: false,
    completedTopic: false,
    icon: "/learning-icons/mlops.png",
    popularity: 70,
  },
];

const TAB_OPTIONS = [
  { key: "all", label: "All Topics" },
  { key: "progress", label: "My Progress" },
  { key: "bookmarked", label: "Bookmarked" },
  { key: "completed", label: "Completed" },
] as const;

const LEVELS = [
  "All Levels",
  "Beginner",
  "Beginner to Intermediate",
  "Intermediate",
  "Intermediate to Advanced",
  "Advanced",
];

const CATEGORIES = [
  "All Categories",
  "Machine Learning",
  "Deep Learning",
  "Mathematics",
  "Data Science",
  "NLP",
  "Computer Vision",
  "Others",
];

const SORT_OPTIONS = ["Popular", "Progress", "Alphabetical", "Chapters"];
const PAGE_SIZE = 11;

const QUICK_LINKS = [
  { label: "My Progress", icon: PiChartBar, action: "progress" },
  { label: "Saved Topics", icon: PiBookmarkSimple, action: "bookmarked" },
  { label: "My Bookmarks", icon: PiBooks, action: "bookmarked" },
  { label: "Study Roadmap", icon: PiMapTrifold, action: "roadmap" },
  { label: "Certificates", icon: PiCertificate, action: "completed" },
] as const;

export function LearningCatalogPage({ initialQuery = "" }: { initialQuery?: string }) {
  const [activeTab, setActiveTab] = useState<(typeof TAB_OPTIONS)[number]["key"]>("all");
  const [query, setQuery] = useState(initialQuery);
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Popular");
  const [page, setPage] = useState(1);
  const [activeTopic, setActiveTopic] = useState("deep-learning");

  const filteredTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = TOPICS.filter((topic) => {
      if (activeTab === "progress" && topic.completed === 0) return false;
      if (activeTab === "bookmarked" && !topic.bookmarked) return false;
      if (activeTab === "completed" && !topic.completedTopic) return false;
      if (selectedLevel !== "All Levels" && topic.difficulty !== selectedLevel) return false;
      if (selectedCategory !== "All Categories" && topic.category !== selectedCategory) return false;

      if (!normalizedQuery) return true;
      return [
        topic.title,
        topic.description,
        topic.difficulty,
        topic.category,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });

    return filtered.sort((left, right) => {
      if (sortBy === "Alphabetical") return left.title.localeCompare(right.title);
      if (sortBy === "Chapters") return right.chapters - left.chapters;
      if (sortBy === "Progress") {
        return progressPercent(right.completed, right.chapters) - progressPercent(left.completed, left.chapters);
      }
      return right.popularity - left.popularity;
    });
  }, [activeTab, query, selectedCategory, selectedLevel, sortBy]);

  const pagedTopics = useMemo(
    () =>
      Array.from({ length: 11 }, (_, index) =>
        filteredTopics.map((topic) => ({ ...topic, pageId: `${topic.slug}-${index + 1}` })),
      ).flat(),
    [filteredTopics],
  );

  const totalPages = Math.max(1, Math.ceil(pagedTopics.length / PAGE_SIZE));
  const visibleTopics = pagedTopics.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [activeTab, query, selectedCategory, selectedLevel, sortBy]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!filteredTopics.some((topic) => topic.slug === activeTopic)) {
      setActiveTopic(filteredTopics[0]?.slug ?? "deep-learning");
    }
  }, [activeTopic, filteredTopics]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const totalChapters = TOPICS.reduce((sum, topic) => sum + topic.chapters, 0);
  const totalReadMinutes = TOPICS.reduce((sum, topic) => sum + topic.readMinutes, 0);
  const completedTopics = TOPICS.filter((topic) => topic.completedTopic).length;

  return (
    <div className="pb-10 pt-4">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_214px]">
        <section>
          <header>
            <h1 className="text-[26px] font-bold tracking-[-0.03em] text-[#10172d] dark:text-[var(--color-fg)]">
              Learning
            </h1>
            <p className="mt-2 text-[14px] font-medium text-[#68748f]">
              Explore all topics and their chapters. Learn at your own pace.
            </p>
          </header>

          <div className="mt-7 flex flex-wrap gap-8 border-b border-[#eceff6] pb-4 dark:border-[var(--color-border)]">
            {TAB_OPTIONS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative text-[13px] font-semibold transition-colors ${
                    active ? "text-[#6547ff]" : "text-[#7d88a1] hover:text-[#475168]"
                  }`}
                >
                  {tab.label}
                  {active ? <span className="absolute -bottom-4 left-0 h-[2px] w-full rounded-full bg-[#6547ff]" /> : null}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1 lg:min-w-[220px]">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#97a0b6]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search topics..."
                className="h-[42px] w-full rounded-[10px] border border-[#eaedf4] bg-white pl-10 pr-10 text-[13px] font-medium text-[#10172d] outline-none transition-colors placeholder:text-[#a3abc0] focus:border-[#cfc7ff] dark:border-[var(--color-border)] dark:bg-[var(--color-bg)] dark:text-[var(--color-fg)]"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-[#8a94aa]"
                >
                  ×
                </button>
              ) : (
                <TbFilterBolt className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a0a8bd]" />
              )}
            </div>

            <SelectControl value={selectedLevel} onChange={setSelectedLevel} options={LEVELS} icon={TbAdjustmentsHorizontal} widthClassName="lg:w-[126px]" />
            <SelectControl value={selectedCategory} onChange={setSelectedCategory} options={CATEGORIES} icon={TbCategory} widthClassName="lg:w-[142px]" />
            <SelectControl value={sortBy} onChange={setSortBy} options={SORT_OPTIONS} icon={TbChartBarPopular} prefix="Sort by:" widthClassName="lg:w-[138px]" />
          </div>

          <div className="mt-4 grid gap-4">
            {visibleTopics.map((topic) => (
              <TopicCard
                key={topic.pageId}
                topic={topic}
                active={activeTopic === topic.slug}
                onClick={() => setActiveTopic(topic.slug)}
              />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </section>

        <aside className="space-y-4 lg:sticky lg:top-[84px] lg:self-start">
          <SideCard title="Learning Overview">
            <StatItem icon={PiBookOpenText} tint="bg-[#f1ebff] text-[#6a4eff]" value={String(TOPICS.length)} label="Topics" />
            <StatItem icon={PiBooks} tint="bg-[#e9fbf4] text-[#18a970]" value={String(totalChapters)} label="Total Chapters" />
            <StatItem icon={PiClock} tint="bg-[#fff4e7] text-[#f08a20]" value={formatMinutes(totalReadMinutes)} label="Total Read Time" />
            <StatItem icon={PiCheckCircle} tint="bg-[#edf4ff] text-[#2d8cff]" value={`${completedTopics} / ${TOPICS.length}`} label="Topics Completed" />
          </SideCard>

          <SideCard title="Filter by Level">
            <FilterList options={LEVELS} selected={selectedLevel} onSelect={setSelectedLevel} accentClassName="accent-[#6547ff]" />
          </SideCard>

          <SideCard title="Filter by Category">
            <div className="space-y-1.5">
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                      active
                        ? "bg-[#f3efff] text-[#6547ff]"
                        : "text-[#6f7a92] hover:bg-[#f7f8fc] hover:text-[#29324b]"
                    }`}
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded-md ${active ? "bg-[#e7deff]" : "bg-[#f3f5fa]"} text-[11px]`}>
                      {categoryIcon(category)}
                    </span>
                    {category}
                  </button>
                );
              })}
            </div>
          </SideCard>

          <SideCard title="Quick Links">
            <div className="space-y-2">
              {QUICK_LINKS.map(({ label, icon: Icon, action }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (action === "progress") setActiveTab("progress");
                    if (action === "bookmarked") setActiveTab("bookmarked");
                    if (action === "completed") setActiveTab("completed");
                    if (action === "roadmap") {
                      setSelectedLevel("Beginner to Intermediate");
                      setSortBy("Progress");
                    }
                  }}
                  className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left text-[13px] font-medium text-[#6f7a92] transition-colors hover:bg-[#f7f8fc] hover:text-[#29324b]"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#f3f5fa] text-[12px] text-[#8b95ac]">
                    <Icon />
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </SideCard>

          <div className="rounded-[16px] border border-[#ebeef6] bg-[linear-gradient(180deg,#f7f2ff_0%,#ffffff_64%)] px-5 py-6 text-center shadow-[0_18px_40px_rgba(15,23,42,0.03)] dark:border-[var(--color-border)] dark:bg-[var(--color-bg-elevated)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f0e9ff] text-[30px] text-[#6547ff]">
              <PiGraduationCap />
            </div>
            <h3 className="mt-5 text-[14px] font-bold text-[#10172d] dark:text-[var(--color-fg)]">
              Keep Learning, Keep Growing!
            </h3>
            <p className="mt-3 text-[13px] leading-6 text-[#7a85a0]">
              Track your progress and unlock your learning potential.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("progress")}
              className="mt-6 inline-flex h-[42px] w-full items-center justify-center rounded-[10px] bg-gradient-to-r from-[#6a4dff] to-[#4f31f2] text-[13px] font-semibold text-white shadow-[0_14px_30px_rgba(101,71,255,0.25)]"
            >
              View My Progress
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function SelectControl({
  value,
  onChange,
  options,
  icon: Icon,
  prefix,
  widthClassName,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  icon: ComponentType<{ className?: string }>;
  prefix?: string;
  widthClassName?: string;
}) {
  return (
    <div className={`relative min-w-[0] ${widthClassName ?? "lg:w-[160px]"}`}>
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa3b8]" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[42px] w-full appearance-none rounded-[10px] border border-[#eaedf4] bg-white pl-9 pr-9 text-[12px] font-semibold text-[#5d6882] outline-none transition-colors focus:border-[#cfc7ff] dark:border-[var(--color-border)] dark:bg-[var(--color-bg)] dark:text-[var(--color-fg)]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {prefix && option === value ? `${prefix} ${option}` : option}
          </option>
        ))}
      </select>
      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#97a0b6]" />
    </div>
  );
}

function TopicCard({
  topic,
  active,
  onClick,
}: {
  topic: Topic;
  active: boolean;
  onClick: () => void;
}) {
  const progress = progressPercent(topic.completed, topic.chapters);

  return (
    <Link
      href={`/learning?series=${topic.slug}`}
      onClick={onClick}
      className={`grid w-full gap-4 rounded-[16px] border bg-white px-4 py-4 text-left shadow-[0_14px_32px_rgba(15,23,42,0.025)] transition-transform hover:-translate-y-[1px] dark:bg-[var(--color-bg)] lg:grid-cols-[60px_minmax(0,1fr)_188px_14px] lg:items-center lg:gap-5 ${
        active
          ? "border-[#d7d0ff] shadow-[0_18px_36px_rgba(101,71,255,0.08)]"
          : "border-[#eceff6] dark:border-[var(--color-border)]"
      }`}
    >
      <Image src={topic.icon} alt="" width={56} height={56} className="rounded-[14px]" />

      <div className="min-w-0">
        <h2 className="text-[16px] font-bold tracking-[-0.025em] text-[#10172d] dark:text-[var(--color-fg)]">
          {topic.title}
        </h2>
        <p className="mt-2 max-w-[450px] text-[13px] leading-6 text-[#6f7a92]">
          {topic.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold">
          <Badge icon={<PiBookOpenText />}>{topic.chapters} Chapters</Badge>
          <Badge icon={<PiSparkle />}>{topic.difficulty}</Badge>
        </div>
      </div>

      <div className="min-w-[180px]">
        <div className="flex items-center justify-between text-[13px] font-semibold text-[#5d6882]">
          <span>
            {topic.completed} / {topic.chapters} chapters
          </span>
          <span>{progress}%</span>
        </div>
        <div className="mt-4 h-[6px] overflow-hidden rounded-full bg-[#ebedf3]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6a4dff] to-[#5032f3]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <HiOutlineArrowSmallRight className="hidden h-5 w-5 text-[#8b95ac] lg:block" />
    </Link>
  );
}

function SideCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[16px] border border-[#ebeef6] bg-white px-4 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.03)] dark:border-[var(--color-border)] dark:bg-[var(--color-bg)]">
      <h3 className="text-[15px] font-bold text-[#10172d] dark:text-[var(--color-fg)]">{title}</h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function StatItem({
  icon: Icon,
  tint,
  value,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  tint: string;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className={`flex h-11 w-11 items-center justify-center rounded-[12px] text-[18px] ${tint}`}>
        <Icon />
      </span>
      <span className="flex flex-col">
        <span className="text-[18px] font-bold tracking-[-0.03em] text-[#10172d] dark:text-[var(--color-fg)]">{value}</span>
        <span className="text-[12px] font-medium text-[#78839e]">{label}</span>
      </span>
    </div>
  );
}

function FilterList({
  options,
  selected,
  onSelect,
  accentClassName,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  accentClassName: string;
}) {
  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label key={option} className="flex cursor-pointer items-center gap-3 text-[13px] font-medium text-[#6f7a92]">
          <input
            type="checkbox"
            checked={selected === option}
            onChange={() => onSelect(option)}
            className={`h-4 w-4 rounded border-[#d9deea] ${accentClassName}`}
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  const items = visiblePageItems(page, totalPages);

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <PageButton onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}>
        <FiChevronLeft />
      </PageButton>
      {items.map((item, index) =>
        item === "…" ? (
          <span key={`ellipsis-${index}`} className="flex h-9 min-w-9 items-center justify-center rounded-[10px] border border-[#eceff6] px-3 text-[13px] font-semibold text-[#97a0b6]">
            …
          </span>
        ) : (
          <PageButton key={`page-${item}`} active={page === item} onClick={() => onChange(item as number)}>
            {item}
          </PageButton>
        ),
      )}
      <PageButton onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
        <FiChevronRight />
      </PageButton>
    </div>
  );
}

function PageButton({
  children,
  active = false,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex h-9 min-w-9 items-center justify-center rounded-[10px] border px-3 text-[13px] font-semibold transition-colors ${
        active
          ? "border-[#6547ff] bg-[#6547ff] text-white"
          : "border-[#eceff6] bg-white text-[#74809a] hover:border-[#dcdff0] hover:text-[#263148] disabled:cursor-not-allowed disabled:opacity-45"
      }`}
    >
      {children}
    </button>
  );
}

function Badge({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f7fb] px-2.5 py-1 text-[#7d88a1]">
      <span className="text-[12px]">{icon}</span>
      {children}
    </span>
  );
}

function progressPercent(completed: number, chapters: number) {
  if (!chapters) return 0;
  return Math.round((completed / chapters) * 100);
}

function formatMinutes(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

function visiblePageItems(page: number, totalPages: number) {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (page <= 3) return [1, 2, 3, "…", totalPages];
  if (page >= totalPages - 2) return [1, "…", totalPages - 2, totalPages - 1, totalPages];
  return [1, page, page + 1, "…", totalPages];
}

function categoryIcon(category: string) {
  if (category === "All Categories") return <PiNotebook />;
  if (category === "Machine Learning") return <PiChartBar />;
  if (category === "Deep Learning") return <PiSparkle />;
  if (category === "Mathematics") return <PiMathOperations />;
  if (category === "Data Science") return <PiBooks />;
  if (category === "NLP") return <PiBookOpenText />;
  if (category === "Computer Vision") return <PiCheckCircle />;
  return <PiRocketLaunch />;
}
