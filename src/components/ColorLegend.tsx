"use client";
import { useMemo } from "react";
import type { PageKW } from "@/lib/cytoscape/graph";
import { computeColorMap } from "@/lib/cytoscape/graph";

interface Props {
  pages: PageKW[];
  colorProp?: string;
}

export default function ColorLegend({ pages, colorProp }: Props) {
  const map = useMemo(() => computeColorMap(pages, colorProp), [pages, colorProp]);

  if (!colorProp || map.size === 0) return null;

  return (
    <div className="absolute right-2 top-2 rounded-[var(--radius-card)] border border-n-gray bg-white p-2 text-xs shadow-[var(--shadow-card)]">
      <div className="mb-1 font-medium">{colorProp}</div>
      <ul className="space-y-1">
        {[...map.entries()].map(([val, color]) => (
          <li key={val} className="flex items-center gap-1">
            <span
              className="inline-block h-3 w-3 rounded-full border"
              style={{ backgroundColor: color }}
            />
            <span>{val}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
