
const tokens = {
  pageFill:    "#487CA5",
  pageText:    "#2f3437",
  kwFill:      "#548164",
  kwText:      "#2f3437",
  edgeColor:   "#787774",
  selectColor: "#64473a",
  propFill:    "#9065b0",
  propText:    "#2f3437",
} as const;


type StyleOpts = {
  showNodeLabels?: boolean;
  showEdgeLabels?: boolean;
};

export const buildStyles = ({
  showNodeLabels = true,
  showEdgeLabels = false,
  // @ts-expect-error, Cytoscape has no type definition for this
}: StyleOpts = {}): cytoscape.Stylesheet[] => [
  /* base */
  {
    selector: "node",
    style: {
      label: showNodeLabels ? "data(label)" : "",
      "text-wrap": "wrap",
      "text-valign": "center",
      "text-halign": "center",
      "font-family": "var(--font-sans)",
    },
  },

  /* page nodes */
  {
    selector: 'node[type="page"]',
    style: {
      "background-color": "data(color)",
      opacity: 0.8,
      color: tokens.pageText,
      width: 60,
      height: 60,
      "font-size": 8,
      "text-max-width": 40,
      "border-width": 1,
      "border-color": "var(--color-n-blue)",
    },
  },

  /* keyword nodes */
  {
    selector: 'node[type="keyword"]',
    style: {
      "background-color": tokens.kwFill,
      opacity: 0.8,
      color: tokens.kwText,
      width: 26,
      height: 26,
      "font-size": 6,
      "text-max-width": 60,
      "border-width": 1,
      "border-color": "var(--color-n-green)",
    },
  },

  {
    selector: 'node[type="prop"]',
    style: {
      "background-color": tokens.propFill
    },
  },

  /* edges */
  {
    selector: "edge",
    style: {
      width: 1,
      "curve-style": "haystack",
      "haystack-radius": 0.6,
      "line-color": tokens.edgeColor,
      opacity: 0.6,
      label: showEdgeLabels ? "data(weight)" : "",
      "font-size": 5,
      color: tokens.edgeColor,
    },
  },

  /* selection */
  {
    selector: ":selected",
    style: {
      "border-width": 4,
      "border-color": tokens.selectColor,
      "line-color": tokens.selectColor,
    },
  },
];
