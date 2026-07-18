const AUTO_DIRECTION_TAG_NAMES = new Set([
  "blockquote",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "li",
  "p",
  "summary",
  "td",
  "th",
]);

interface HastLikeNode {
  type?: unknown;
  tagName?: unknown;
  properties?: unknown;
  children?: unknown;
}

function visitAutoDirectionNodes(value: unknown): void {
  if (value === null || typeof value !== "object") return;

  const node = value as HastLikeNode;
  if (
    node.type === "element" &&
    typeof node.tagName === "string" &&
    AUTO_DIRECTION_TAG_NAMES.has(node.tagName)
  ) {
    const properties =
      node.properties !== null && typeof node.properties === "object" ? node.properties : {};
    node.properties = { ...properties, dir: "auto" };
  }

  if (Array.isArray(node.children)) {
    node.children.forEach(visitAutoDirectionNodes);
  }
}

/** Adds browser-native bidi direction detection to each rendered text block. */
export function rehypeAutoDirection() {
  return (tree: unknown) => {
    visitAutoDirectionNodes(tree);
  };
}
