import * as Schema from "effect/Schema";

import { useLocalStorage } from "./useLocalStorage";

const AssistantOutputDirection = Schema.Literals(["ltr", "rtl"]);
export type AssistantOutputDirection = typeof AssistantOutputDirection.Type;

/** Shares the reading direction across assistant messages and questions. */
export function useAssistantOutputDirection() {
  return useLocalStorage("t3code:assistant-output-direction", "ltr", AssistantOutputDirection);
}
