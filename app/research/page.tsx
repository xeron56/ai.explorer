import Link from "next/link";
export const metadata = { title: "Research" };
const TOPICS = [
  { slug: "deep-learning", title: "Deep Learning", body: "Architectures, training dynamics, and generalization." },
  { slug: "optimization", title: "Optimization", body: "Algorithms, theory, and optimization in machine learning." },
  { slug: "theory", title: "Theory", body: "Mathematics of ML, information theory, and more." },
  { slug: "generative-models", title: "Generative Models", body: "Diffusion models, VAEs, GANs, and beyond." },
  { slug: "interpretability", title: "Interpretability", body: "Understanding and explaining model behaviors." },
];
export default function ResearchPage() {
  return (
    <div className="max-w-4xl mx-auto pt-10 pb-16">
      <h1 className="text-4xl font-extrabold tracking-tight">Research</h1>
      <p className="text-[var(--color-fg-muted)] mt-2">Topics I'm currently exploring and writing about.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {TOPICS.map((t) => (
          <Link key={t.slug} href={`/blog?category=${encodeURIComponent(t.title)}`}
            className="rounded-2xl border p-6 hover:shadow-md hover:-translate-y-0.5 transition-all bg-[var(--color-bg)]"
            style={{ borderColor: "var(--color-border)" }}>
            <h3 className="font-semibold text-lg">{t.title}</h3>
            <p className="mt-2 text-[13.5px] text-[var(--color-fg-muted)] leading-6">{t.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
