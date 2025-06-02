"use client";

import { useEffect, useState } from "react";
import { GraphView } from "@/components/GraphView";
import { toGraph } from "@/lib/transform";
import { savePages, loadPages } from "@/lib/localstore";

export default function Page() {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });

  const fetchAndStore = async () => {
    const res = await fetch("/api/fetch");
    const pages = await res.json();
    savePages(pages);
    setGraph(toGraph(pages));
  };

  useEffect(() => {
    const pages = loadPages();
    setGraph(toGraph(pages));
  }, []);

  return (
    <div className="p-4">
      <button
        onClick={fetchAndStore}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
      >
        Notion から更新
      </button>
      <GraphView nodes={graph.nodes} edges={graph.edges} />
    </div>
  );
}
