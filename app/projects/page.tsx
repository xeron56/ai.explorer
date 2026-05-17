import Link from "next/link";
import { ArrowRightIcon, GithubIcon } from "../_components/icons";
import { getAllProjects, type Project } from "../_lib/posts";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getAllProjects();
  const filters = ["All Projects", "Featured", ...Array.from(new Set(projects.map((project) => project.type)))];

  return (
    <div className="mx-auto max-w-[946px] pb-[48px] pt-[46px]">
      <ProjectsHero />
      <ProjectFilters filters={filters} />
      <div className="mt-[43px] grid gap-[38px] xl:grid-cols-[minmax(0,1fr)_226px]">
        <main>
          <div className="mb-[24px] flex items-end justify-between gap-4">
            <div>
              <h2 className="text-[20px] font-bold tracking-[-0.01em] text-[#10172d]">All Projects</h2>
              <p className="mt-[9px] text-[13px] text-[#44516a]">Exploring ideas through code and experiments.</p>
            </div>
            <div className="flex items-center gap-[12px] text-[13px] text-[#44516a]">
              Sort by:
              <button className="inline-flex h-[38px] items-center gap-[16px] rounded-[7px] border bg-white px-[15px] font-semibold text-[#10172d]" style={{ borderColor: "var(--color-border)" }}>
                Latest <ChevronDownIcon />
              </button>
            </div>
          </div>
          <div className="grid gap-[22px]">
            {projects.map((project) => (
              <ProjectRow key={project.title} project={project} />
            ))}
          </div>
          <Pagination />
        </main>
        <ProjectSidebar projects={projects} />
      </div>
      <OpenSourceCta />
    </div>
  );
}

function ProjectsHero() {
  return (
    <section className="grid min-h-[194px] items-center gap-8 lg:grid-cols-[1fr_395px]">
      <div>
        <h1 className="text-[42px] font-extrabold leading-tight tracking-[-0.025em] text-[#10172d]">Projects</h1>
        <p className="mt-[15px] max-w-[480px] text-[18px] leading-[31px] text-[#263458]">
          A collection of AI projects, experiments, and tools I build to explore ideas and solve problems.
        </p>
      </div>
      <ProjectsArtwork />
    </section>
  );
}

