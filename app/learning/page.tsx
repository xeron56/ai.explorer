import Link from "next/link";
import { notFound } from "next/navigation";
import { getLearningChapters, getLearningSeries, getLearningSeriesBySlug, type LearningChapter, type LearningSeries, type LearningSeriesLink } from "../_lib/posts";
import { ArrowRightIcon, ClockIcon } from "../_components/icons";

export const metadata = { title: "Learning" };

export default async function LearningPage() {
  const [series, chapters, allSeries] = await Promise.all([
    getLearningSeriesBySlug("deep-learning"),
    getLearningChapters("deep-learning"),
    getLearningSeries(),
  ]);
  if (!series) notFound();

  const visibleChapters = chapters.slice(0, 8);
  const totalReadMinutes = chapters.reduce((sum, chapter) => sum + chapter.readingTime, 0);
  const progress = series.chapterCount ? Math.round((series.completed / series.chapterCount) * 100) : 0;

  return (
    <div className="mx-auto max-w-[1050px] pb-10 pt-[29px]">
      <div className="mb-[35px] text-[12px] font-semibold text-[#59657b]">
        Learning <span className="mx-3 text-[#98a1b5]">/</span> {series.category}
      </div>

      <div className="grid gap-[35px] xl:grid-cols-[minmax(0,704px)_280px]">
        <main>
          <LearningHeader series={series} />
          <LearningTabs />
          <div className="mt-[25px] grid gap-[14px]">
            {visibleChapters.map((chapter) => <ChapterCard key={chapter.slug} chapter={chapter} />)}
          </div>
          <Pagination />
          <StartCard />
        </main>

        <LearningAside
          series={series}
          chapters={chapters}
          allSeries={allSeries}
          progress={progress}
          totalReadMinutes={totalReadMinutes}
        />
      </div>
    </div>
  );
}

