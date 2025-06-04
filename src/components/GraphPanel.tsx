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
  const containerRef = useRef<HTMLDivElement>(null);
  const [detailWidth, setDetailWidth] = useState(50);

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

  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const container = containerRef.current;
    if (!container) return;
    const width = container.offsetWidth;
    const startWidth = detailWidth;
    const onMove = (ev: PointerEvent) => {
      const delta = ev.clientX - startX;
      const newWidth = ((startWidth / 100) * width - delta) / width * 100;
      setDetailWidth(Math.min(80, Math.max(20, newWidth)));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <section
      ref={containerRef}
      className="flex flex-col md:flex-row gap-3 bg-white border border-n-gray rounded-[var(--radius-card)] p-3"
    >
      <div
        className="flex flex-col gap-3"
        style={{ width: selectedNode ? `${100 - detailWidth}%` : "100%" }}
      >
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
        <>
          <div
            onPointerDown={startDrag}
            className="hidden md:block w-1 cursor-col-resize bg-n-gray"
          />
          <div style={{ width: `${detailWidth}%` }} className="md:flex-shrink-0">
            <NodeDetailPanel
              nodeId={selectedNode}
              pages={pages}
              viewRef={viewRef}
            />
          </div>
        </>
      )}
    </section>
  );
}
