"use client";
import { FileText, X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import Button, { buttonClasses } from "@/components/ui/Button";
import { resumeContent } from "@/content/resume";
import { cn } from "@/lib/utils";

type ResumeDialogProps = {
  className?: string;
};

/**
 * "View resume" button that opens the PDF in a modal with download options.
 * Uses the native <dialog>: Escape closes it, focus stays inside, the page behind is inert.
 */
export default function ResumeDialog({ className }: ResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // Only a press that starts AND ends on the backdrop closes the dialog, so selecting
  // text and releasing just outside the panel doesn't.
  const pressStartedOnBackdrop = useRef(false);
  const { file } = resumeContent;

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
  }, [open]);

  // Runs for every way of closing: the X, Escape, or a backdrop click
  const onClose = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  // The panel fills the dialog's content box, so the dialog element itself is the backdrop
  const onDialogPointerDown = (event: PointerEvent<HTMLDialogElement>) => {
    pressStartedOnBackdrop.current = event.target === event.currentTarget;
  };
  const onDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (pressStartedOnBackdrop.current && event.target === event.currentTarget) {
      dialogRef.current?.close();
    }
    pressStartedOnBackdrop.current = false;
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        // Exactly the outline Button's look; the visible text is the accessible name (D-29)
        className={buttonClasses("outline", cn("shrink-0", className))}
      >
        {resumeContent.viewLabel}
        <FileText aria-hidden="true" className="size-4" strokeWidth={1.75} />
      </button>

      {open && (
        <dialog
          ref={dialogRef}
          aria-labelledby="resume-dialog-title"
          onClose={onClose}
          onPointerDown={onDialogPointerDown}
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
                className="grid size-10 place-items-center rounded-full text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100"
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
