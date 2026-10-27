import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { resumeContent } from "@/content/resume";
import ResumeDialog from "./ResumeDialog";

const { file } = resumeContent;

describe("ResumeDialog", () => {
  it("starts closed and doesn't load the PDF yet", () => {
    render(<ResumeDialog />);

    expect(screen.getByRole("button", { name: "View resume" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.querySelector("iframe")).toBeNull();
  });

  it("opens a labelled dialog with the PDF preview and download options", async () => {
    const user = userEvent.setup();
    render(<ResumeDialog />);

    await user.click(screen.getByRole("button", { name: "View resume" }));

    const dialog = screen.getByRole("dialog", { name: "Resume" });
    expect(within(dialog).getByTitle(resumeContent.previewTitle)).toHaveAttribute(
      "src",
      expect.stringMatching(new RegExp(`^${file.href}`)),
    );
    const download = within(dialog).getByRole("link", { name: "Download PDF" });
    expect(download).toHaveAttribute("href", file.href);
    expect(download).toHaveAttribute("download", file.downloadName);
    expect(within(dialog).getByRole("link", { name: "Open in new tab" })).toHaveAttribute(
      "target",
      "_blank",
    );
  });

  it("closes with the close button and returns focus to 'View resume'", async () => {
    const user = userEvent.setup();
    render(<ResumeDialog />);
    const trigger = screen.getByRole("button", { name: "View resume" });

    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Close resume" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes when the backdrop (outside the panel) is clicked", async () => {
    const user = userEvent.setup();
    render(<ResumeDialog />);

    await user.click(screen.getByRole("button", { name: "View resume" }));
    await user.click(screen.getByRole("dialog"));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows a visible 'View resume' label that is also its accessible name (D-29)", () => {
    render(<ResumeDialog />);

    const trigger = screen.getByRole("button", { name: "View resume" });
    // Name comes from the visible text, not a hidden aria-label (WCAG 2.5.3 Label in Name)
    expect(trigger).toHaveTextContent("View resume");
    expect(trigger).not.toHaveAttribute("aria-label");
    expect(trigger).not.toHaveAttribute("title");
    expect(trigger.querySelector("svg")).toHaveClass("lucide-file-text");
    expect(trigger.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("stays open when a press starts inside the panel and ends on the backdrop", async () => {
    const user = userEvent.setup();
    render(<ResumeDialog />);
    await user.click(screen.getByRole("button", { name: "View resume" }));
    const dialog = screen.getByRole("dialog");

    // e.g. selecting text in the footer and releasing just outside the panel
    fireEvent.pointerDown(within(dialog).getByText(resumeContent.previewHint));
    fireEvent.click(dialog);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
