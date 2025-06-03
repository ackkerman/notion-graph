// lib/ctyoscape/graph.ts
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import type { NodeData, GraphData } from "@/lib/cytoscape/types";

/** 入力：各ページに任意の multi_select 配列を含められる */
export interface PageKW extends Record<string, any> {
  id: string;
  title: string;
  keywords: string[];
  /** select/status の色マップ */
  __propColors?: Record<string, string>;
}

/* ─────────────────── utils ─────────────────── */

/** 文字列を ID 向けにサニタイズ */
export const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w-]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* ノード ID プレフィックス */
const PID = "p-";
const KID = "k-";
const PVID = "pv-";

const colorMap: Record<string, string> = {
  default: "var(--color-n-gray-bg)",
  gray: "var(--color-n-gray-bg)",
  brown: "var(--color-n-brown-bg)",
  orange: "var(--color-n-orange-bg)",
  yellow: "var(--color-n-yellow-bg)",
  green: "var(--color-n-green-bg)",
  blue: "var(--color-n-blue-bg)",
  purple: "var(--color-n-purple-bg)",
  pink: "var(--color-n-pink-bg)",
  red: "var(--color-n-red-bg)",
};

const DEFAULT_PAGE_COLOR = colorMap.blue;

const notionColorToCss = (c?: string) => colorMap[c ?? ""] ?? colorMap.default;

/* ─────────────────── main builder ─────────────────── */

export interface BuildOptions {
  /** グラフに含めたい multi_select / select プロパティ名 */
  selectedProps?: string[];
  /** ページの色分けに使う select/status プロパティ名 */
  colorProp?: string;
}

/**
 * ページ ↔ キーワード ↔ (optional) property-value のグラフを生成
 */
export function buildGraph(
  pages: PageKW[],
  { selectedProps = [], colorProp }: BuildOptions = {}
): GraphData {
  const nodes: GraphData["nodes"] = [];
  const edges: GraphData["edges"] = [];

  const seen = new Set<string>(); // 全ノード重複防止

  const pushNode = (d: NodeData) => {
    if (!seen.has(d.id)) {
      nodes.push({ data: d });
      seen.add(d.id);
    }
  };

  const includeKw = selectedProps.includes("__keywords");

  pages.forEach((page) => {
    const pageId = PID + page.id;
    const colorName = colorProp ? page.__propColors?.[colorProp] : undefined;
    const color = colorName ? notionColorToCss(colorName) : DEFAULT_PAGE_COLOR;
    pushNode({ id: pageId, label: page.title, type: "page", color });

    /* --- キーワード --- */
    if (includeKw) {
          
    page.keywords.forEach((kw) => {
      const kwId = KID + slug(kw);
      pushNode({ id: kwId, label: kw, type: "keyword" });
      edges.push({
        data: { id: `e-${pageId}-${kwId}`, source: pageId, target: kwId },
      });
    });
    }


    /* --- multi_select プロパティ --- */
    selectedProps
    .filter((prop) => prop !== "__keywords") // キーワードは別扱い
    .forEach((prop) => {
      const values: string[] = page[prop] ?? [];
      values.forEach((val) => {
        const pvId = `${PVID}${slug(prop)}-${slug(val)}`;
        pushNode({
          id: pvId,
          label: val,
          type: "prop",
          propName: prop,
        });
        edges.push({
          data: { id: `e-${pageId}-${pvId}`, source: pageId, target: pvId },
        });
      });
    });
  });

  return { nodes, edges };
}
