"use client";
import { useMemo } from "react";
import type { PageKW } from "@/lib/cytoscape/graph";
import { buildGraph } from "@/lib/cytoscape/graph";
import type { GraphViewHandle } from "./GraphView";
import { computeGraphStats } from "@/lib/cytoscape/stats";

type Props = {
  pages: PageKW[];
  selectedProps: string[];
  viewRef: React.RefObject<GraphViewHandle | null>;
  version: number;
};

export default function StatsPanel({ pages, selectedProps, viewRef, version }: Props) {
  const stats = useMemo(() => {
    void version;
    const graph = viewRef.current
      ? viewRef.current.getGraphData()
      : buildGraph(pages, { selectedProps });
    return computeGraphStats(graph);
  }, [pages, selectedProps, viewRef, version]);

  return (
    <section className="rounded-[var(--radius-card)] border border-n-gray bg-white p-3 text-sm">
      <h2 className="mb-2 font-medium">Graph Stats</h2>
      <p>Nodes: {stats.nodeCount}</p>
      <p>Edges: {stats.edgeCount}</p>
      <p>Avg. Degree: {stats.avgDegree.toFixed(2)}</p>
      <ul className="mt-2 list-disc pl-5">
        {stats.topCentralNodes.map((n) => (
          <li key={n.id}>
            {n.label} <span className="text-xs text-n-gray-600">({n.degree})</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
