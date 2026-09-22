import { ComponentPropsWithoutRef, ReactNode } from "react";
import { ExpertiseCardType, ExpertiseData, statsData, StatsType } from "./lib/constants";
import { twMerge } from "tailwind-merge";

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
      <ExpertiseSection/>
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
    <p className="font-playfair text-7xl text-brand-800">{metric}<span className="text-brand-600 text-4xl">+</span></p>
    <p className="text-neutral-700">{desc}</p>
  </div>
);
type GlowBackgroundType = {
  children: ReactNode,
  className: ComponentPropsWithoutRef<'section'>['className'];
}
const GlowBackground = ({children, className} : GlowBackgroundType ) => (
  <section
      className={twMerge('relative isolate min-h-screen overflow-hidden bg-white', className )}
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
  <section className="h-screen bg-neutral-100 px-23 py-16">
    <div className="space-y-4">
      <p className="caption-text text-brand-600 ">Expertise</p>
      <h2 className="text-neutral-800">What I Do</h2>
    </div>
    <div className="grid grid-cols-2 gap-4">
    {ExpertiseData.map((e, index) => (
      <ExpertiseCard key={index} props={e}/>
    ))}
    </div>
  </section>
)

const ExpertiseCard = ({props}: {props: ExpertiseCardType}) => (
  
  <div className={twMerge("rounded-lg text-neutral-100 p-8 pt-20 grid grid-cols-2 ",props.color)}>
    <div className=""><h3>{props.title}</h3>
    <p>{props.desc}</p></div>
    <span className="font-bold">↗</span>
  </div>
)