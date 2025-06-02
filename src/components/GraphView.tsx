/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useRef, useImperativeHandle, forwardRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import type { PageKW } from "@/lib/graph";
import { buildKeywordGraph } from "@/lib/graph";

import COSEBilkent from "cytoscape-cose-bilkent";
import cola from "cytoscape-cola";
import dagre from "cytoscape-dagre";
import elk from "cytoscape-elk";
import klay from "cytoscape-klay";
import cytoscape from "cytoscape";


if (!(globalThis as any)[Symbol.for("cytoscapeExts")]) {
  (globalThis as any)[Symbol.for("cytoscapeExts")] = true;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  cytoscape.use(COSEBilkent);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  cytoscape.use(cola);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  cytoscape.use(dagre);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  cytoscape.use(elk);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  cytoscape.use(klay);
}

export const layouts = {
  'cose': { name: 'cose', animate: true, randomize: false, nodeDimensionsIncludeLabels: true },
  'breadthfirst': { name: 'breadthfirst', directed: true, animate: true, spacingFactor: 1.5 },
  'concentric': { name: 'concentric', animate: true, minNodeSpacing: 50 },
  'grid': { name: 'grid', animate: true, condense: true },
  'circle': { name: 'circle', animate: true },
  'random': { name: 'random', animate: true },
  'preset': { name: 'preset', animate: true },
  'null': { name: 'null', animate: false },
  'cose-bilkent': { name: 'cose-bilkent', animate: true, randomize: false, nodeDimensionsIncludeLabels: true },
  'cola': { name: 'cola', animate: true, randomize: false, nodeDimensionsIncludeLabels: true },
  'dagre': { name: 'dagre', directed: true, animate: true, spacingFactor: 1.5 },
  'elk': { name: 'elk', animate: true, randomize: false, nodeDimensionsIncludeLabels: true },
  'klay': { name: 'klay', animate: true, randomize: false, nodeDimensionsIncludeLabels: true }
} as const;

type LayoutName = keyof typeof layouts;

type Props = {
  /** keywords 付きページ配列 */
  pages: PageKW[];
  /** レイアウト名 （例: "cose" "fcose" など）*/
  layoutName?: LayoutName;
  /** グラフ高さ */
  height?: number;
  // @ts-ignore
  stylesheet: cytoscape.Stylesheet[];
};

export interface GraphViewHandle {
  fit: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setLayout: (l: LayoutName) => void;
}

const GraphView = forwardRef<GraphViewHandle, Props>(
  ({ pages, layoutName = "cose", height = 600, stylesheet }, ref) => {
    const { nodes, edges } = useMemo(() => buildKeywordGraph(pages), [pages]);
    const cyRef = useRef<cytoscape.Core | null>(null);

    /* expose methods */
    useImperativeHandle(ref, () => ({
      fit: () => cyRef.current?.fit(),
      zoomIn: () => cyRef.current?.zoom(cyRef.current.zoom() * 1.2),
      zoomOut: () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8),
      setLayout: (l: LayoutName) => cyRef.current?.layout(layouts[l]).run(),
    }));

    return (
      <CytoscapeComponent
        cy={(cy) => (cyRef.current = cy)}
        elements={[...nodes, ...edges]}
        layout={layouts[layoutName]}
        stylesheet={stylesheet}
        style={{ width: "100%", height }}
      />
    );
  }
);
GraphView.displayName = "GraphView";
export default GraphView;
