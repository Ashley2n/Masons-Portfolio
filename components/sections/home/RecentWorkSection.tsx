import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import VideoCard from "@/components/ui/VideoCard";
import { sectionHeadings, videos } from "@/content/home";
import { selectHomeVideos } from "@/lib/video";
import type { Video } from "@/types/content";

type RecentWorkSectionProps = {
  /** Defaults to Mason's video list; tests pass their own to cover the Other Work rule (C25) */
  videos?: Video[];
};

export default function RecentWorkSection({ videos: list = videos }: RecentWorkSectionProps) {
  const { featured, others } = selectHomeVideos(list);
  const copy = sectionHeadings.recentWork;

  return (
    <section className="bg-neutral-950 py-16">
      <Container className="space-y-12">
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <SectionHeading title={copy.title} />
            <Link
              href="/media"
              className="touch-target caption-text inline-flex shrink-0 items-center border-b-2 border-transparent text-neutral-300 transition-colors duration-300 hover:border-neutral-300"
            >
              {copy.viewMore}
            </Link>
          </div>
          {featured && (
            <VideoCard
              tone="dark"
              video={featured}
              sizes="(min-width: 1280px) 1280px, 100vw"
              frameClassName="lg:aspect-21/9"
            />
          )}
        </div>

        {others.length > 0 && (
          <section aria-labelledby="other-work-heading" className="space-y-6">
            <h2 id="other-work-heading" className="text-neutral-100">
              {copy.otherWork}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {others.map((video) => (
                <VideoCard key={video.id} tone="dark" video={video} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </section>
  );
}
