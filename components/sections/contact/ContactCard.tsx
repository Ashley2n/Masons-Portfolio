import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import ResumeDialog from "@/components/resume/ResumeDialog";
import Eyebrow from "@/components/ui/Eyebrow";
import { contactContent } from "@/content/contact";
import { contactInfo, siteConfig, socialLinks } from "@/content/site";

const rowClass = "flex items-center gap-4 text-neutral-200";
const iconClass = "size-5 shrink-0 text-neutral-300";

export default function ContactCard() {
  const { card } = contactContent;

  return (
    <aside
      aria-label={card.eyebrow}
      className="relative isolate flex min-h-[36rem] flex-col justify-end overflow-hidden rounded-lg border border-neutral-800"
    >
      <Image
        src={card.image.src}
        alt={card.image.alt}
        fill
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="-z-20 object-cover object-top"
      />
      {/* Brand tint + fade so the text stays readable over the photo */}
      <div className="absolute inset-0 -z-10 bg-brand-700/30 mix-blend-color" />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-neutral-950 from-45% via-neutral-950/60 to-transparent" />

      <div className="space-y-8 p-6 md:p-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <Eyebrow>{card.eyebrow}</Eyebrow>
            <h2 className="text-h1 font-normal text-neutral-100">{siteConfig.name}</h2>
          </div>
          <ul className="space-y-3">
            <li>
              <a href={`mailto:${contactInfo.email}`} className={`${rowClass} hover:text-brand-500`}>
                <Mail aria-hidden="true" className={iconClass} />
                {contactInfo.email}
              </a>
            </li>
            {contactInfo.phone && (
              <li>
                <a href={`tel:${contactInfo.phone.replace(/[^\d+]/g, "")}`} className={`${rowClass} hover:text-brand-500`}>
                  <Phone aria-hidden="true" className={iconClass} />
                  {contactInfo.phone}
                </a>
              </li>
            )}
            <li className={rowClass}>
              <MapPin aria-hidden="true" className={iconClass} />
              {contactInfo.location}
            </li>
          </ul>
          <ResumeDialog className="px-5 py-3" />
        </div>

        <div className="space-y-4 border-t border-neutral-700 pt-6">
          <Eyebrow id="follow-title">{card.followTitle}</Eyebrow>
          <ul aria-labelledby="follow-title" className="space-y-3">
            {socialLinks.map((link) => {
              const external = link.href.startsWith("http");
              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-3 text-small text-neutral-200 hover:text-brand-500"
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    {link.label}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <figure className="flex items-center gap-4 pt-4">
          <blockquote className="font-playfair text-small italic text-neutral-300">
            &ldquo;{card.quote}&rdquo;
          </blockquote>
          <span aria-hidden="true" className="h-px flex-1 bg-neutral-700" />
          <figcaption className="font-playfair italic text-neutral-100">MF</figcaption>
        </figure>
      </div>
    </aside>
  );
}
