import type { Metadata } from "next";
import { pageSeo } from "@/content/seo";
import { pageMetadata } from "@/lib/seo";
import CtaBanner from "@/components/layout/CtaBanner";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { resumeContent } from "@/content/resume";

export const metadata: Metadata = pageMetadata(pageSeo.resume);

export default function ResumePage() {
  const { file } = resumeContent;

  return (
    <>
      <section className="py-16 md:py-24">
        <Container className="space-y-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              as="h1"
              eyebrow={resumeContent.eyebrow}
              title={resumeContent.title}
              description={resumeContent.description}
            />
            <div className="flex flex-wrap gap-4">
              <Button href={file.href} download={file.downloadName} icon="download">
                {resumeContent.downloadLabel}
              </Button>
              <Button href={file.href} newTab>
                {resumeContent.openLabel}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <iframe
              src={`${file.href}#view=FitH`}
              title={resumeContent.previewTitle}
              className="h-[70svh] min-h-96 w-full rounded-lg border border-neutral-800 bg-neutral-100"
            />
            <p className="text-small text-neutral-400">{resumeContent.previewHint}</p>
          </div>
        </Container>
      </section>
      <CtaBanner />
    </>
  );
}
