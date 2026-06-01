import {
  FilterSelect,
  GhostButton,
  MetricTile,
  PageHeading,
  PageShell,
  PrimaryButton,
  RailCard,
  SearchField,
  Surface,
  Tabs,
  Tag,
  Toolbar,
} from "../_components/pagePrimitives";

const contests = [
  {
    name: "Codeforces Round 958 (Div. 2)",
    platform: "Codeforces",
    date: "May 18, 2024",
    time: "17:05 (IST)",
    duration: "2 hours",
    level: "Div. 2",
    participants: "12.4K",
    status: "Upcoming",
    countdown: "2h 45m 12s",
    action: "View Details",
    tone: "purple" as const,
  },
  {
    name: "AtCoder Beginner Contest 345",
    platform: "AtCoder",
    date: "May 19, 2024",
    time: "14:00 (IST)",
    duration: "100 minutes",
    level: "Beginner",
    participants: "8.7K",
    status: "Upcoming",
    countdown: "1d 23h 40m",
    action: "View Details",
    tone: "green" as const,
  },
  {
    name: "CodeChef Starters 121",
    platform: "CodeChef",
    date: "May 20, 2024",
    time: "20:00 (IST)",
    duration: "2 hours",
    level: "Starters",
    participants: "5.3K",
    status: "Upcoming",
    countdown: "2d 5h 40m",
    action: "View Details",
    tone: "orange" as const,
  },
  {
    name: "LeetCode Biweekly Contest 133",
    platform: "LeetCode",
    date: "May 25, 2024",
    time: "22:30 (IST)",
    duration: "1.5 hours",
    level: "All Levels",
    participants: "15.2K",
    status: "Upcoming",
    countdown: "7d 8h 10m",
    action: "View Details",
    tone: "blue" as const,
  },
  {
    name: "Educational Codeforces Round 162 (Rated)",
    platform: "Codeforces",
    date: "May 15, 2024",
    time: "20:05 (IST)",
    duration: "2 hours",
    level: "Rated",
    participants: "7.1K",
    status: "Ongoing",
    countdown: "Live",
    action: "Participate",
    tone: "green" as const,
  },
  {
    name: "AtCoder Regular Contest 168",
    platform: "AtCoder",
    date: "May 11, 2024",
    time: "14:00 (IST)",
    duration: "100 minutes",
    level: "All Levels",
    participants: "9.2K",
    status: "Ended",
    countdown: "Ended",
    action: "View Editorial",
    tone: "slate" as const,
  },
];

const upcoming = [
  ["Codeforces Round 958 (Div. 2)", "May 18, 2024", "17:05 IST", "2h 45m"],
  ["AtCoder Beginner Contest 345", "May 19, 2024", "14:00 IST", "1d 23h"],
  ["CodeChef Starters 121", "May 20, 2024", "20:00 IST", "2d 5h"],
  ["LeetCode Biweekly Contest 133", "May 25, 2024", "22:30 IST", "7d 8h"],
  ["Codeforces Round 959 (Div. 3)", "May 26, 2024", "17:05 IST", "8d 2h"],
];

const platforms = [
  ["Codeforces", "128"],
  ["AtCoder", "96"],
  ["CodeChef", "87"],
  ["LeetCode", "72"],
  ["HackerRank", "54"],
];

export const metadata = { title: "Contests" };

