"use client";
import { useMemo, useState, useEffect } from "react";
import { ChevronDown, ChevronRight, BarChart3 } from "lucide-react";
import type { PageKW } from "@/lib/cytoscape/graph";
import { buildGraph } from "@/lib/cytoscape/graph";
import type { GraphViewHandle } from "./GraphView";
import { computeGraphStats } from "@/lib/cytoscape/stats";

type Props = {
  pages: PageKW[];
  selectedProps: string[];
  colorProp?: string;
  viewRef: React.RefObject<GraphViewHandle | null>;
  version: number;
};

export default function StatsPanel({ pages, selectedProps, colorProp, viewRef, version }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [readyVersion, setReadyVersion] = useState(0);

  useEffect(() => {
    if (viewRef.current) setReadyVersion((v) => v + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewRef.current]);

  const stats = useMemo(() => {
    void version;
    const graph = viewRef.current
      ? viewRef.current.getGraphData()
      : buildGraph(pages, { selectedProps, colorProp });
    return computeGraphStats(graph);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, selectedProps, colorProp, viewRef, version, readyVersion]);

  return (
    <section className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-n-gray bg-n-bg p-3 text-sm">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center gap-1 font-medium"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        <BarChart3 size={18} />
        Graph Stats
      </button>
      {!collapsed && (
        <>
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
        </>
      )}
    </section>
  );
}