function LearningHeader({ series }: { series: LearningSeries }) {
  return (
    <header className="border-b pb-[41px]" style={{ borderColor: "var(--color-border)" }}>
      <div className="flex flex-wrap items-center gap-[22px]">
        <div className="flex h-[78px] w-[78px] items-center justify-center rounded-[7px] bg-gradient-to-br from-[#5b35f4] to-[#704cff] text-white shadow-[0_12px_26px_rgba(91,53,244,0.18)]">
          <NetworkIcon />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-[32px] font-extrabold tracking-[-0.03em] text-[#10172d]">{series.title}</h1>
          <p className="mt-[10px] max-w-[610px] text-[13px] leading-[22px] text-[#44516a]">{series.description}</p>
        </div>
        <button className="inline-flex h-[38px] items-center gap-[8px] rounded-[7px] border border-[#d8d0ff] bg-white px-[18px] text-[13px] font-bold text-[var(--color-accent-strong)]">
          <StarIcon /> Follow
        </button>
      </div>
      <div className="mt-[39px] flex flex-wrap gap-x-[34px] gap-y-3 text-[13px] font-semibold text-[#59657b]">
        <span className="inline-flex items-center gap-[9px]"><BookOpenIcon /> {series.chapterCount} Chapters</span>
        <span className="inline-flex items-center gap-[9px]"><BarsIcon /> {series.difficulty}</span>
        <span className="inline-flex items-center gap-[9px]"><CalendarIcon /> Last updated: {series.formattedLastUpdated}</span>
      </div>
    </header>
  );
}

function LearningTabs() {
  const tabs = [
    ["All Chapters", "grid"],
    ["By Category", "list"],
    ["Bookmarks", "bookmark"],
  ];

  return (
    <div className="mt-[18px] flex flex-wrap gap-[23px]">
      {tabs.map(([label, icon], index) => (
        <button key={label} className={`inline-flex h-[34px] items-center gap-[9px] rounded-[7px] px-[12px] text-[12px] font-semibold ${index === 0 ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]" : "text-[#263458]"}`}>
          <ToolbarIcon type={icon} /> {label}
        </button>
      ))}
    </div>
  );
}

function ChapterCard({ chapter }: { chapter: LearningChapter }) {
  return (
    <Link href={`/learning/${chapter.slug}`} className="group grid min-h-[142px] grid-cols-[150px_1fr_58px] items-center gap-[23px] rounded-[8px] border bg-white p-[13px] pr-[18px] shadow-[0_7px_22px_rgba(15,23,42,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: "var(--color-border)" }}>
      <div className="h-[116px] overflow-hidden rounded-[7px] border border-[var(--color-border)]">
        <ChapterThumbnail type={chapter.thumbnail} tone={chapter.tone} />
      </div>
      <div>
        <h2 className="text-[17px] font-extrabold leading-[22px] text-[#10172d]">
          <span className="text-[var(--color-accent-strong)]">{String(chapter.order).padStart(2, "0")}.</span> {chapter.title}
        </h2>
        <p className="mt-[10px] max-w-[430px] text-[13px] leading-[20px] text-[#44516a]">{chapter.description}</p>
        <div className="mt-[15px] flex items-center gap-[12px] text-[12px] font-medium text-[#59657b]">
          <span>{chapter.formattedDate}</span>
          <span className="h-[3px] w-[3px] rounded-full bg-[#9aa4b8]" />
          <span>{chapter.readingTime} min read</span>
        </div>
      </div>
      <div className="flex items-center justify-end gap-[25px] text-[#263458]">
        <BookmarkIcon filled={chapter.bookmarked} />
        <ArrowRightIcon className="h-[17px] w-[17px] opacity-75 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function LearningAside({
  series,
  chapters,
  allSeries,
  progress,
  totalReadMinutes,
}: {
  series: LearningSeries;
  chapters: LearningChapter[];
  allSeries: LearningSeries[];
  progress: number;
  totalReadMinutes: number;
}) {
  const related = series.related.length
    ? series.related
    : allSeries.filter((item) => item.slug !== series.slug).map((item) => ({
      title: item.title,
      slug: item.slug,
      icon: item.icon,
      tone: item.tone,
      chapters: `${item.chapterCount} chapters`,
    }));

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-[108px] space-y-[28px]">
        <SideCard>
          <h3 className="text-[15px] font-extrabold text-[#10172d]">Series Overview</h3>
          <MiniChart />
          <StatRow label="Total Chapters" value={String(series.chapterCount)} />
          <StatRow label="Total Read Time" value={series.totalReadTime || minutesToTime(totalReadMinutes)} />
          <StatRow label="Difficulty" value={series.difficulty} />
          <StatRow label="Last Updated" value={series.formattedLastUpdated} />
        </SideCard>

        <SideCard>
          <h3 className="text-[15px] font-extrabold text-[#10172d]">Chapters</h3>
          <ol className="mt-[18px] grid gap-[10px]">
            {chapters.map((chapter) => (
              <li key={chapter.slug} className={`grid grid-cols-[24px_1fr_auto] items-center gap-[7px] rounded-[5px] px-[7px] py-[7px] text-[11.5px] ${chapter.order === 1 ? "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]" : "text-[#44516a]"}`}>
                <span className="font-bold">{chapter.order}.</span>
                <span className="truncate font-semibold">{chapter.title}</span>
                <span className="text-[10.5px] text-[#7b849b]">{chapter.readingTime} min</span>
              </li>
            ))}
          </ol>
        </SideCard>

        <SideCard>
          <h3 className="text-[15px] font-extrabold text-[#10172d]">Resources</h3>
          <div className="mt-[21px] grid gap-[17px]">
            {series.resources.map((resource) => (
              <div key={resource.label} className="flex items-center gap-[13px] text-[13px] font-medium text-[#263458]">
                <span className={resourceIconClass(resource.icon)}><ToolbarIcon type={resource.icon} /></span>
                {resource.label}
              </div>
            ))}
          </div>
        </SideCard>

        <SideCard>
          <h3 className="text-[15px] font-extrabold text-[#10172d]">Your Progress</h3>
          <div className="mt-[22px] flex justify-between text-[12px] font-semibold text-[#59657b]">
            <span>{series.completed} / {series.chapterCount} chapters completed</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-[10px] h-[7px] overflow-hidden rounded-full bg-[#e7e5f1]">
            <div className="h-full rounded-full bg-gradient-to-r from-[#5a34f4] to-[#704cff]" style={{ width: `${progress}%` }} />
          </div>
          <button className="mt-[21px] h-[38px] w-full rounded-[7px] bg-gradient-to-r from-[#5a34f4] to-[#704cff] text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(91,53,244,0.17)]">Continue Learning</button>
          <div className="mt-[18px] text-center text-[12px] font-semibold text-[#59657b]">View Progress Analytics</div>
        </SideCard>

        <SideCard>
          <h3 className="text-[15px] font-extrabold text-[#10172d]">Related Series</h3>
          <div className="mt-[19px] grid gap-[16px]">
            {related.map((item) => <RelatedSeries key={item.slug} item={item} />)}
          </div>
        </SideCard>
      </div>
    </aside>
  );
}

function SideCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-[8px] border bg-white p-[20px] shadow-[0_9px_26px_rgba(15,23,42,0.035)]" style={{ borderColor: "var(--color-border)" }}>
      {children}
    </section>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-[19px] flex items-center justify-between text-[12px]">
      <span className="font-semibold text-[#59657b]">{label}</span>
      <span className="font-extrabold text-[#10172d]">{value}</span>
    </div>
  );
}

