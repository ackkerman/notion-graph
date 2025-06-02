// lib/graph.ts
/** 入力：キーワード付きページ */
export interface PageKW {
  id: string;
  title: string;
  keywords: string[];
}

/** 出力：Cytoscape elements */
export interface GraphData {
  nodes: { data: { id: string; label: string; type: "page" | "keyword" } }[];
  edges: { data: { id: string; source: string; target: string } }[];
}

/** 文字を ID として安全化 */
function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * ページ・キーワード二部グラフを生成
 * - ページノード: "p-<pageId>"
 * - キーワードノード: "k-<slug(keyword)>"
 * - エッジ: ページ → キーワード
 */
export function buildKeywordGraph(pages: PageKW[]): GraphData {
  const nodes: GraphData["nodes"] = [];
  const edges: GraphData["edges"] = [];
  const seenKeywords = new Set<string>();

  // ① ページノード
  pages.forEach((p) => {
    nodes.push({
      data: { id: `p-${p.id}`, label: p.title, type: "page" },
    });

    // ② キーワードノード + エッジ
    p.keywords.forEach((kw) => {
      const kwId = `k-${slug(kw)}`;

      if (!seenKeywords.has(kwId)) {
        nodes.push({
          data: { id: kwId, label: kw, type: "keyword" },
        });
        seenKeywords.add(kwId);
      }

      edges.push({
        data: { id: `e-${p.id}-${kwId}`, source: `p-${p.id}`, target: kwId },
      });
    });
  });

  return { nodes, edges };
}
