"use client";
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import type { GraphViewHandle } from "./GraphView";

interface NodeInfo {
  id: string;
  label: string;
  degree: number;
}

interface Props {
  viewRef: React.RefObject<GraphViewHandle | null>;
  onDelete?: () => void;
}

export default function NodeListPanel({ viewRef, onDelete }: Props) {
  const [nodes, setNodes] = useState<NodeInfo[]>([]);

  const refresh = () => {
    const list = viewRef.current?.getNodesByDegree() ?? [];
    setNodes(list);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = (id: string) => {
    viewRef.current?.removeNode(id);
    onDelete?.();
    refresh();
  };

  return (
    <section className="rounded-[var(--radius-card)] border border-n-gray bg-white p-3 text-sm">
      <h2 className="mb-2 font-medium">Nodes</h2>
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
    </section>
  );
}
