export const metadata = { title: "About" };
export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto pt-10 pb-16 prose-post">
      <h1>About</h1>
      <p>Hi — I'm the author of <strong>ai.explorer</strong>. I write about deep learning, optimization, mathematics of machine learning, and the slow accumulation of intuition that turns a paper into a working model.</p>
      <p>This site is built with Next.js, MDX, and KaTeX so I can mix prose, code, and equations without thinking about plumbing.</p>
      <p>If something here was useful, say hi — links are in the sidebar.</p>
    </div>
  );
}
