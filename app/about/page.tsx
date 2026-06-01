import {
  PageHeading,
  PageShell,
  RailCard,
  Surface,
  Tabs,
} from "../_components/pagePrimitives";

const features = [
  ["All-in-One Platform", "Everything you need to code, learn, and grow in one place.", "green"],
  ["Curated Content", "High quality tutorials, editorials, and resources created by experts.", "purple"],
  ["Active Community", "Learn, discuss, and grow together with a passionate community.", "amber"],
  ["Track Progress", "Monitor your progress, streaks, and rankings over time.", "blue"],
  ["Privacy First", "Your data is secure and we never share your personal information.", "pink"],
];

const stats = [
  ["150K+", "Active Users", "code"],
  ["1.2M+", "Problems Solved", "spark"],
  ["25K+", "Contests Hosted", "trophy"],
  ["3.5K+", "Tutorials & Articles", "book"],
  ["500K+", "Notes Created", "bookmark"],
  ["120K+", "Community Members", "users"],
];

const stack = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "PostgreSQL",
  "Redis",
  "Docker",
];

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PageShell>
      <PageHeading
        badge={
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#efeaff] text-[#5b35f4]">
            <InfoIcon />
          </span>
        }
        title="About"
        description="Learn more about code.explorer, our mission, and the people behind it."
      />

      <div className="mt-8">
        <Tabs items={["Overview", "Mission", "Team", "Careers", "Contact"]} active="Overview" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_460px]">
        <Surface className="p-7">
          <div className="grid gap-6 lg:grid-cols-[220px_1fr] lg:items-center">
            <Illustration />
            <div>
              <h2 className="text-[40px] font-extrabold tracking-[-0.04em] text-[#141b2d]">
                Welcome to <span className="text-[#5b35f4]">code.explorer</span>
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-[#56647f]">
                Your all-in-one platform to practice coding, participate in contests, learn from
                tutorials, save notes, and collaborate with a community of developers worldwide.
              </p>
              <div className="mt-6 flex flex-wrap gap-5">
                {[
                  ["Practice", "Solve problems"],
                  ["Learn", "Explore tutorials"],
                  ["Compete", "Join contests"],
                ].map(([label, desc]) => (
                  <div key={label} className="rounded-[16px] border border-[var(--color-border)] bg-[#fbfbfe] px-4 py-3">
                    <div className="text-[14px] font-bold text-[#141b2d]">{label}</div>
                    <div className="mt-1 text-[13px] text-[#7a869b]">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Surface>

        <Surface className="p-7">
          <h2 className="text-[18px] font-extrabold text-[#141b2d]">code.explorer in Numbers</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {stats.map(([value, label, icon]) => (
              <div key={label} className="rounded-[20px] border border-[var(--color-border)] p-5">
                <div className="mb-3 grid h-12 w-12 place-items-center rounded-[16px] bg-[#f6f4ff] text-[#5b35f4]">
                  <StatIcon kind={icon} />
                </div>
                <div className="text-[30px] font-extrabold tracking-[-0.03em] text-[#12182b]">{value}</div>
                <div className="mt-2 text-[13px] text-[#687690]">{label}</div>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-5">
        {features.map(([title, description, tone]) => (
          <Surface key={title} className="p-5 text-center">
            <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${toneBg(tone)} ${toneText(tone)}`}>
              <FeatureIcon tone={tone} />
            </div>
            <h3 className="mt-5 text-[20px] font-extrabold tracking-[-0.03em] text-[#141b2d]">{title}</h3>
            <p className="mt-3 text-[14px] leading-7 text-[#5d6b84]">{description}</p>
          </Surface>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px]">
        <Surface className="p-7">
          <h2 className="text-[28px] font-extrabold tracking-[-0.03em] text-[#141b2d]">Our Story</h2>
          <div className="mt-5 space-y-5 text-[15px] leading-8 text-[#56647f]">
            <p>
              code.explorer was started with a simple idea: make coding practice and learning
              accessible, structured, and enjoyable for everyone.
            </p>
            <p>
              Whether you are a beginner taking your first steps in programming or an experienced
              engineer preparing for interviews and contests, we are here to support your journey.
            </p>
            <p>
              We continuously build and improve the platform based on your feedback. Thank you for
              being a part of our journey.
            </p>
          </div>
          <div className="mt-6 rounded-[22px] bg-[#f7f3ff] px-5 py-6">
            <div className="text-[28px] font-black text-[#5b35f4]">"</div>
            <p className="mt-2 text-[20px] font-semibold leading-8 text-[#5b35f4]">
              The best way to predict the future is to create it.
            </p>
            <div className="mt-3 text-[15px] font-bold text-[#4f5d78]">Alan Kay</div>
          </div>
        </Surface>

        <div className="space-y-6">
          <RailCard title="Technology Stack">
            <p className="text-[14px] leading-7 text-[#5d6b84]">
              Built using modern technologies for performance, scalability and reliability.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {stack.map((item) => (
                <div key={item} className="rounded-[16px] border border-[var(--color-border)] px-4 py-3 text-[14px] font-bold text-[#141b2d]">
                  {item}
                </div>
              ))}
            </div>
          </RailCard>

          <RailCard title="Connect with us">
            <p className="text-[14px] leading-7 text-[#5d6b84]">
              We&apos;d love to hear from you. Follow us on social media or reach out anytime.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {["GitHub", "Twitter", "LinkedIn", "YouTube", "Email"].map((item) => (
                <button
                  key={item}
                  className="grid h-12 w-12 place-items-center rounded-[16px] border border-[var(--color-border)] bg-white text-[12px] font-bold text-[#141b2d]"
                >
                  {item.slice(0, 2)}
                </button>
              ))}
            </div>
          </RailCard>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6 text-[14px] text-[#738099]">
        <span>© 2024 code.explorer. All rights reserved.</span>
        <div className="flex flex-wrap gap-6">
          <button>Privacy Policy</button>
          <button>Terms of Service</button>
          <button>Cookie Policy</button>
        </div>
      </div>
    </PageShell>
  );
}

function toneBg(tone: string) {
  if (tone === "green") return "bg-[#edfdf3]";
  if (tone === "amber") return "bg-[#fff7e9]";
  if (tone === "blue") return "bg-[#eef5ff]";
  if (tone === "pink") return "bg-[#fff0f6]";
  return "bg-[#f5f3ff]";
}

function toneText(tone: string) {
  if (tone === "green") return "text-[#16a34a]";
  if (tone === "amber") return "text-[#f59e0b]";
  if (tone === "blue") return "text-[#2563eb]";
  if (tone === "pink") return "text-[#db2777]";
  return "text-[#5b35f4]";
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v.01M11 12h1v4h1" />
    </svg>
  );
}

function Illustration() {
  return (
    <svg viewBox="0 0 280 210" className="w-full" fill="none">
      <rect x="34" y="46" width="170" height="102" rx="12" fill="#ffffff" stroke="#c9d3e5" strokeWidth="4" />
      <rect x="58" y="66" width="122" height="62" rx="8" fill="#f4f0ff" />
      <path d="M98 81 80 97l18 16" stroke="#5b35f4" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m142 81 18 16-18 16" stroke="#5b35f4" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m126 76-12 45" stroke="#5b35f4" strokeWidth="6" strokeLinecap="round" />
      <path d="M86 165h70" stroke="#7d889e" strokeWidth="5" strokeLinecap="round" />
      <path d="M120 149v16" stroke="#7d889e" strokeWidth="5" strokeLinecap="round" />
      <path d="M40 145c-14 0-20 8-20 18 0 10 7 18 18 18" stroke="#6fcf97" strokeWidth="6" strokeLinecap="round" />
      <path d="M224 129h24c8 0 14 6 14 14v20h-38z" fill="#7c5cff" />
    </svg>
  );
}

function FeatureIcon({ tone }: { tone: string }) {
  if (tone === "green") return <ShieldIcon />;
  if (tone === "amber") return <UsersIcon />;
  if (tone === "blue") return <ChartIcon />;
  if (tone === "pink") return <LockIcon />;
  return <CodeIcon />;
}

function StatIcon({ kind }: { kind: string }) {
  if (kind === "spark") return <SparkIcon />;
  if (kind === "trophy") return <TrophyIcon />;
  if (kind === "book") return <BookIcon />;
  if (kind === "bookmark") return <BookmarkIcon />;
  if (kind === "users") return <UsersIcon />;
  return <CodeIcon />;
}

function CodeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m13 2-1 7h5l-6 13 1-9H7l6-11Z" />
    </svg>
  );
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

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4h12v17l-6-4-6 4z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19h16" />
      <path d="M7 15v-4M12 15V7M17 15v-2" />
      <path d="m6 10 5-4 5 3 2-3" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