function ProjectFilters({ filters }: { filters: string[] }) {
  return (
    <div className="mt-[28px] flex flex-wrap gap-[16px]">
      {filters.map((filter, index) => (
        <button
          key={filter}
          className={`h-[36px] rounded-full border px-[22px] text-[13px] font-semibold ${
            index === 0
              ? "border-transparent bg-gradient-to-r from-[#5a34f4] to-[#704cff] text-white shadow-[0_10px_22px_rgba(91,53,244,0.18)]"
              : "border-[var(--color-border)] bg-white text-[#263458]"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <article className="grid gap-[20px] rounded-[8px] border bg-white p-[14px] shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:grid-cols-[140px_1fr]" style={{ borderColor: "var(--color-border)" }}>
      <ProjectThumb variant={project.variant} />
      <div className="py-[3px]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-[12px]">
            <h3 className="text-[17px] font-bold leading-[24px] text-[#10172d]">{project.title}</h3>
            {project.featured && (
              <span className="rounded-full bg-[var(--color-accent-soft)] px-[11px] py-[5px] text-[11px] font-bold leading-none text-[var(--color-accent-strong)]">Featured</span>
            )}
          </div>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-[9px] max-w-[425px] text-[14px] leading-[24px] text-[#263458]">{project.description}</p>
        <div className="mt-[13px] flex flex-wrap gap-[10px]">
          {project.tags.map((tag) => (
            <span key={tag} className={`rounded-[7px] px-[11px] py-[6px] text-[11px] font-semibold leading-none ${tagClass(tag)}`}>{tag}</span>
          ))}
        </div>
        <div className="mt-[18px] flex flex-wrap items-center gap-[25px] text-[12px] text-[#59657b]">
          <span className="inline-flex items-center gap-[6px]"><StarIcon />{project.stars}</span>
          <span className="inline-flex items-center gap-[6px]"><GithubIcon width={14} height={14} />Code</span>
          <span className="inline-flex items-center gap-[6px]"><CalendarIcon />{project.date}</span>
        </div>
      </div>
    </article>
  );
}

function ProjectSidebar({ projects }: { projects: Project[] }) {
  const statusCounts = countBy(projects.map((project) => project.status));
  const typeCounts = countBy(projects.map((project) => project.type));
  const techCounts = countBy(projects.flatMap((project) => project.techStack));
  const totalStars = projects.reduce((sum, project) => sum + project.stars, 0);

  return (
    <aside className="hidden xl:block">
      <div className="space-y-[26px]">
        <SideCard>
          <h3 className="text-[12px] font-extrabold uppercase tracking-[0.02em] text-[#10172d]">Filters</h3>
          <FilterGroup title="Status" items={[["All", String(projects.length), true], ...Object.entries(statusCounts).map(([label, count]) => [label, String(count)] as [string, string])]} />
          <FilterGroup title="Type" items={Object.entries(typeCounts).map(([label, count]) => [label, String(count), false, label === "Research" ? "nodes" : label === "Experiments" ? "flask" : "tools"])} />
          <FilterGroup title="Tech Stack" items={Object.entries(techCounts).map(([label, count]) => [label, String(count)] as [string, string])} />
          <button className="mt-[14px] text-[13px] font-bold text-[var(--color-accent-strong)]">Show more</button>
        </SideCard>
        <SideCard>
          <h3 className="text-[12px] font-extrabold uppercase tracking-[0.02em] text-[#10172d]">Project Stats</h3>
          <div className="mt-[27px] grid gap-[19px]">
            <StatLine value={String(projects.length)} label="Total Projects" color="text-[var(--color-accent-strong)]" />
            <StatLine value={String(statusCounts.Completed ?? 0)} label="Completed" color="text-emerald-600" />
            <StatLine value={String(statusCounts["In Progress"] ?? 0)} label="In Progress" color="text-[var(--color-accent-strong)]" />
            <StatLine value={String(statusCounts.Prototype ?? 0)} label="Prototypes" color="text-orange-500" />
            <StatLine value={formatStars(totalStars)} label="Total GitHub Stars" color="text-orange-500" />
          </div>
          <svg viewBox="0 0 180 40" className="mt-[15px] h-[34px] w-full" fill="none">
            <path d="M2 32c18 0 25-3 43-4s27-7 45-8 21-5 39-4 31-6 49-8" stroke="#8a75ff" strokeWidth="2" />
          </svg>
        </SideCard>
        <section className="rounded-[8px] border border-[#d7cdff] bg-[#f8f5ff] p-[20px]">
          <div className="flex items-start gap-[16px]">
            <FlaskIcon className="h-[40px] w-[40px] shrink-0 text-[var(--color-accent-strong)]" />
            <div>
              <h3 className="text-[16px] font-bold text-[#10172d]">Have an idea?</h3>
              <p className="mt-[9px] text-[14px] leading-[23px] text-[#44516a]">I love building things that explore and push the boundaries of AI.</p>
            </div>
          </div>
          <Link href="/projects" className="mt-[22px] inline-flex h-[36px] items-center gap-2 rounded-[6px] bg-gradient-to-r from-[#5a34f4] to-[#704cff] px-[20px] text-[13px] font-bold text-white">
            Let&apos;s Build <ArrowRightIcon width={14} height={14} />
          </Link>
        </section>
      </div>
    </aside>
  );
}

function OpenSourceCta() {
  return (
    <section className="mt-[34px] flex min-h-[78px] items-center gap-[22px] rounded-[8px] border border-[#d7cdff] bg-[#f8f5ff] px-[28px] py-[17px]">
      <RocketIcon className="h-[40px] w-[40px] shrink-0 text-[var(--color-accent-strong)]" />
      <div className="flex-1">
        <h3 className="text-[15px] font-bold text-[#10172d]">Open source & reproducible</h3>
        <p className="mt-[7px] text-[14px] text-[#44516a]">All my projects are open source so you can learn, use, and contribute.</p>
      </div>
      <Link href="https://github.com" className="inline-flex h-[42px] items-center gap-[12px] rounded-[7px] border bg-white px-[30px] text-[14px] font-bold text-[#10172d]" style={{ borderColor: "var(--color-border)" }}>
        <GithubIcon /> View on GitHub
      </Link>
    </section>
  );
}

function SideCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="rounded-[8px] border bg-white p-[20px] shadow-[0_8px_24px_rgba(15,23,42,0.04)]" style={{ borderColor: "var(--color-border)" }}>
      {children}
    </section>
  );
}

function FilterGroup({ title, items }: { title: string; items: Array<[string, string, boolean?, string?]> }) {
  return (
    <div className="mt-[25px]">
      <h4 className="text-[13px] font-bold text-[#10172d]">{title}</h4>
      <div className="mt-[15px] grid gap-[16px]">
        {items.map(([label, count, checked, icon]) => (
          <label key={label} className="flex items-center gap-[10px] text-[13px] text-[#44516a]">
            {icon ? <SmallTypeIcon type={icon} /> : <span className={`h-[14px] w-[14px] rounded-[3px] border ${checked ? "border-[var(--color-accent-strong)] bg-[var(--color-accent-strong)]" : "border-[#a8b0c2]"}`}>{checked ? <span className="block text-center text-[10px] leading-[12px] text-white">✓</span> : null}</span>}
            <span className={checked ? "font-semibold text-[var(--color-accent-strong)]" : ""}>{label}</span>
            <span className="ml-auto rounded-full bg-[#f0f1f7] px-[8px] py-[3px] text-[11px] font-bold text-[#7b849b]">{count}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function ProjectThumb({ variant }: { variant: string }) {
  return (
    <div className="h-[150px] overflow-hidden rounded-[7px] border bg-[#fbfcff]" style={{ borderColor: "var(--color-border)" }}>
      <svg viewBox="0 0 150 150" className="h-full w-full" fill="none">
        {variant === "network" && <NetworkArt />}
        {variant === "scatter" && <ScatterArt />}
        {variant === "diffusion" && <DiffusionArt />}
        {variant === "optimizer" && <OptimizerArt />}
        {variant === "terminal" && <TerminalArt />}
        {variant === "grid" && <GridArt />}
      </svg>
    </div>
  );
}

function NetworkArt() {
  return (
    <>
      <rect width="150" height="150" fill="#101827" />
      <g stroke="#8f7dff" strokeWidth="1">
        <path d="M38 54 63 40 91 58 115 44M42 97 68 76 94 93 119 80M63 40 68 76 91 58 94 93" />
      </g>
      {[38, 63, 91, 115, 42, 68, 94, 119].map((x, i) => <circle key={i} cx={x} cy={i < 4 ? [54, 40, 58, 44][i] : [97, 76, 93, 80][i - 4]} r="5" fill="#8f7dff" />)}
    </>
  );
}

function ScatterArt() {
  return (
    <>
      <rect width="150" height="150" fill="#fff" />
      <path d="M24 125H126M26 125V24" stroke="#cbd2df" />
      {Array.from({ length: 55 }).map((_, i) => <circle key={i} cx={30 + ((i * 29) % 84)} cy={28 + ((i * 47) % 85)} r="3" fill={i % 3 === 0 ? "#7b61ff" : "#6fd0b5"} opacity="0.75" />)}
    </>
  );
}

function DiffusionArt() {
  return (
    <>
      <rect width="150" height="150" fill="#fff" />
      <g stroke="#8b96aa" strokeWidth="1.3">
        <circle cx="35" cy="70" r="12" />
        <circle cx="75" cy="70" r="12" />
        <circle cx="115" cy="70" r="12" />
        <path d="M47 70H63M87 70H103" />
        <text x="25" y="110" fontSize="11" fill="#48536a">q(x<tspan dy="3" fontSize="8">t</tspan>|x<tspan dy="3" fontSize="8">t-1</tspan>)</text>
      </g>
    </>
  );
}

function OptimizerArt() {
  return (
    <>
      <rect width="150" height="150" fill="#fbfffe" />
      <g stroke="#ccefe8" strokeWidth="1">
        <ellipse cx="76" cy="73" rx="60" ry="28" transform="rotate(-25 76 73)" />
        <ellipse cx="76" cy="73" rx="44" ry="21" transform="rotate(-25 76 73)" />
        <ellipse cx="76" cy="73" rx="27" ry="13" transform="rotate(-25 76 73)" />
      </g>
      <path d="M30 36c13 26 23 35 38 50s25 20 47 28" stroke="#4b6cff" strokeWidth="2" />
      {[30, 55, 73, 96, 115].map((x, i) => <circle key={x} cx={x} cy={[36, 68, 86, 103, 114][i]} r="3" fill="#4b6cff" />)}
      <path d="M31 36l4 2-4 3-3-4z" fill="#ffb12e" />
    </>
  );
}

function TerminalArt() {
  return (
    <>
      <rect width="150" height="150" fill="#101827" />
      <text x="18" y="28" fontSize="10" fill="#fff" fontFamily="monospace">loss = model(x, y)</text>
      <text x="18" y="44" fontSize="10" fill="#fff" fontFamily="monospace">loss.backward()</text>
      <text x="18" y="60" fontSize="10" fill="#fff" fontFamily="monospace">optimizer.step()</text>
      <path d="M20 112H130M20 112c22-34 42 12 60-16s28 8 50-28" stroke="#8f7dff" />
      <path d="M20 126h112" stroke="#2d3850" />
    </>
  );
}

function GridArt() {
  return (
    <>
      <rect width="150" height="150" fill="#fff" />
      <text x="22" y="28" fontSize="9" fill="#263458" fontFamily="monospace">Hello</text>
      <text x="77" y="28" fontSize="9" fill="#263458" fontFamily="monospace">world</text>
      <g stroke="#7b61ff" strokeWidth="1">
        {Array.from({ length: 5 }).map((_, i) => <path key={`h-${i}`} d={`M24 ${55 + i * 16}H126`} />)}
        {Array.from({ length: 7 }).map((_, i) => <path key={`v-${i}`} d={`M${24 + i * 16} 55V119`} />)}
        <path d="M45 88H96" />
      </g>
    </>
  );
}

function ProjectsArtwork() {
  return (
    <svg viewBox="0 0 395 194" className="h-[194px] w-full" fill="none">
      <defs>
        <linearGradient id="projectCube" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#cfc6ff" />
          <stop offset="1" stopColor="#5f3cf1" />
        </linearGradient>
        <filter id="projectShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#765cff" floodOpacity="0.18" />
        </filter>
      </defs>
      <g stroke="#e4e7f4">
        <path d="M52 84 164 28 344 90" />
        <path d="M82 130 196 72 372 130" />
        <path d="M130 30 310 136" />
        <path d="M80 112 252 20" />
      </g>
      <g filter="url(#projectShadow)">
        <rect x="92" y="82" width="118" height="68" rx="8" fill="#fff" stroke="#e0ddff" />
        <circle cx="106" cy="98" r="3" fill="#ff6a83" />
        <circle cx="116" cy="98" r="3" fill="#ffc45a" />
        <circle cx="126" cy="98" r="3" fill="#57d68d" />
        <path d="M108 118h76M108 131h54M108 144h70" stroke="#bcb2ff" strokeWidth="4" strokeLinecap="round" />
        <rect x="150" y="45" width="60" height="60" rx="4" fill="url(#projectCube)" />
        <path d="M150 45 180 30l30 15-30 15z" fill="#ded8ff" />
        <rect x="174" y="24" width="20" height="20" rx="3" fill="url(#projectCube)" />
        <rect x="282" y="63" width="32" height="32" rx="3" fill="url(#projectCube)" />
        <rect x="277" y="122" width="40" height="40" rx="4" fill="#ded8ff" />
        <rect x="308" y="80" width="72" height="68" rx="5" fill="#fbfaff" stroke="#e0ddff" />
        <path d="M324 119c11-34 21 18 33-14 5-13 10-7 15-2" stroke="#bcb2ff" strokeWidth="4" strokeLinecap="round" />
        <path d="M326 135h10M342 135h10M358 135h10" stroke="#765cff" strokeWidth="5" />
      </g>
    </svg>
  );
}

function Pagination() {
  return (
    <div className="mt-[28px] flex justify-center gap-[9px]">
      {["‹", "1", "2", "3", "...", "6", "›"].map((item) => (
        <button key={item} className={`h-[34px] min-w-[34px] rounded-[7px] border px-[10px] text-[13px] font-semibold ${item === "1" ? "border-transparent bg-gradient-to-r from-[#5a34f4] to-[#704cff] text-white" : "bg-white text-[#263458]"}`} style={{ borderColor: item === "1" ? "transparent" : "var(--color-border)" }}>
          {item}
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = status === "Completed" ? "text-emerald-600" : status === "In Progress" ? "text-orange-500" : "text-blue-600";
  return (
    <span className={`inline-flex items-center gap-[7px] whitespace-nowrap text-[12px] font-semibold ${color}`}>
      <span className="h-[6px] w-[6px] rounded-full bg-current" />
      {status}
    </span>
  );
}

function tagClass(tag: string) {
  if (tag === "Optimization") return "bg-emerald-50 text-emerald-600";
  if (tag === "Machine Learning") return "bg-sky-50 text-sky-600";
  return "bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]";
}
function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}
function formatStars(stars: number) {
  return stars >= 1000 ? `${Number((stars / 1000).toFixed(1))}k` : String(stars);
}

function StatLine({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="grid grid-cols-[42px_1fr] items-center gap-[10px]">
      <div className={`text-[22px] font-extrabold ${color}`}>{value}</div>
      <div className="text-[12px] leading-[16px] text-[#44516a]">{label}</div>
    </div>
  );
}

function SmallTypeIcon({ type }: { type: string }) {
  return (
    <span className="flex h-[14px] w-[14px] items-center justify-center text-[#10172d]">
      {type === "nodes" ? <NodesIcon /> : type === "flask" ? <FlaskMiniIcon /> : <ToolsIcon />}
    </span>
  );
}

function StarIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z" /></svg>; }
function CalendarIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3v4M16 3v4M4 10h16" /></svg>; }
function ChevronDownIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>; }
function NodesIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3 7 4v10l-7 4-7-4V7z" /><path d="M12 12 5 7M12 12l7-5M12 12v9" /></svg>; }
function ToolsIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a4 4 0 0 0-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-3 3-3-3z" /></svg>; }
function FlaskMiniIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 3h6M10 3v6l-5 9c-.7 1.3.2 3 1.7 3h10.6c1.5 0 2.4-1.7 1.7-3l-5-9V3" /></svg>; }
function FlaskIcon(props: React.SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d="M25 8h14" /><path d="M28 8v19L14 51c-2 4 1 7 5 7h26c4 0 7-3 5-7L36 27V8" /><path d="M22 45h20" /></svg>; }
function RocketIcon(props: React.SVGProps<SVGSVGElement>) { return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d="M34 6c10 4 15 13 16 27L35 48 16 29C21 15 27 9 34 6z" /><path d="M20 43 10 54l11-2M47 27l7 16-11-3M30 34l-9 9" /><circle cx="37" cy="22" r="5" /></svg>; }
