"use client";
import { X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import Button from "@/components/ui/Button";
import { resumeContent } from "@/content/resume";
import { cn } from "@/lib/utils";

type ResumeDialogProps = {
  /** Text on the trigger button */
  label?: string;
  variant?: "outline" | "light";
  className?: string;
};

/**
 * "View resume" button that opens the PDF in a modal with download options.
 * Uses the native <dialog>: Escape closes it, focus stays inside, the page behind is inert.
 */
export default function ResumeDialog({
  label = resumeContent.viewLabel,
  variant = "outline",
  className,
}: ResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { file } = resumeContent;

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
  }, [open]);

  // Runs for every way of closing: the X, Escape, or a backdrop click
  const onClose = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    // The panel fills the dialog's content box, so a click on the dialog itself is the backdrop
    if (event.target === event.currentTarget) dialogRef.current?.close();
  };

  return (
    <>
      <Button ref={triggerRef} onClick={() => setOpen(true)} icon="file" variant={variant} className={className}>
        {label}
      </Button>

      {open && (
        <dialog
          ref={dialogRef}
          aria-labelledby="resume-dialog-title"
          onClose={onClose}
          onClick={onDialogClick}
          className={cn(
            "m-auto h-[min(90svh,60rem)] w-[min(calc(100vw-2rem),64rem)] max-w-none overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950 p-0 text-neutral-300",
            "backdrop:bg-neutral-950/80 backdrop:backdrop-blur-sm",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-neutral-800 px-4 py-3 md:px-6">
              <h2 id="resume-dialog-title" className="text-h3 text-neutral-100">
                {resumeContent.title}
              </h2>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                aria-label={resumeContent.closeLabel}
                className="grid size-10 place-items-center rounded-full text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100 focus-visible:outline-2 focus-visible:outline-brand-400"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <iframe
              src={`${file.href}#view=FitH`}
              title={resumeContent.previewTitle}
              className="min-h-0 w-full flex-1 bg-neutral-100"
            />

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-800 px-4 py-3 md:px-6">
              <p className="text-small text-neutral-400">{resumeContent.previewHint}</p>
              <div className="flex flex-wrap gap-3">
                <Button href={file.href} download={file.downloadName} icon="download" className="px-5 py-3">
                  {resumeContent.downloadLabel}
                </Button>
                <Button href={file.href} newTab className="px-5 py-3">
                  {resumeContent.openLabel}
                </Button>
              </div>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
