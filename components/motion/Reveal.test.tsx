import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MotionProvider from "./MotionProvider";
import { Reveal } from "./Reveal";

describe("Reveal", () => {
  // jsdom has none; this one never reports "in view", so the block stays unrevealed as if offscreen
  beforeEach(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  // #29 story 32 / D-44: animation must never hide the control a keyboard user is on. jsdom has no
  // IntersectionObserver-driven scroll, so the block stays unrevealed until something else rests it.
  it("shows a block at once when focus moves into it before it has been scrolled to", async () => {
    render(
      <MotionProvider>
        <Reveal>
          <button type="button">Get in touch</button>
        </Reveal>
      </MotionProvider>,
    );
    const button = screen.getByRole("button", { name: "Get in touch" });
    const block = button.parentElement as HTMLElement;
    expect(block.style.opacity, "hidden until revealed").toBe("0");

    button.focus();

    await waitFor(() => expect(block.style.opacity).toBe("1"));
  });
});
