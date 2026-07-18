import { describe, expect, it } from "vite-plus/test";

import { rehypeAutoDirection } from "./markdown-direction";

interface TestNode {
  type: "root" | "element" | "text";
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: TestNode[];
  value?: string;
}

function element(tagName: string, children: TestNode[] = []): TestNode {
  return { type: "element", tagName, properties: {}, children };
}

describe("rehypeAutoDirection", () => {
  it("assigns automatic direction independently to markdown text blocks", () => {
    const tree: TestNode = {
      type: "root",
      children: [
        element("p", [{ type: "text", value: "עברית with English" }]),
        element("p", [{ type: "text", value: "English עם עברית" }]),
        element("blockquote", [element("p")]),
        element("ul", [element("li")]),
        element("table", [element("tr", [element("th"), element("td")])]),
      ],
    };

    rehypeAutoDirection()(tree);

    expect(tree.children?.[0]?.properties?.dir).toBe("auto");
    expect(tree.children?.[1]?.properties?.dir).toBe("auto");
    expect(tree.children?.[2]?.properties?.dir).toBe("auto");
    expect(tree.children?.[2]?.children?.[0]?.properties?.dir).toBe("auto");
    expect(tree.children?.[3]?.children?.[0]?.properties?.dir).toBe("auto");
    expect(tree.children?.[4]?.children?.[0]?.children?.[0]?.properties?.dir).toBe("auto");
    expect(tree.children?.[4]?.children?.[0]?.children?.[1]?.properties?.dir).toBe("auto");
  });

  it("leaves technical containers and structural ordering alone", () => {
    const tree: TestNode = {
      type: "root",
      children: [element("pre", [element("code")]), element("table"), element("ul")],
    };

    rehypeAutoDirection()(tree);

    expect(tree.children?.[0]?.properties?.dir).toBeUndefined();
    expect(tree.children?.[0]?.children?.[0]?.properties?.dir).toBeUndefined();
    expect(tree.children?.[1]?.properties?.dir).toBeUndefined();
    expect(tree.children?.[2]?.properties?.dir).toBeUndefined();
  });

  it("is idempotent across repeated streaming renders", () => {
    const paragraph = element("p");
    const tree: TestNode = { type: "root", children: [paragraph] };
    const transform = rehypeAutoDirection();

    transform(tree);
    transform(tree);

    expect(paragraph.properties).toEqual({ dir: "auto" });
  });
});
