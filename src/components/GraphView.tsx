/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useRef, useImperativeHandle, forwardRef } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import type { PageKW } from "@/lib/cytoscape/graph";
import { buildGraph } from "@/lib/cytoscape/graph";
import type { GraphData } from "@/lib/cytoscape/types";

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
  /** 選択されたプロパティ名の配列 */
  selectedProps?: string[];
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
  removeNode: (id: string) => void;
  getNodesByDegree: () => { id: string; label: string; degree: number }[];
  getGraphData: () => GraphData;
  png: () => string | undefined;
  json: () => any;
}

const GraphView = forwardRef<GraphViewHandle, Props>(
  ({ pages, selectedProps = [], layoutName = "cose", height = 600, stylesheet }, ref) => {
    const { nodes, edges } = useMemo(
      () => buildGraph(pages, { selectedProps }),
      [pages, selectedProps]
    );
    const cyRef = useRef<cytoscape.Core | null>(null);

    /* expose methods */
  useImperativeHandle(ref, () => ({
      fit: () => cyRef.current?.fit(),
      zoomIn: () => cyRef.current?.zoom(cyRef.current.zoom() * 1.2),
      zoomOut: () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8),
      setLayout: (l: LayoutName) => cyRef.current?.layout(layouts[l]).run(),
      removeNode: (id: string) => {
        const ele = cyRef.current?.getElementById(id);
        ele?.remove();
      },
      getNodesByDegree: () => {
        if (!cyRef.current) return [];
        return cyRef.current
          .nodes()
          .map((n) => ({
            id: n.id(),
            label: n.data("label"),
            degree: n.connectedEdges().length,
          }))
          .sort((a, b) => b.degree - a.degree);
      },
      getGraphData: () => {
        if (!cyRef.current) return { nodes: [], edges: [] };
        const nodes = cyRef.current
          .nodes()
          .map((n) => ({ data: { ...n.data() } }));
        const edges = cyRef.current
          .edges()
          .map((e) => ({ data: { ...e.data() } }));
        return { nodes, edges } as GraphData;
      },
      png: () => cyRef.current?.png({ full: true }),
      json: () => cyRef.current?.json(),
    }));

    const attachHandlers = (cy: cytoscape.Core) => {
      let selectedPageId: string | null = null;

      const handleSelect = (evt: cytoscape.EventObject) => {
        const id: string = evt.target.id();
        if (id.startsWith("p-")) {
          selectedPageId = id;
        }
      };
      const handleUnselect = (evt: cytoscape.EventObject) => {
        const id: string = evt.target.id();
        if (selectedPageId === id) {
          selectedPageId = null;
        }
      };
      const openPage = (evt: cytoscape.EventObject) => {
        const id: string = evt.target.id();
        if (id.startsWith("p-") && selectedPageId === id) {
          const pageId = id.slice(2).replace(/-/g, "");
          const url = `https://www.notion.so/${pageId}`;
          window.open(url, "_blank");
        }
      };

      cy.on("select", "node[type='page']", handleSelect);
      cy.on("unselect", "node[type='page']", handleUnselect);
      cy.on("tap", "node[type='page']", openPage);

      return () => {
        cy.off("tap", "node[type='page']", openPage);
        cy.off("select", "node[type='page']", handleSelect);
        cy.off("unselect", "node[type='page']", handleUnselect);
      };
    };

    return (
      <CytoscapeComponent
        cy={(cy) => {
          const core = cy as unknown as cytoscape.Core;
          cyRef.current = core;
          attachHandlers(core);
        }}
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