function RelatedSeries({ item }: { item: LearningSeriesLink }) {
  return (
    <Link href={`/learning?series=${item.slug}`} className="grid grid-cols-[42px_1fr_16px] items-center gap-[13px]">
      <span className={`flex h-[42px] w-[42px] items-center justify-center rounded-[8px] ${toneBg(item.tone)} ${toneText(item.tone)}`}>
        <ToolbarIcon type={item.icon} />
      </span>
      <span>
        <span className="block text-[13px] font-bold text-[#10172d]">{item.title}</span>
        <span className="mt-[3px] block text-[12px] text-[#59657b]">{item.chapters}</span>
      </span>
      <ArrowRightIcon className="h-[15px] w-[15px] text-[#10172d]" />
    </Link>
  );
}

function Pagination() {
  return (
    <div className="mt-[21px] flex justify-center gap-[8px]">
      {["‹", "1", "2", "3", "...", "8", "›"].map((item) => (
        <button key={item} className={`h-[34px] min-w-[34px] rounded-[7px] border px-[10px] text-[13px] font-semibold ${item === "1" ? "border-transparent bg-gradient-to-r from-[#5a34f4] to-[#704cff] text-white" : "bg-white text-[#263458]"}`} style={{ borderColor: item === "1" ? "transparent" : "var(--color-border)" }}>
          {item}
        </button>
      ))}
    </div>
  );
}

function StartCard() {
  return (
    <section className="mt-[24px] flex min-h-[70px] items-center gap-[19px] rounded-[8px] border bg-[#f7f3ff] px-[24px]" style={{ borderColor: "#ded5ff" }}>
      <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#ebe5ff] text-[var(--color-accent-strong)]"><GraduationIcon /></span>
      <div className="min-w-0 flex-1">
        <h3 className="text-[16px] font-extrabold text-[#10172d]">New to Deep Learning?</h3>
        <p className="mt-[3px] text-[13px] text-[#44516a]">Start from the beginning and build a strong foundation.</p>
      </div>
      <Link href="/learning/introduction-to-deep-learning" className="inline-flex h-[38px] items-center gap-[8px] rounded-[7px] border border-[#8f76ff] bg-white px-[19px] text-[13px] font-bold text-[var(--color-accent-strong)]">
        Start Chapter 1 <ArrowRightIcon className="h-[14px] w-[14px]" />
      </Link>
    </section>
  );
}

