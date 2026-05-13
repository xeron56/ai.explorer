import Link from "next/link";
import { BrainIcon, ChartIcon, SigmaIcon, SparklesIcon, EyeIcon } from "./icons";

const AREAS = [
  { href: "/research?topic=deep-learning", title: "Deep Learning", body: "Architectures, training dynamics, and generalization.", icon: BrainIcon, tone: "indigo" },
  { href: "/research?topic=optimization", title: "Optimization", body: "Algorithms, theory, and optimization in machine learning.", icon: ChartIcon, tone: "green" },
  { href: "/research?topic=theory", title: "Theory", body: "Mathematics of ML, information theory, and more.", icon: SigmaIcon, tone: "amber" },
  { href: "/research?topic=generative-models", title: "Generative Models", body: "Diffusion models, VAEs, GANs, and beyond.", icon: SparklesIcon, tone: "blue" },
  { href: "/research?topic=interpretability", title: "Interpretability", body: "Understanding and explaining model behaviors.", icon: EyeIcon, tone: "rose" },
];
const TONES: Record<string, { bg: string; fg: string }> = {
  indigo: { bg: "bg-indigo-50 dark:bg-indigo-500/10", fg: "text-indigo-500" },
  green: { bg: "bg-emerald-50 dark:bg-emerald-500/10", fg: "text-emerald-500" },
  amber: { bg: "bg-amber-50 dark:bg-amber-500/10", fg: "text-amber-500" },
  blue: { bg: "bg-sky-50 dark:bg-sky-500/10", fg: "text-sky-500" },
  rose: { bg: "bg-rose-50 dark:bg-rose-500/10", fg: "text-rose-500" },
};
export function ResearchAreas() {
  return (
    <section className="pb-14">
      <h2 className="text-2xl font-bold tracking-tight">Research Areas</h2>
      <p className="text-[14px] text-[var(--color-fg-muted)] mt-1">Topics I work on and explore.</p>
      <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {AREAS.map(({ href, title, body, icon: Icon, tone }) => {
          const t = TONES[tone];
          return (
            <Link key={title} href={href}
              className="rounded-2xl border p-5 hover:shadow-md hover:-translate-y-0.5 transition-all bg-[var(--color-bg)]"
              style={{ borderColor: "var(--color-border)" }}>
              <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${t.bg} ${t.fg}`}>
                <Icon />
              </div>
              <div className="font-semibold text-[15px] leading-tight">{title}</div>
              <p className="mt-2 text-[12.5px] leading-5 text-[var(--color-fg-muted)]">{body}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