export default function ContestsPage() {
  return (
    <PageShell>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <main className="min-w-0">
          <PageHeading
            badge={
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#fff3e5] text-[#f59e0b]">
                <TrophyIcon />
              </span>
            }
            title="Contests"
            description="Participate in coding contests, improve your skills and climb the rankings."
            actions={
              <>
                <GhostButton>
                  <CalendarIcon />
                  Calendar View
                </GhostButton>
                <PrimaryButton className="w-[46px] px-0 text-[24px]">+</PrimaryButton>
              </>
            }
          />

          <div className="mt-8">
            <Tabs items={["All Contests", "Upcoming", "Ongoing", "Virtual", "Past"]} active="All Contests" />
          </div>

          <Toolbar className="lg:flex-nowrap">
            <SearchField placeholder="Search contests..." className="flex-1" />
            <div className="flex flex-1 flex-wrap gap-3 lg:justify-end">
              <FilterSelect label="All Platforms" />
              <FilterSelect label="All Durations" />
              <FilterSelect label="All Levels" />
              <FilterSelect label="Start Time" wide />
            </div>
          </Toolbar>

          <div className="mt-5 space-y-4">
            {contests.map((contest) => (
              <Surface
                key={contest.name}
                className={`p-5 ${contest.status === "Ongoing" ? "bg-[linear-gradient(180deg,#f8fff9_0%,#fff_100%)]" : ""}`}
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                  <div className="flex items-start gap-4">
                    <div className="grid h-[76px] w-[76px] place-items-center rounded-[22px] border border-[var(--color-border)] bg-[#fbfbfe]">
                      <PlatformGlyph platform={contest.platform} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-[28px] font-extrabold tracking-[-0.03em] text-[#131a2d]">
                          {contest.name}
                        </h2>
                        <Tag>{contest.status === "Ongoing" ? "Rated" : "Virtual"}</Tag>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-5 text-[14px] text-[#65748d]">
                        <span>{contest.platform}</span>
                        <span>{contest.date}</span>
                        <span>{contest.time}</span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Tag tone="orange">{contest.duration}</Tag>
                        <Tag
                          tone={
                            contest.tone === "green"
                              ? "green"
                              : contest.tone === "orange"
                                ? "orange"
                                : contest.tone === "blue"
                                  ? "blue"
                                  : contest.tone === "slate"
                                    ? "slate"
                                    : "purple"
                          }
                        >
                          {contest.level}
                        </Tag>
                        <Tag tone="slate">{contest.participants}</Tag>
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto min-w-[180px] text-center">
                    <Tag
                      tone={
                        contest.status === "Ongoing"
                          ? "blue"
                          : contest.status === "Ended"
                            ? "slate"
                            : "green"
                      }
                    >
                      {contest.status}
                    </Tag>
                    <div className="mt-4 text-[34px] font-extrabold tracking-[-0.03em] text-[#131a2d]">
                      {contest.countdown}
                    </div>
                    <button
                      className={`mt-4 inline-flex h-[44px] min-w-[140px] items-center justify-center rounded-[14px] border px-5 text-[14px] font-bold ${
                        contest.status === "Ongoing"
                          ? "border-transparent bg-gradient-to-r from-[#5b35f4] to-[#744dff] text-white shadow-[0_16px_30px_rgba(91,53,244,0.18)]"
                          : "border-[#d8d0ff] bg-white text-[#5b35f4]"
                      }`}
                    >
                      {contest.action}
                    </button>
                  </div>
                </div>
              </Surface>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <GhostButton>
              Load More
              <ArrowDownIcon />
            </GhostButton>
          </div>
        </main>

        <aside className="space-y-5">
          <RailCard title="Upcoming Contests" action={<button className="text-[13px] font-bold text-[#5b35f4]">View all</button>}>
            <div className="space-y-4">
              {upcoming.map(([name, date, time, eta]) => (
                <div key={name} className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-[14px] border border-[var(--color-border)] bg-[#fbfbfe]">
                    <BarsIcon />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-bold leading-6 text-[#141b2d]">{name}</div>
                    <div className="mt-1 text-[13px] text-[#7a879b]">
                      {date} · {time}
                    </div>
                  </div>
                  <Tag>{eta}</Tag>
                </div>
              ))}
            </div>
          </RailCard>

          <RailCard title="Contest Stats" action={<button className="text-[13px] font-semibold text-[#73819a]">This Month</button>}>
            <div className="grid grid-cols-3 gap-3">
              <MetricTile value="12" label="Participated" icon={<TrophyIcon />} />
              <MetricTile value="7" label="In Top 10" icon={<ChartUpIcon />} />
              <MetricTile value="1520" label="Rating Change" icon={<FlameIcon />} />
            </div>
          </RailCard>

          <RailCard title="Filter Contests" action={<button className="text-[13px] font-bold text-[#5b35f4]">Clear all</button>}>
            <div className="grid gap-4 text-[14px] text-[#516078]">
              <div className="grid grid-cols-2 gap-3">
                {["Virtual", "Onsite", "Rated", "Unrated"].map((item, index) => (
                  <label key={item} className="flex items-center gap-3 rounded-[14px] border border-[var(--color-border)] px-4 py-3">
                    <input defaultChecked={index < 2} type="checkbox" className="h-4 w-4 accent-[#5b35f4]" />
                    {item}
                  </label>
                ))}
              </div>
              <FilterSelect label="All Platforms" />
              <FilterSelect label="All Durations" />
              <FilterSelect label="All Levels" />
            </div>
          </RailCard>

          <RailCard title="Popular Platforms">
            <div className="space-y-4">
              {platforms.map(([name, count]) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-[14px] border border-[var(--color-border)] bg-[#fbfbfe]">
                    <BarsIcon />
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] font-bold text-[#141b2d]">{name}</div>
                    <div className="text-[13px] text-[#7c879b]">Contests: {count}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-5 inline-flex text-[14px] font-bold text-[#5b35f4]">
              View all platforms
            </button>
          </RailCard>
        </aside>
      </div>
    </PageShell>
  );
}

function PlatformGlyph({ platform }: { platform: string }) {
  if (platform === "Codeforces") {
    return (
      <div className="flex items-end gap-1">
        <span className="h-8 w-3 rounded-full bg-[#4ea1ff]" />
        <span className="h-11 w-3 rounded-full bg-[#ffd166]" />
        <span className="h-6 w-3 rounded-full bg-[#ef476f]" />
      </div>
    );
  }
  if (platform === "AtCoder") {
    return <span className="text-[18px] font-black text-[#1f2937]">At</span>;
  }
  if (platform === "CodeChef") {
    return <span className="text-[18px] font-black text-[#9a6b45]">CC</span>;
  }
  return <span className="text-[18px] font-black text-[#f59e0b]">LC</span>;
}

function TrophyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M17 6h3a2 2 0 0 1-2 2h-1" />
      <path d="M7 6H4a2 2 0 0 0 2 2h1" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function BarsIcon() {
  return (
    <div className="flex items-end gap-1">
      <span className="h-7 w-2.5 rounded-full bg-[#4ea1ff]" />
      <span className="h-10 w-2.5 rounded-full bg-[#ffd166]" />
      <span className="h-5 w-2.5 rounded-full bg-[#ef476f]" />
    </div>
  );
}

function ChartUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19h16" />
      <path d="M7 15v-4M12 15V7M17 15v-2" />
      <path d="m6 10 5-4 5 3 2-3" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c2 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-5 0 3 2 3 2 5 0-4 2-5 2-8Z" />
      <path d="M9 14a3 3 0 1 0 6 0c0-1.2-.6-2.1-1.4-2.9-.1 1.3-.8 2.2-1.6 2.9-.3-.9-.9-1.7-1.7-2.4C9.7 12.4 9 13 9 14Z" />
    </svg>
  );
}