function ChapterThumbnail({ type, tone }: { type: string; tone: string }) {
  return (
    <div className={`relative h-full w-full ${thumbBg(tone)} p-3`}>
      {type === "equation" && <EquationArt />}
      {type === "sigmoid" && <SigmoidArt />}
      {type === "layers" && <LayerArt />}
      {type === "loss" && <LossArt />}
      {type === "optimization" && <OptimizationArt />}
      {type === "backprop" && <BackpropArt />}
      {type === "regularization" && <RegularizationArt />}
      {type === "network" && <NetworkArt />}
    </div>
  );
}

function MiniChart() {
  return (
    <svg className="mt-[18px] h-[82px] w-full" viewBox="0 0 240 82" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="overviewFill" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#7358ff" stopOpacity="0.24" />
          <stop offset="1" stopColor="#7358ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M8 64 34 42 58 52 84 50 110 42 136 28 164 36 191 18 218 25 234 38V80H8Z" fill="url(#overviewFill)" />
      <path d="M8 64 34 42 58 52 84 50 110 42 136 28 164 36 191 18 218 25 234 38" stroke="#5b35f4" strokeWidth="2.2" />
      {[8, 34, 58, 84, 110, 136, 164, 191, 218, 234].map((x, index) => (
        <circle key={x} cx={x} cy={[64, 42, 52, 50, 42, 28, 36, 18, 25, 38][index]} r="3" fill="#7358ff" />
      ))}
    </svg>
  );
}

function NetworkArt() {
  return (
    <svg viewBox="0 0 150 116" className="h-full w-full" fill="none">
      <g stroke="#a996ff" strokeWidth="1">
        <path d="M20 74 52 22 86 51 126 26" /><path d="M26 29 52 22 71 88 126 26" /><path d="M20 74 71 88 118 80 86 51" /><path d="M26 29 86 51 118 80" />
      </g>
      {[20,74,52,22,86,51,126,26,26,29,71,88,118,80].map((value, index, arr) => index % 2 === 0 && <circle key={index} cx={value} cy={arr[index + 1]} r="4" fill="#7358ff" />)}
    </svg>
  );
}
function EquationArt() {
  return <div className="flex h-full flex-col justify-center px-5 text-[18px] leading-[35px] text-emerald-700"><span>σ(x) = 1 / 1 + e<sup>-x</sup></span><span className="text-[15px]">∑ xᵢ</span></div>;
}
function SigmoidArt() {
  return <svg viewBox="0 0 150 116" className="h-full w-full"><path d="M20 92C48 92 55 23 130 23" fill="none" stroke="#64748b" strokeWidth="2" /><path d="M20 92h112M20 18v76" stroke="#d0c7bb" /></svg>;
}
function LayerArt() {
  return <svg viewBox="0 0 150 116" className="h-full w-full" fill="none"><g stroke="#9ec5ff"><rect x="11" y="35" width="30" height="34" rx="3" fill="#e8f2ff" /><rect x="60" y="35" width="30" height="34" rx="3" fill="#e8f2ff" /><rect x="109" y="35" width="30" height="34" rx="3" fill="#e8f2ff" /><path d="M41 52h19M90 52h19" /></g><path d="m25 45 6 14M31 45l-6 14M74 44v16M68 52h12M123 44v16M117 52h12" stroke="#6ea6ff" /></svg>;
}
function LossArt() {
  return <div className="flex h-full items-center justify-center text-[29px] italic text-[#334155]">L = -∑ y log(ŷ)</div>;
}
function OptimizationArt() {
  return <svg viewBox="0 0 150 116" className="h-full w-full" fill="none"><g stroke="#c7bfff">{[1,2,3,4,5].map((n) => <ellipse key={n} cx="72" cy="58" rx={n * 15} ry={n * 10} />)}</g><path d="M112 25 94 39 81 52 68 63 54 72" stroke="#5b35f4" strokeWidth="2" /><circle cx="94" cy="39" r="4" fill="#5b35f4" /><circle cx="68" cy="63" r="4" fill="#5b35f4" /></svg>;
}
function BackpropArt() {
  return <svg viewBox="0 0 150 116" className="h-full w-full" fill="none"><g stroke="#a7d7c3"><circle cx="27" cy="34" r="14" /><circle cx="72" cy="58" r="14" /><circle cx="118" cy="34" r="14" /><path d="M41 38 58 52M86 52l18-13M41 83 58 64M86 64l18 16" /><circle cx="27" cy="84" r="14" /><circle cx="118" cy="84" r="14" /></g><path d="M115 31 100 36M115 81 100 75" stroke="#64748b" /></svg>;
}
function RegularizationArt() {
  return <svg viewBox="0 0 150 116" className="h-full w-full" fill="none"><g stroke="#d8bf98">{[20,40,60,80,100,120].map((x) => <path key={x} d={`M${x} 16v84`} />)}{[20,38,56,74,92].map((y) => <path key={y} d={`M14 ${y}h122`} />)}</g><g fill="#d9973d">{[24,42,70,93,119,55,107,83].map((x, i) => <circle key={i} cx={x} cy={[25,75,51,33,84,92,63,69][i]} r="3" />)}</g></svg>;
}

