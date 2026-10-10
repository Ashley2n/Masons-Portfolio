import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";
import { videos } from "@/content/home";

const VideoCard = () => (
  <div>
    <div className="bg-neutral-700 w-full h-32 rounded-lg"></div>
    <h4 className="text-neutral-800 font-medium pt-2">My First Video</h4>
    <p className="text-sm ">01/12/2024</p>
  </div>
);

export default function RecentWorkSection() {
  return (
    <section className="h-screen bg-neutral-100 px-23 py-16 ">
      <div className="space-y-6">
        <Eyebrow>Media</Eyebrow>
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-neutral-800">Recent Work</h2>
          <Link
            className="uppercase text-neutral-700 border-b-2 border-b-transparent hover:border-b-neutral-700 transition-all duration-500"
            href="/media"
          >
            View More
            <ArrowUpRight aria-hidden="true" className="ml-2 inline size-4" />
          </Link>
        </div>
        <div className="bg-neutral-700 w-full h-70 rounded-lg"></div>
      </div>
      <div>
        <h2 className="text-neutral-800">Other Work</h2>
        <div className="grid grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard key={video.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
