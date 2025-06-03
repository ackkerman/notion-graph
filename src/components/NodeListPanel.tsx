"use client";
import { useEffect, useState } from "react";
import { Trash, ChevronDown, ChevronRight, ListTree } from "lucide-react";
import type { GraphViewHandle } from "./GraphView";
import type { PageKW } from "@/lib/cytoscape/graph";
import { buildGraph } from "@/lib/cytoscape/graph";

interface NodeInfo {
  id: string;
  label: string;
  degree: number;
}

interface Props {
  viewRef: React.RefObject<GraphViewHandle | null>;
  pages: PageKW[];
  selectedProps: string[];
  version: number;
  onDelete?: () => void;
}


export default function NodeListPanel({
  viewRef,
  pages,
  selectedProps,
  version,
  onDelete,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [nodes, setNodes] = useState<NodeInfo[]>([]);

  const refresh = () => {
    if (viewRef.current) {
      setNodes(viewRef.current.getNodesByDegree());
      return;
    }
    const { nodes, edges } = buildGraph(pages, { selectedProps });
    const degree = new Map<string, number>();
    edges.forEach((e) => {
      degree.set(e.data.source, (degree.get(e.data.source) || 0) + 1);
      degree.set(e.data.target, (degree.get(e.data.target) || 0) + 1);
    });
    const list = nodes
      .map((n) => ({
        id: n.data.id,
        label: n.data.label,
        degree: degree.get(n.data.id) ?? 0,
      }))
      .sort((a, b) => b.degree - a.degree);
    setNodes(list);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, selectedProps, version, viewRef.current]);

  const handleDelete = (id: string) => {
    viewRef.current?.removeNode(id);
    onDelete?.();
    refresh();
  };

  return (
    <section className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-n-gray bg-n-bg p-3 text-sm">
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center gap-1 font-medium"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        <ListTree size={18} />
        Nodes
      </button>
      {!collapsed && (
        <ul className="max-h-64 space-y-1 overflow-auto">
          {nodes.map((n) => (
            <li key={n.id} className="flex items-center justify-between gap-2">
              <span>
                {n.label}
                <span className="text-xs text-n-gray-600">({n.degree})</span>
              </span>
              <button
                onClick={() => handleDelete(n.id)}
                className="text-n-red hover:text-n-red-700"
              >
                <Trash size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
