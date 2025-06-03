"use client";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, BarChart3 } from "lucide-react";
import type { PageKW } from "@/lib/cytoscape/graph";
import { buildGraph } from "@/lib/cytoscape/graph";
import { computeGraphStats } from "@/lib/cytoscape/stats";

type Props = { pages: PageKW[]; selectedProps: string[] };

export default function StatsPanel({ pages, selectedProps }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const stats = useMemo(() => {
    const graph = buildGraph(pages, { selectedProps });
    return computeGraphStats(graph);
  }, [pages, selectedProps]);

  return (
    <section className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-n-gray bg-white p-3 text-sm">
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
