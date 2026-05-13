import { Hero } from "./_components/Hero";
import { FeaturedPosts } from "./_components/FeaturedPosts";
import { ResearchAreas } from "./_components/ResearchAreas";
import { LatestNotes } from "./_components/LatestNotes";
import { Newsletter } from "./_components/Newsletter";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <Hero />
      <FeaturedPosts />
      <ResearchAreas />
      <LatestNotes />
      <Newsletter />
    </div>
  );
}
