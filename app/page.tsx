"use client";
import { ComponentPropsWithoutRef, ReactNode, useState } from "react";
import {
  ExpertiseCardType,
  ExpertiseData,
  ModelImageType,
  ModelShotsData,
  statsData,
  StatsType,
  VideoCardData,
} from "./lib/constants";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import Image from "next/image";

const DotSeperator = () => <span className="text-xs "> • </span>;
const SecondaryBtn = () => (
  <button className="border rounded-md border-brand-600 flex gap-6 px-8 py-4 bg-neutral-950 text-neutral-100 text-sm w-fit">
    <p>VIEW WORK</p>
    <span className="font-bold">↗</span>
  </button>
);
export default function Home() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <ExpertiseSection />
      <RecentSection />
      <ModelShotsSections />
    </>
  );
}

const HeroSection = () => (
  <main className="flex flex-col gap-8 h-210 justify-end pb-20 px-23">
    <div>
      <div className="text-brand-600 text-sm gap-3 flex items-center uppercase">
        <p>Actor</p>
        <DotSeperator />
        <p>Musician</p>
        <DotSeperator />
        <p>Singer</p>
        <DotSeperator />
        <p>Designer</p>
      </div>
      <div className="display-font">
        Mason <br /> Farrington
      </div>
    </div>
    <p className="w-sm">
      A multidicinaplinary artist creating meaningful experiences through
      performance and design
    </p>
    <SecondaryBtn />
  </main>
);

const Stat = ({ metric, desc }: StatsType) => (
  <div>
    <p className="font-playfair text-7xl text-brand-800">
      {metric}
      <span className="text-brand-600 text-4xl">+</span>
    </p>
    <p className="text-neutral-700">{desc}</p>
  </div>
);
type GlowBackgroundType = {
  children: ReactNode;
  className: ComponentPropsWithoutRef<"section">["className"];
};
const GlowBackground = ({ children, className }: GlowBackgroundType) => (
  <section
    className={twMerge(
      "relative isolate min-h-screen overflow-hidden bg-white",
      className,
    )}
  >
    {/* Background layer: the glow */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <div className="absolute -bottom-40 -right-40 h-164 w-166 rounded-full bg-brand-500 opacity-70 blur-[120px]" />
    </div>

    {/* Foreground: anything you put here is unaffected by the glow */}
    {children}
  </section>
);

const IntroSection = () => (
  <GlowBackground className="h-screen bg-neutral-100 px-23 py-16">
    <div className="space-y-4">
      <p className="caption-text text-brand-600 ">About Me</p>
      <h2 className="text-neutral-800">The Journey So Far</h2>
      <p className="max-w-md text-neutral-600">
        Years of training, stages, and performances that shaped where I am today
      </p>
    </div>
    <div className="flex justify-between py-8">
      {statsData.map((d, _) => (
        <Stat key={_} metric={d.metric} desc={d.desc} />
      ))}
    </div>
    <div className="bg-neutral-700 rounded-lg h-1/2 mt-16"></div>
  </GlowBackground>
);

const ExpertiseSection = () => (
  <section className="h-full bg-neutral-100 px-23 py-16 space-y-12">
    <div className="space-y-4">
      <p className="caption-text text-brand-600 ">Expertise</p>
      <h2 className="text-neutral-800">What I Do</h2>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {ExpertiseData.map((e, index) => (
        <ExpertiseCard key={index} props={e} />
      ))}
    </div>
  </section>
);

const ExpertiseCard = ({ props }: { props: ExpertiseCardType }) => (
  <div
    className={twMerge(
      "rounded-lg text-neutral-100 p-8 pt-24 grid grid-cols-2 hover:scale-102 transition-transform duration-300 group cursor-pointer",
      props.color,
    )}
  >
    <div className="space-y-4">
      <h2 className="">{props.title}</h2>
      <p className="text-sm">{props.desc}</p>
    </div>
    <span className="font-normal text-2xl flex justify-end items-end">↗</span>
  </div>
);

const RecentSection = () => (
  <section className="h-screen bg-neutral-100 px-23 py-16 ">
    <div className="space-y-6">
      <p className="caption-text text-brand-600 ">Media</p>
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-neutral-800">Recent Work</h2>
        <Link
          className="uppercase text-neutral-700 border-b-2 border-b-transparent hover:border-b-neutral-700 transition-all duration-500"
          href={"/"}
        >
          View More
          <span className="font-bold ml-3">↗</span>
        </Link>
      </div>
      <div className="bg-neutral-700 w-full h-70 rounded-lg"></div>
    </div>
    <div>
      <h2 className="text-neutral-800">Other Work</h2>
      <div className="grid grid-cols-3 gap-6">
        {VideoCardData.map((v, index) => (
          <VideoCard key={index} />
        ))}
      </div>
    </div>
  </section>
);

const VideoCard = () => {
  return (
    <div>
      <div className="bg-neutral-700 w-full h-32 rounded-lg"></div>
      <h4 className="text-neutral-800 font-medium pt-2">My First Video</h4>
      <p className="text-sm ">01/12/2024</p>
    </div>
  );
};

const ModelShotsSections = () => {
  const [currentImage, setCurrentImage] = useState<ModelImageType>(
    ModelShotsData[0],
  );

  const nextImage = ( shot :  ModelImageType ) => {
    const currentIndex = ModelShotsData.indexOf(shot);
    const lastItemIndex = ModelShotsData.length - 1;

    if (currentImage.id == ModelShotsData[lastItemIndex].id) {
      setCurrentImage(ModelShotsData[0]);
    }

    setCurrentImage(ModelShotsData[currentIndex + 1]);
  };

  return (
    <section className="h-screen bg-neutral-100 px-23 py-16 ">
      <div>
        <div className="bg-linear-to-l from-purple-600 to-blue-500 ">
          <button 
          className="w-12"
          onClick={() => nextImage(currentImage)}
          >→</button>
          <Image
            src={currentImage.imageLink}
            width={100}
            height={100}
            alt={currentImage.alt}
            className={twMerge(
              "bg-neutral-700 rounded-lg bg-center bg-cover w-full h-100",
            )}
          />
          <button>→</button>
        </div>

        <div className="flex justify-center mt-2">
          {ModelShotsData.map((s) => (
            <ModelPreviewShot
              key={s.id}
              shot={s}
              handleOnClick={() => setCurrentImage(s)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

type ModelPreviewType = {
  shot: ModelImageType;
  handleOnClick: () => void;
};

const ModelPreviewShot = ({ shot, handleOnClick }: ModelPreviewType) => {
  return (
    <div className="w-16 h-16 rounded-lg" onClick={handleOnClick}>
      <Image
        src={shot.imageLink}
        alt={shot.alt}
        className="bg-cover bg-center w-full h-14 rounded-lg border-2 hover:border-brand-600"
        width={0}
        height={0}
      />
    </div>
  );
};
