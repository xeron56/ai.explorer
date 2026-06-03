import Link from "next/link";

export const metadata = { title: "Personal Finance" };

const iconBase = "/img/finance/personal-finance-icons";

const tabs = [
  "Overview",
  "Chapters",
  "Lessons",
  "Resources",
  "Case Studies",
  "Tools",
  "Notes",
  "Quiz & Practice",
];

const chapters = [
  {
    title: "Understanding Your Money",
    description: "Learn the basics of income, expenses, assets, liabilities, and net worth.",
    icon: "wallet",
    lessons: 6,
    progress: 100,
    status: "Completed",
  },
  {
    title: "Budgeting Basics",
    description: "Create a budget that works for you and track your spending.",
    icon: "pie-chart",
    lessons: 6,
    progress: 100,
    status: "Completed",
  },
  {
    title: "Saving Money",
    description: "Discover practical ways to save more and build healthy financial habits.",
    icon: "piggy-bank",
    lessons: 6,
    progress: 83,
    status: "In Progress",
  },
  {
    title: "Emergency Fund",
    description: "Learn why an emergency fund is essential and how to build one.",
    icon: "shield-check",
    lessons: 5,
    progress: 60,
    status: "In Progress",
  },
  {
    title: "Managing Debt",
    description: "Understand good debt vs bad debt and strategies to become debt-free.",
    icon: "credit-card",
    lessons: 6,
    progress: 40,
    status: "In Progress",
  },
  {
    title: "Insurance Basics",
    description: "Learn about different types of insurance and how they protect your finances.",
    icon: "umbrella",
    lessons: 5,
    progress: 20,
    status: "Not Started",
  },
  {
    title: "Financial Goals",
    description: "Set SMART goals and plan your journey towards financial freedom.",
    icon: "goal-target",
    lessons: 6,
    progress: 0,
    status: "Not Started",
  },
  {
    title: "Retirement Planning",
    description: "Plan for your future and build a secure retirement.",
    icon: "retirement-chair",
    lessons: 5,
    progress: 0,
    status: "Not Started",
  },
];

const learningGoals = [
  "Manage income and expenses effectively",
  "Build strong saving habits",
  "Budget smartly and avoid debt",
  "Plan for emergencies and future goals",
  "Make better financial decisions",
];

const resources = [
  { title: "Budget Worksheet", meta: "PDF • 250 KB", icon: "pdf-document", tone: "red" },
  { title: "Expense Tracker", meta: "Excel • 180 KB", icon: "spreadsheet-tracker", tone: "blue" },
  { title: "Emergency Fund Calculator", meta: "Excel • 120 KB", icon: "calculator", tone: "green" },
  { title: "Financial Goals Template", meta: "PDF • 210 KB", icon: "pdf-document", tone: "red" },
];

const popularArticles = [
  { title: "How to Build an Emergency Fund", date: "May 10, 2024", image: "/img/finance/emergency-fund.png" },
  { title: "10 Smart Ways to Save Money", date: "May 5, 2024", image: "/img/finance/compounding.png" },
  { title: "Budgeting Mistakes to Avoid", date: "Apr 28, 2024", image: "/img/finance/finance-asset-atlas.png" },
];

const valueProps = [
  { title: "Structured Learning", body: "Learn step-by-step with well-organized chapters.", icon: "wallet" },
  { title: "Practical Examples", body: "Real-life examples to help you understand better.", icon: "spreadsheet-tracker" },
  { title: "Expert Insights", body: "Learn from experienced finance professionals.", icon: "progress-check" },
  { title: "Track Progress", body: "Monitor your learning and achieve your goals.", icon: "goal-target" },
];

export default function PersonalFinancePage() {
  return (
    <div className="mx-auto max-w-[1260px] pb-12 pt-7">
      <Breadcrumb />
      <Hero />

      <nav className="mt-7 flex flex-wrap items-center gap-2 rounded-[16px] border border-[#dde9e1] bg-white px-3 py-2 shadow-[0_12px_32px_rgba(15,23,42,0.035)]">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`inline-flex h-11 items-center gap-2 rounded-[12px] px-4 text-[13px] font-semibold transition ${
              index === 0
                ? "bg-[#effaf2] text-[#15924c] shadow-[inset_0_-2px_0_#15924c]"
                : "text-[#26384b] hover:bg-[#f6faf7]"
            }`}
          >
            <TabIcon index={index} />
            {tab}
          </button>
        ))}
      </nav>

      <div className="mt-6 grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)_300px]">
        <LeftRail />
        <main className="min-w-0">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[18px] font-extrabold text-[#121b27]">Chapters in Personal Finance</h2>
            <Link href="/learning" className="inline-flex items-center gap-2 text-[13px] font-bold text-[#1579d2]">
              View All Lessons
              <ArrowRightIcon />
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {chapters.map((chapter, index) => (
              <ChapterCard key={chapter.title} chapter={chapter} index={index} />
            ))}
          </div>
        </main>
        <RightRail />
      </div>

      <KeepGoing />
      <ValueStrip />
      <Footer />
    </div>
  );
}

