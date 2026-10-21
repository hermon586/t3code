import type { LegendListRef } from "@legendapp/list/react";
import { EnvironmentId, MessageId, RuntimeRequestId, ThreadId } from "@t3tools/contracts";
import { createRef, type ComponentProps } from "react";
import { expect, it, vi } from "vite-plus/test";

import "~/index.css";

import { act, render } from "../../../test/render";

vi.mock(import("~/state/query"), async (original) => ({
  ...(await original()),
  useEnvironmentQuery: (() => ({
    data: null,
    dataUpdatedAt: 0,
    error: null,
    failure: null,
    isPending: false,
    isSuccess: false,
    refresh: () => {},
  })) as never,
}));

import { ComposerPendingUserInputPanel } from "./ComposerPendingUserInputPanel";
import { MessagesTimeline } from "./MessagesTimeline";

const environmentId = EnvironmentId.make("environment-local");
const threadRef = { environmentId, threadId: ThreadId.make("thread-rtl") };
const createdAt = "2026-10-17T00:00:00.000Z";
const storageKey = "t3code:assistant-output-direction";

it("persists and reverses the reading direction across remounts for assistant messages and questions", async () => {
  localStorage.clear();
  using _storage = { [Symbol.dispose]: () => localStorage.clear() };
  const timelineProps = {
    isWorking: false,
    activeTurnInProgress: false,
    listRef: createRef<LegendListRef | null>(),
    latestRun: null,
    turnDiffSummaries: [],
    runs: [],
    routeThreadKey: "environment-local:thread-rtl",
    onOpenTurnDiff: () => {},
    onOpenThread: () => {},
    onForkFromRun: async () => {},
    onRollbackCheckpoint: () => {},
    supportsConversationRollback: false,
    onRevertToTurnCount: () => {},
    isRevertingCheckpoint: false,
    onImageExpand: () => {},
    activeThreadEnvironmentId: environmentId,
    markdownCwd: undefined,
    resolvedTheme: "light",
    timestampFormat: "locale",
    workspaceRoot: undefined,
    anchorMessageId: null,
    onAnchorReady: () => {},
    onAnchorSizeChanged: () => {},
    contentInsetEndAdjustment: 0,
    emptyPlaceholderInset: 0,
    liveFollowEnabled: true,
    onIsAtEndChange: () => {},
    onManualNavigation: () => {},
    timelineEntries: [
      {
        id: "entry-assistant-rtl",
        kind: "message",
        createdAt,
        message: {
          id: MessageId.make("assistant-rtl"),
          role: "assistant",
          text: "שלום, זה פלט בעברית.",
          runId: null,
          createdAt,
          updatedAt: createdAt,
          streaming: false,
        },
      },
    ],
  } satisfies ComponentProps<typeof MessagesTimeline>;
  const chat = (
    <>
      <MessagesTimeline {...timelineProps} />
      <ComposerPendingUserInputPanel
        pendingUserInputs={[
          {
            requestId: RuntimeRequestId.make("question-rtl"),
            createdAt,
            dismissible: false,
            responseCapability: "live",
            questions: [
              {
                id: "approach",
                header: "גישה",
                question: "איזו גישה נבחר?",
                options: [{ label: "בהדרגה", description: "מודול אחד בכל פעם" }],
                multiSelect: false,
              },
            ],
          },
        ]}
        cwd={undefined}
        threadRef={threadRef}
        respondingRequestIds={[]}
        answers={{}}
        questionIndex={0}
        onToggleOption={() => {}}
        onAdvance={() => {}}
        onDismiss={() => {}}
      />
    </>
  );
  const renderChat = () => {
    const container = document.createElement("div");
    container.style.cssText =
      "height: 1200px; width: 900px; display: flex; flex-direction: column;";
    return render(chat, { container });
  };
  const toggle = (container: HTMLElement, label: string) =>
    container.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!;
  const assertReadingDirection = (container: HTMLElement, direction: "ltr" | "rtl") => {
    const paragraphs = [...container.querySelectorAll(".chat-markdown p")];
    expect(paragraphs.map((paragraph) => paragraph.textContent)).toEqual([
      "שלום, זה פלט בעברית.",
      "איזו גישה נבחר?",
    ]);
    for (const paragraph of paragraphs) {
      expect(getComputedStyle(paragraph).direction).toBe(direction);
    }
    const option = [...container.querySelectorAll("button")].find((button) =>
      button.textContent?.includes("בהדרגה"),
    )!;
    expect(getComputedStyle(option).direction).toBe(direction);
  };

  {
    await using first = await renderChat();
    const { container } = first;
    await vi.waitFor(() => assertReadingDirection(container, "ltr"));
    await act(() => toggle(container, "Display assistant output right to left").click());
    expect(localStorage.getItem(storageKey)).toBe(JSON.stringify("rtl"));
    assertReadingDirection(container, "rtl");
    expect(
      toggle(container, "Display assistant output left to right").getAttribute("aria-pressed"),
    ).toBe("true");
  }

  await using second = await renderChat();
  const { container } = second;
  await vi.waitFor(() => assertReadingDirection(container, "rtl"));
  await act(() => toggle(container, "Display assistant output left to right").click());
  expect(localStorage.getItem(storageKey)).toBe(JSON.stringify("ltr"));
  assertReadingDirection(container, "ltr");
  expect(
    toggle(container, "Display assistant output right to left").getAttribute("aria-pressed"),
  ).toBe("false");
});
