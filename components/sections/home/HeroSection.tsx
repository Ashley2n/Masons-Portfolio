const DotSeparator = () => <span className="text-xs "> • </span>;

const ViewWorkButton = () => (
  <button className="border rounded-md border-brand-600 flex gap-6 px-8 py-4 bg-neutral-950 text-neutral-100 text-sm w-fit">
    <p>VIEW WORK</p>
    <span className="font-bold">↗</span>
  </button>
);

export default function HeroSection() {
  return (
    <main className="flex flex-col gap-8 h-210 justify-end pb-20 px-23">
      <div>
        <div className="text-brand-600 text-sm gap-3 flex items-center uppercase">
          <p>Actor</p>
          <DotSeparator />
          <p>Musician</p>
          <DotSeparator />
          <p>Singer</p>
          <DotSeparator />
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
      <ViewWorkButton />
    </main>
  );
}
