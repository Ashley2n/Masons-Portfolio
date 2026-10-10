import Button from "@/components/ui/Button";

const DotSeparator = () => <span className="text-xs "> • </span>;

export default function HeroSection() {
  return (
    <section className="flex flex-col gap-8 h-210 justify-end pb-20 px-23">
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
      <Button href="/media">View work</Button>
    </section>
  );
}
