"use client";
import CytoscapeComponent from "react-cytoscapejs";

export function GraphView({ nodes, edges }: { nodes: any[]; edges: any[] }) {
  return (
    <CytoscapeComponent
      elements={[...nodes, ...edges]}
      layout={{ name: "cose" }}
      style={{ width: "100%", height: "600px" }}
    />
  );
}
