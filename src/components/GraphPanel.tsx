"use client";
import { useRef, useState, useEffect } from "react";
import GraphView, { GraphViewHandle } from "./GraphView";
import LayoutControls from "./LayoutControls";
import StatsPanel from "./StatsPanel";
import NodeListPanel from "./NodeListPanel";
import NodeDetailPanel from "./NodeDetailPanel";
import { buildStyles } from "@/lib/cytoscape/styles";
import type { PageKW } from "@/lib/cytoscape/graph";
import { layouts } from "./GraphView";

type Props = { pages: PageKW[]; selectedProps: string[] };

export default function GraphPanel({ pages, selectedProps }: Props) {
  const viewRef = useRef<GraphViewHandle | null>(null);
  const [layout, setLayout] = useState<keyof typeof layouts>("cose-bilkent");
  const [version, setVersion] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  /* トグル用 state（お好みで拡張） */
  const [showNodeLabels, setShowNodeLabels] = useState(true);
  const [showEdgeLabels, setShowEdgeLabels] = useState(false);

  // @ts-expect-error, Cytoscape has no type definition for this
  const [stylesheet, setStylesheet] = useState<cytoscape.Stylesheet[]>(
    buildStyles({showNodeLabels, showEdgeLabels})
  );

  useEffect(() => {
    setStylesheet(buildStyles({showNodeLabels, showEdgeLabels}));
  }, [showEdgeLabels, showNodeLabels]);

  /** LayoutControls から渡されるハンドラ */
  const controls = {
    current: layout,
    onChange: (l: keyof typeof layouts) => {
      setLayout(l);
      viewRef.current?.setLayout(l);
    },
    onFit: () => viewRef.current?.fit(),
    onZoomIn: () => viewRef.current?.zoomIn(),
    onZoomOut: () => viewRef.current?.zoomOut(),
    onExportPng: () => {
      const uri = viewRef.current?.png();
      if (!uri) return;
      const a = document.createElement("a");
      a.href = uri;
      a.download = "graph.png";
      a.click();
    },
    onExportJson: () => {
      const json = viewRef.current?.json();
      if (!json) return;
      const blob = new Blob([JSON.stringify(json, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "graph.json";
      a.click();
      URL.revokeObjectURL(url);
    },
    showEdgeLabels,
    showNodeLabels,
    onToggleEdgeLabels: () => setShowEdgeLabels((s) => !s),
    onToggleNodeLabels: () => setShowNodeLabels((s) => !s),
  };
      
  const handleNodeDelete = () => setVersion((v) => v + 1);

  return (
    <section className="flex flex-col md:flex-row gap-3 bg-white border border-n-gray rounded-[var(--radius-card)] p-3">
      <div className="flex flex-col gap-3 md:w-1/2">
        <GraphView
          ref={viewRef}
          pages={pages}
          selectedProps={selectedProps}
          layoutName={layout}
          stylesheet={stylesheet}
          height={600}
          onSelectNode={setSelectedNode}
        />
        <LayoutControls {...controls} />
        <StatsPanel
          pages={pages}
          selectedProps={selectedProps}
          viewRef={viewRef}
          version={version}
        />
        <NodeListPanel
          viewRef={viewRef}
          pages={pages}
          selectedProps={selectedProps}
          version={version}
          onDelete={handleNodeDelete}
        />
      </div>

      {selectedNode && (
        <div className="md:w-1/2">
          <NodeDetailPanel nodeId={selectedNode} pages={pages} viewRef={viewRef} />
        </div>
      )}
    </section>
  );
}
