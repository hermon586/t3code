import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";

vi.mock(import("../state/server"), async (original) => {
  const actual = await original();
  const { Atom } = await import("effect/reactivity");
  const noConfig = Atom.make(null);
  return {
    ...actual,
    serverEnvironment: { ...actual.serverEnvironment, configValueAtom: (() => noConfig) as never },
  };
});

import ChatMarkdown from "./ChatMarkdown";

let root: Root;
let container: HTMLDivElement;

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  container = document.body.appendChild(document.createElement("div"));
  container.dir = "rtl";
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  localStorage.clear();
  vi.unstubAllGlobals();
});

it.each(["rtl", "ltr", undefined] as const)(
  "displays markdown in direction %s and inherits when omitted",
  async (direction) => {
    await act(async () =>
      root.render(
        <ChatMarkdown cwd="/tmp/project" text="שלום Hello" {...(direction ? { direction } : {})} />,
      ),
    );

    const paragraph = container.querySelector("p")!;
    expect(paragraph.textContent).toBe("שלום Hello");
    expect(getComputedStyle(paragraph).direction).toBe(direction ?? "rtl");
  },
);
