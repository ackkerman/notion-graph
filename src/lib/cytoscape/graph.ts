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

/* ─────────────────── main builder ─────────────────── */

export interface BuildOptions {
  /** グラフに含めたい multi_select / select プロパティ名 */
  selectedProps?: string[];
}

/**
 * ページ ↔ キーワード ↔ (optional) property-value のグラフを生成
 */
export function buildGraph(
  pages: PageKW[],
  { selectedProps = [] }: BuildOptions = {}
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
    pushNode({ id: pageId, label: page.title, type: "page" });

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
