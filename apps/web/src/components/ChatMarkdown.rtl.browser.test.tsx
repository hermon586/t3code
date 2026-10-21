import { expect, it, vi } from "vite-plus/test";

import { render } from "../../test/render";

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

it.each(["rtl", "ltr", undefined] as const)(
  "displays markdown in direction %s and inherits when omitted",
  async (direction) => {
    const container = document.createElement("div");
    container.dir = "rtl";
    await using screen = await render(
      <ChatMarkdown cwd="/tmp/project" text="שלום Hello" {...(direction ? { direction } : {})} />,
      { container },
    );

    const paragraph = screen.container.querySelector("p")!;
    expect(paragraph.textContent).toBe("שלום Hello");
    expect(getComputedStyle(paragraph).direction).toBe(direction ?? "rtl");
  },
);