function Breadcrumb() {
  return (
    <div className="mb-8 flex items-center gap-3 text-[12px] font-semibold text-[#6b7c8d]">
      <Link href="/blog" className="hover:text-[#15924c]">Blog</Link>
      <ChevronRightIcon />
      <Link href="/learning" className="hover:text-[#15924c]">Topics</Link>
      <ChevronRightIcon />
      <span className="text-[#122033]">Personal Finance</span>
    </div>
  );
}

function Hero() {
  return (
    <section className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <span className="inline-flex items-center gap-2 rounded-[8px] bg-[#eaf8ef] px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#15924c]">
          <MiniBoxIcon />
          Topic
        </span>
        <h1 className="mt-5 text-[44px] font-extrabold leading-[1.02] tracking-[-0.045em] text-[#101826] md:text-[56px]">
          Personal Finance
        </h1>
        <p className="mt-4 max-w-[590px] text-[18px] leading-8 text-[#33485f]">
          Learn how to manage your money, build good habits, and achieve financial freedom.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-[13px] font-bold text-[#2b3d52]">
          <Metric icon="book" label="8 Chapters" />
          <Metric icon="lessons" label="45 Lessons" />
          <Metric icon="clock" label="4h 30m Total Length" />
          <Metric icon="beginner" label="Beginner Friendly" />
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-x-8 bottom-2 h-16 rounded-full bg-[#1f9d55]/10 blur-2xl" />
        <img
          src="/img/finance/personal-finance-hero.png"
          alt="Green wallet with plant, calculator, and coins"
          className="relative ml-auto w-full max-w-[620px] object-contain mix-blend-multiply"
        />
      </div>
    </section>
  );
}

function LeftRail() {
  return (
    <aside className="space-y-5">
      <section className="rounded-[14px] border border-[#dde8e2] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.03)]">
        <h2 className="text-[17px] font-extrabold text-[#111a27]">About This Topic</h2>
        <p className="mt-4 text-[14px] leading-7 text-[#405365]">
          Personal finance is the foundation of financial well-being. This topic will help you understand how money works in your daily life and how to take control of your finances.
        </p>
      </section>

      <section className="rounded-[14px] border border-[#dde8e2] bg-[linear-gradient(135deg,#f8fcf9_0%,#eff8f2_100%)] p-5 shadow-[0_10px_28px_rgba(15,23,42,0.03)]">
        <div className="flex items-start gap-4">
          <img src={`${iconBase}/quote.png`} alt="" className="h-8 w-8 object-contain" />
          <p className="text-[14px] leading-7 text-[#314457]">
            Financial freedom starts with financial discipline.
          </p>
        </div>
      </section>

      <section className="rounded-[14px] border border-[#dde8e2] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.03)]">
        <h2 className="text-[17px] font-extrabold text-[#111a27]">What You&apos;ll Learn</h2>
        <ul className="mt-4 space-y-3">
          {learningGoals.map((goal) => (
            <li key={goal} className="flex items-start gap-3 text-[14px] leading-6 text-[#314457]">
              <CheckDotIcon />
              <span>{goal}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="overflow-hidden rounded-[14px] border border-[#dde8e2] bg-[linear-gradient(135deg,#ffffff_0%,#eef8f2_100%)] p-5 shadow-[0_10px_28px_rgba(15,23,42,0.03)]">
        <h2 className="text-[17px] font-extrabold text-[#111a27]">Test Your Knowledge</h2>
        <p className="mt-3 text-[14px] leading-7 text-[#405365]">
          Take a quick quiz to test your understanding of personal finance basics.
        </p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <button className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#159b50] px-6 text-[14px] font-extrabold text-white shadow-[0_14px_26px_rgba(22,163,74,0.18)]">
            Start Quiz
          </button>
          <img src={`${iconBase}/clipboard-quiz.png`} alt="" className="h-24 w-24 object-contain drop-shadow-[0_16px_24px_rgba(22,163,74,0.16)]" />
        </div>
      </section>
    </aside>
  );
}

function ChapterCard({
  chapter,
  index,
}: {
  chapter: (typeof chapters)[number];
  index: number;
}) {
  return (
    <Link
      href={index === 1 ? "/learning/personal-finance-budgeting" : "/learning/basics-of-finance"}
      className="grid items-center gap-5 rounded-[14px] border border-[#dde8e2] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-[#bfe6cc] md:grid-cols-[minmax(0,1fr)_86px]"
    >
      <div className="flex min-w-0 items-center gap-6">
        <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[#e8f7ed]">
          <img src={`${iconBase}/${chapter.icon}.png`} alt="" className="h-14 w-14 object-contain" />
        </span>
        <div className="min-w-0">
          <h3 className="text-[18px] font-extrabold tracking-[-0.02em] text-[#111a27]">
            {index + 1}. {chapter.title}
          </h3>
          <p className="mt-2 max-w-[460px] text-[14px] leading-6 text-[#405365]">{chapter.description}</p>
          <div className="mt-3 inline-flex items-center gap-2 text-[12px] font-bold text-[#435468]">
            <BookLineIcon />
            {chapter.lessons} Lessons
          </div>
        </div>
      </div>
      <ProgressRing value={chapter.progress} label={chapter.status} size={76} />
    </Link>
  );
}

function RightRail() {
  return (
    <aside className="space-y-5">
      <section className="rounded-[14px] border border-[#dde8e2] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.03)]">
        <h2 className="text-[17px] font-extrabold text-[#111a27]">Your Progress</h2>
        <div className="mt-5 flex justify-center">
          <ProgressRing value={45} label="Overall Progress" size={130} />
        </div>
        <div className="mt-6 space-y-4">
          <ProgressStat icon="progress-check" value="20 / 45" label="Lessons Completed" />
          <ProgressStat icon="calculator" value="2h 05m" label="Total Learning Time" />
          <ProgressStat icon="certificate" value="1" label="Certificate Earned" />
        </div>
        <button className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-[10px] bg-[#149b50] text-[14px] font-extrabold text-white shadow-[0_14px_26px_rgba(22,163,74,0.18)]">
          Continue Learning
        </button>
      </section>

      <section className="rounded-[14px] border border-[#dde8e2] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.03)]">
        <h2 className="text-[17px] font-extrabold text-[#111a27]">Resources</h2>
        <div className="mt-4 space-y-4">
          {resources.map((resource) => (
            <div key={resource.title} className="flex items-center gap-3">
              <span className={`grid h-10 w-10 place-items-center rounded-[10px] ${resource.tone === "red" ? "bg-[#fff1f1]" : resource.tone === "blue" ? "bg-[#eef5ff]" : "bg-[#effaf2]"}`}>
                <img src={`${iconBase}/${resource.icon}.png`} alt="" className="h-7 w-7 object-contain" />
              </span>
              <div>
                <div className="text-[13px] font-extrabold text-[#162330]">{resource.title}</div>
                <div className="mt-1 text-[12px] font-semibold text-[#667789]">{resource.meta}</div>
              </div>
            </div>
          ))}
        </div>
        <Link href="/learning" className="mt-5 inline-flex items-center gap-2 text-[14px] font-extrabold text-[#15924c]">
          View All Resources
          <ArrowRightIcon />
        </Link>
      </section>

      <section className="rounded-[14px] border border-[#dde8e2] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.03)]">
        <h2 className="text-[17px] font-extrabold text-[#111a27]">Popular Articles</h2>
        <div className="mt-4 space-y-4">
          {popularArticles.map((article) => (
            <Link key={article.title} href="/blog" className="flex items-center gap-3 rounded-[10px] transition hover:bg-[#f7fbf8]">
              <img src={article.image} alt="" className="h-12 w-12 shrink-0 rounded-[10px] object-cover" />
              <div>
                <div className="line-clamp-2 text-[13px] font-extrabold leading-5 text-[#162330]">{article.title}</div>
                <div className="mt-1 text-[12px] text-[#667789]">{article.date}</div>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/blog" className="mt-5 inline-flex items-center gap-2 text-[14px] font-extrabold text-[#15924c]">
          View All Articles
          <ArrowRightIcon />
        </Link>
      </section>
    </aside>
  );
}

function KeepGoing() {
  return (
    <section className="mt-6 grid items-center gap-6 rounded-[14px] border border-[#dde8e2] bg-[linear-gradient(90deg,#f7fcf8_0%,#ffffff_48%,#eff8f2_100%)] px-8 py-5 shadow-[0_10px_28px_rgba(15,23,42,0.03)] md:grid-cols-[220px_minmax(0,1fr)_260px]">
      <img src={`${iconBase}/trophy.png`} alt="" className="mx-auto h-28 w-28 object-contain drop-shadow-[0_16px_24px_rgba(22,163,74,0.14)]" />
      <div>
        <h2 className="text-[18px] font-extrabold text-[#111a27]">Keep Going!</h2>
        <p className="mt-2 text-[14px] leading-6 text-[#405365]">
          Complete all lessons in this topic to earn your certificate.
        </p>
        <button className="mt-4 inline-flex h-10 items-center gap-2 rounded-[10px] border border-[#bde6cb] bg-white px-5 text-[13px] font-extrabold text-[#15924c]">
          Take Final Quiz
          <ArrowRightIcon />
        </button>
      </div>
      <img src={`${iconBase}/certificate.png`} alt="" className="mx-auto h-24 w-40 object-contain drop-shadow-[0_16px_24px_rgba(22,163,74,0.12)]" />
    </section>
  );
}

function ValueStrip() {
  return (
    <section className="mt-6 grid gap-4 rounded-[14px] border border-[#dde8e2] bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.03)] md:grid-cols-2 lg:grid-cols-4">
      {valueProps.map((item) => (
        <div key={item.title} className="flex items-start gap-4 px-2 py-2">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-[#eaf8ef]">
            <img src={`${iconBase}/${item.icon}.png`} alt="" className="h-7 w-7 object-contain" />
          </span>
          <div>
            <h3 className="text-[13px] font-extrabold text-[#162330]">{item.title}</h3>
            <p className="mt-1 text-[12px] leading-5 text-[#405365]">{item.body}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-7 flex flex-col gap-4 px-1 pb-2 pt-2 text-[13px] text-[#708090] md:flex-row md:items-center md:justify-between">
      <p>© 2026 Stock&amp;Trade. All rights reserved.</p>
      <div className="flex flex-wrap items-center gap-5">
        <Link href="#" className="transition hover:text-[#15924c]">About Us</Link>
        <Link href="#" className="transition hover:text-[#15924c]">Contact</Link>
        <Link href="#" className="transition hover:text-[#15924c]">Privacy Policy</Link>
        <Link href="#" className="transition hover:text-[#15924c]">Terms of Service</Link>
      </div>
    </footer>
  );
}

function ProgressRing({ value, label, size }: { value: number; label: string; size: number }) {
  const inner = Math.max(size - 14, 42);
  const valueSize = size > 100 ? "text-[28px]" : "text-[17px]";
  const labelSize = size > 100 ? "text-[11px]" : "text-[8px]";

  return (
    <div
      className="grid shrink-0 place-items-center rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(#159b50 0deg ${value * 3.6}deg, #e4eee7 ${value * 3.6}deg 360deg)`,
      }}
    >
      <div className="grid place-items-center rounded-full bg-white text-center leading-none" style={{ width: inner, height: inner }}>
        <div className={`${valueSize} font-extrabold leading-none text-[#111a27]`}>{value}%</div>
        <div className={`mt-1 max-w-[64px] whitespace-normal ${labelSize} font-extrabold leading-tight text-[#304357]`}>
          {label}
        </div>
      </div>
    </div>
  );
}

function ProgressStat({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="grid h-11 w-11 place-items-center rounded-[10px] bg-[#eaf8ef]">
        <img src={`${iconBase}/${icon}.png`} alt="" className="h-7 w-7 object-contain" />
      </span>
      <div>
        <div className="text-[18px] font-extrabold text-[#111a27]">{value}</div>
        <div className="text-[12px] font-semibold text-[#667789]">{label}</div>
      </div>
    </div>
  );
}

function Metric({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <MetricIcon icon={icon} />
      {label}
    </span>
  );
}

function TabIcon({ index }: { index: number }) {
  const names = ["progress-check", "wallet", "clipboard-quiz", "pdf-document", "spreadsheet-tracker", "calculator", "certificate", "goal-target"];
  return <img src={`${iconBase}/${names[index]}.png`} alt="" className="h-5 w-5 object-contain" />;
}

function MetricIcon({ icon }: { icon: string }) {
  if (icon === "book") return <BookLineIcon />;
  if (icon === "lessons") return <LessonsIcon />;
  if (icon === "clock") return <ClockIcon />;
  return <BeginnerIcon />;
}

function MiniBoxIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="5" width="12" height="10" rx="2" />
      <path d="M7 9h6M7 12h4" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7 5 5 5-5 5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h12" />
      <path d="m11 5 5 5-5 5" />
    </svg>
  );
}

function CheckDotIcon() {
  return (
    <svg viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0 text-[#15924c]" fill="currentColor">
      <circle cx="10" cy="10" r="8" opacity="0.12" />
      <path d="M8.8 12.7 6.5 10.4l1.1-1.1 1.7 1.7 3.4-3.8 1.2 1.1-4.5 5Z" />
    </svg>
  );
}

function BookLineIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#53677b]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h8.5A1.5 1.5 0 0 1 15 5.5V16H6.5A2.5 2.5 0 0 1 4 13.5V5a1 1 0 0 1 1-1Z" />
      <path d="M4 13.5A2.5 2.5 0 0 1 6.5 11H15" />
    </svg>
  );
}

function LessonsIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#53677b]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5h6M4 10h12M4 15h10" />
      <path d="M14 4l2 2 3-4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#53677b]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v4l3 2" />
    </svg>
  );
}

function BeginnerIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#53677b]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16V8l6-4 6 4v8" />
      <path d="M7 16v-5h6v5" />
    </svg>
  );
}