function NetworkIcon() {
  return <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="28" height="28" rx="5" opacity="0.3" /><path d="M12 29 21 13 32 22 16 20 28 34" /><circle cx="12" cy="29" r="3" fill="currentColor" /><circle cx="21" cy="13" r="3" fill="currentColor" /><circle cx="32" cy="22" r="3" fill="currentColor" /><circle cx="16" cy="20" r="3" fill="currentColor" /><circle cx="28" cy="34" r="3" fill="currentColor" /></svg>;
}
function StarIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2 7.5 14 3 9.6l6.2-.9L12 3z" /></svg>; }
function BookOpenIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22z" /><path d="M4 5.5V22" /></svg>; }
function BarsIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20V10M12 20V4M20 20v-7" /></svg>; }
function CalendarIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>; }
function BookmarkIcon({ filled }: { filled?: boolean }) { return <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8"><path d="M6 4h12v17l-6-4-6 4z" /></svg>; }
function GraduationIcon() { return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m22 10-10-5-10 5 10 5z" /><path d="M6 12v5c3 2 9 2 12 0v-5" /></svg>; }

function ToolbarIcon({ type }: { type: string }) {
  if (type === "list") return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></svg>;
  if (type === "bookmark") return <BookmarkIcon />;
  if (type === "pdf") return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 3H6v18h12V7z" /><path d="M14 3v4h4" /></svg>;
  if (type === "formula") return <span className="text-[13px] font-black">∑</span>;
  if (type === "book") return <BookOpenIcon />;
  if (type === "link") return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1 1" /><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1-1" /></svg>;
  if (type === "cube") return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M4 7.5 12 12l8-4.5" /><path d="M12 12v9" /></svg>;
  if (type === "tensorflow") return <span className="text-[20px] font-black">T</span>;
  if (type === "flame") return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22c4 0 7-3 7-7 0-3-2-5-4-7 .2 2-1 3.5-2.2 4.4C13 9 11 6 8 4c.4 4-3 6-3 11 0 4 3 7 7 7z" /></svg>;
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6M9 15h6" /></svg>;
}

function thumbBg(tone: string) {
  if (tone === "green") return "bg-emerald-50";
  if (tone === "amber") return "bg-orange-50";
  if (tone === "blue") return "bg-sky-50";
  if (tone === "rose") return "bg-rose-50";
  return "bg-[#f4f0ff]";
}
function toneBg(tone: string) {
  if (tone === "green") return "bg-emerald-50";
  if (tone === "amber") return "bg-orange-50";
  if (tone === "red") return "bg-red-50";
  return "bg-[var(--color-accent-soft)]";
}
function toneText(tone: string) {
  if (tone === "green") return "text-emerald-600";
  if (tone === "amber") return "text-orange-500";
  if (tone === "red") return "text-red-500";
  return "text-[var(--color-accent-strong)]";
}
function resourceIconClass(icon: string) {
  if (icon === "pdf") return "text-rose-500";
  if (icon === "formula") return "text-sky-500";
  if (icon === "book") return "text-[var(--color-accent-strong)]";
  return "text-[#59657b]";
}
function minutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return hours ? `${hours}h ${remaining}m` : `${remaining}m`;
}
