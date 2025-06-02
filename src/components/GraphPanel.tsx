"use client";
import { useRef, useState, useEffect } from "react";
import GraphView, { GraphViewHandle } from "./GraphView";
import LayoutControls from "./LayoutControls";
import { buildStyles } from "@/lib/cytoscape/styles";
import type { PageKW } from "@/lib/graph";
import { layouts } from "./GraphView";

type Props = { pages: PageKW[] };

export default function GraphPanel({ pages }: Props) {
  const viewRef = useRef<GraphViewHandle>(null);
  const [layout, setLayout] = useState<keyof typeof layouts>("cose-bilkent");

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
    showEdgeLabels,
    showNodeLabels,
    onToggleEdgeLabels: () => setShowEdgeLabels((s) => !s),
    onToggleNodeLabels: () => setShowNodeLabels((s) => !s),
  };

  return (
    <section className="flex flex-col gap-3 bg-n-bg border border-n-gray rounded-[var(--radius-card)] p-3">
      <LayoutControls {...controls} />
      <GraphView
        ref={viewRef}
        pages={pages}
        layoutName={layout}
        stylesheet={stylesheet}
        height={550}
      />
    </section>
  );
}
