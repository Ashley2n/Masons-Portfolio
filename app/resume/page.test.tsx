import { existsSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { resumeContent } from "@/content/resume";
import Page, { metadata } from "./page";

const { file } = resumeContent;

describe("/resume page", () => {
  it("is titled 'Resume'", () => {
    expect(metadata.title).toBe("Resume");
  });

  it("renders the page heading", () => {
    render(<Page />);

    expect(screen.getByRole("heading", { level: 1, name: "Resume" })).toBeInTheDocument();
    // The old "Resume" label above the heading repeated it (D-38)
    expect(screen.getAllByText("Resume")).toHaveLength(1);
  });

  it("offers the PDF as a download with a friendly file name", () => {
    render(<Page />);

    const download = screen.getByRole("link", { name: "Download PDF" });
    expect(download).toHaveAttribute("href", file.href);
    expect(download).toHaveAttribute("download", file.downloadName);
  });

  it("makes Download PDF the page's primary action, not Open in new tab (D-39)", () => {
    render(<Page />);

    // The look itself is checked in e2e/buttons.spec.ts; this pins which button gets the primary variant
    expect(screen.getByRole("link", { name: "Download PDF" })).toHaveClass("bg-brand-600");
    expect(screen.getByRole("link", { name: "Open in new tab" })).not.toHaveClass("bg-brand-600");
  });

  it("can open the PDF in a new tab", () => {
    render(<Page />);

    const open = screen.getByRole("link", { name: "Open in new tab" });
    expect(open).toHaveAttribute("href", file.href);
    expect(open).toHaveAttribute("target", "_blank");
  });

  it("previews the PDF inline with an accessible title", () => {
    render(<Page />);

    const preview = screen.getByTitle(resumeContent.previewTitle);
    expect(preview.tagName).toBe("IFRAME");
    expect(preview.getAttribute("src")).toMatch(new RegExp(`^${file.href}`));
  });

  it("points at a PDF that exists in public/", () => {
    expect(file.href).toMatch(/\.pdf$/);
    expect(existsSync(join(process.cwd(), "public", file.href))).toBe(true);
  });

  it("ends with the get-in-touch banner", () => {
    render(<Page />);

    expect(screen.getByRole("link", { name: "Get in touch" })).toHaveAttribute("href", "/contact");
  });
});
