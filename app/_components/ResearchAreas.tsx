import Link from "next/link";
import { getResearchAreas } from "../_lib/posts";
import { BrainIcon, ChartIcon, SigmaIcon, SparklesIcon, EyeIcon } from "./icons";

const ICONS = {
  brain: BrainIcon,
  chart: ChartIcon,
  sigma: SigmaIcon,
  sparkles: SparklesIcon,
  eye: EyeIcon,
};
const TONES: Record<string, { bg: string; fg: string }> = {
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-500/10", fg: "text-indigo-500" },
  green: { bg: "bg-emerald-50 dark:bg-emerald-500/10", fg: "text-emerald-500" },
  amber: { bg: "bg-amber-50 dark:bg-amber-500/10", fg: "text-amber-500" },
  blue: { bg: "bg-sky-50 dark:bg-sky-500/10", fg: "text-sky-500" },
  rose: { bg: "bg-rose-50 dark:bg-rose-500/10", fg: "text-rose-500" },
};
export async function ResearchAreas() {
  const areas = await getResearchAreas();
  if (areas.length === 0) return null;

  return (
    <section className="pb-[41px]">
      <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#10172d]">Research Areas</h2>
      <p className="mt-[7px] text-[13px] text-[#44516a]">Topics I work on and explore.</p>
      <div className="mt-[24px] grid grid-cols-2 gap-[18px] md:grid-cols-3 lg:grid-cols-5">
        {areas.map(({ href, title, description, icon, tone }) => {
          const Icon = ICONS[icon as keyof typeof ICONS] ?? BrainIcon;
          const t = TONES[tone] ?? TONES.indigo;
          return (
            <Link key={title} href={href}
              className="min-h-[194px] rounded-[8px] border bg-white p-[17px] transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderColor: "var(--color-border)" }}>
              <div className={`mb-[24px] flex h-[42px] w-[42px] items-center justify-center rounded-full ${t.bg} ${t.fg}`}>
                <Icon />
              </div>
              <div className="text-[13px] font-bold leading-tight text-[#10172d]">{title}</div>
              <p className="mt-[15px] text-[13px] leading-[21px] text-[#44516a]">{description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
