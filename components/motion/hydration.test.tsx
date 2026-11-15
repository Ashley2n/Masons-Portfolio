import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MotionProvider from "./MotionProvider";
import { LoadEntrance, LoadItem } from "./LoadEntrance";
import { Reveal } from "./Reveal";

/**
 * The server cannot know the visitor's reduced-motion setting, so it always renders the hidden start state. Motion's
 * `useReducedMotion` reads the real setting on the first client render, so a visitor who asked for less motion
 * hydrates a different tree than the server sent. React only reports that in development ("A tree hydrated but some
 * attributes of the server rendered HTML didn't match"), where it shows as an "Issue" in the Next dev overlay.
 * Motion rewrites the inline style itself and the CSS in `globals.css` forces the content visible, so a visitor sees
 * nothing (measured on the production build, 2026-11-15). This test only keeps development clean.
 */
function App() {
  return (
    <MotionProvider>
      <LoadEntrance>
        <LoadItem>Heading</LoadItem>
      </LoadEntrance>
      <Reveal>Scroll block</Reveal>
    </MotionProvider>
  );
}

describe("hydration with reduced motion", () => {
  // Motion reads the setting through matchMedia once and then listens for changes, so the stand-in has to fire them
  let listeners: Array<() => void> = [];
  const query = { matches: false, addEventListener: (_: string, fn: () => void) => listeners.push(fn), removeEventListener: () => {} };
  const setReduced = (matches: boolean) => {
    query.matches = matches;
    listeners.forEach((fn) => fn());
  };
  let container: HTMLDivElement;

  beforeEach(() => {
    listeners = [];
    query.matches = false;
    vi.stubGlobal("matchMedia", () => query);
    container = document.createElement("div");
    document.body.append(container);
    // React reports hydration problems with console.error in development
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    container.remove();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("hydrates the server's hidden start state without a mismatch when the visitor asked for reduced motion", async () => {
    container.innerHTML = renderToString(<App />); // the server: no preference known
    setReduced(true); // the browser: reduced motion on

    await act(async () => {
      hydrateRoot(container, <App />);
    });

    expect(console.error).not.toHaveBeenCalled();
  });
});
