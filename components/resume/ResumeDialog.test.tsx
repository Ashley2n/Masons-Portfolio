import { render, screen, within } from "@testing-library/react";
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

  it("is an icon-only button that still has a name and a tooltip", () => {
    render(<ResumeDialog />);

    const trigger = screen.getByRole("button", { name: "View resume" });
    expect(trigger).toHaveTextContent(/^$/);
    expect(trigger).toHaveAttribute("title", "View resume");
    expect(trigger.querySelector("svg")).toHaveClass("lucide-file-text");
    expect(trigger.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
