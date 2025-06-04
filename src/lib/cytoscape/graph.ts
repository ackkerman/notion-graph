// lib/ctyoscape/graph.ts
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import type { NodeData, GraphData } from "@/lib/cytoscape/types";

/** 入力：各ページに任意の multi_select 配列を含められる */
export interface PageKW extends Record<string, any> {
  id: string;
  title: string;
  keywords: string[];
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

const DEFAULT_PAGE_COLOR = "#487CA5";

// cytoscape は CSS 変数を解釈しないため、テーマの変数を HEX に変換して使用する
const VAR_HEX_MAP: Record<string, string> = {
  "--color-n-blue": "#2f80ed",
  "--color-n-green": "#448361",
  "--color-n-yellow": "#cb912f",
  "--color-n-orange": "#d9730d",
  "--color-n-pink": "#c14c8a",
  "--color-n-purple": "#9065b0",
  "--color-n-brown": "#64473a",
  "--color-n-red": "#d44c47",
} as const;

const cssVarToHex = (v: string): string => {
  const match = v.match(/^var\((--[^)]+)\)$/);
  return match ? VAR_HEX_MAP[match[1]] ?? DEFAULT_PAGE_COLOR : v;
};

const HUES = [
  cssVarToHex("var(--color-n-blue)"),
  cssVarToHex("var(--color-n-green)"),
  cssVarToHex("var(--color-n-yellow)"),
  cssVarToHex("var(--color-n-orange)"),
  cssVarToHex("var(--color-n-pink)"),
  cssVarToHex("var(--color-n-purple)"),
  cssVarToHex("var(--color-n-brown)"),
  cssVarToHex("var(--color-n-red)"),
] as const;

/* ─────────────────── main builder ─────────────────── */

export interface BuildOptions {
  /** グラフに含めたい multi_select / select プロパティ名 */
  selectedProps?: string[];
  /** ページカラーに使うプロパティ名 */
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
  const colorMap = new Map<string, string>();
  const pickColor = (val: string | undefined): string => {
    if (!val) return DEFAULT_PAGE_COLOR;
    if (!colorMap.has(val))
      colorMap.set(val, HUES[colorMap.size % HUES.length]);
    return colorMap.get(val)!;
  };

  const pushNode = (d: NodeData) => {
    if (!seen.has(d.id)) {
      nodes.push({ data: d });
      seen.add(d.id);
    }
  };

  const includeKw = selectedProps.includes("__keywords");

  pages.forEach((page) => {
    const pageId = PID + page.id;
    const colorVal = colorProp
      ? Array.isArray(page[colorProp])
        ? (page[colorProp] as string[])[0]
        : (page[colorProp] as string | undefined)
      : undefined;
    pushNode({
      id: pageId,
      label: page.title,
      type: "page",
      color: pickColor(colorVal),
    });

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

/* ─────────────────── helpers ─────────────────── */

/** 指定ノードに接続するノード一覧を取得 */
export function getConnectedNodes(
  graph: GraphData,
  nodeId: string
): NodeData[] {
  const nodeMap = new Map(graph.nodes.map((n) => [n.data.id, n.data]));
  const connected = new Set<string>();
  graph.edges.forEach((e) => {
    if (e.data.source === nodeId) connected.add(e.data.target);
    if (e.data.target === nodeId) connected.add(e.data.source);
  });
  return Array.from(connected)
    .map((id) => nodeMap.get(id))
    .filter(Boolean) as NodeData[];
}

