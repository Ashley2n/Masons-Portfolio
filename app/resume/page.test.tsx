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
  });

  it("offers the PDF as a download with a friendly file name", () => {
    render(<Page />);

    const download = screen.getByRole("link", { name: "Download PDF" });
    expect(download).toHaveAttribute("href", file.href);
    expect(download).toHaveAttribute("download", file.downloadName);
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
