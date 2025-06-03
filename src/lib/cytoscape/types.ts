export type NodeKind = "page" | "keyword" | "prop";

export interface NodeData {
  id: string;
  label: string;
  type: NodeKind;
  /** prop ノードのみ保持 (e.g. "Tags") */
  propName?: string;
  /** ノード背景色 (CSS var) */
  color?: string;
}
export interface EdgeData {
  id: string;
  source: string;
  target: string;
}

/** Cytoscape 用エクスポート型 */
export interface GraphData {
  nodes: { data: NodeData }[];
  edges: { data: EdgeData }[];
}