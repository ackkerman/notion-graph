"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Eye,
  EyeOff,
  Download,
  FileJson,
} from "lucide-react";
import { layouts } from "./GraphView";

const baseBtn =
  "px-3 py-1 flex items-center gap-1 text-xs border border-n-gray rounded-[var(--radius-btn)]";

const primary = (active: boolean) =>
  `${baseBtn} ${active ? "bg-n-blue text-white" : "bg-n-bg text-n-black"}`;

const toggleBtn = (active: boolean) =>
  `${baseBtn} ${active ? "bg-n-green text-white border-transparent" : "bg-n-gray text-white border-transparent"}`;


type Props = {
  current: keyof typeof layouts;
  onChange: (l: keyof typeof layouts) => void;
  onFit: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onExportPng: () => void;
  onExportJson: () => void;
  showEdgeLabels: boolean;
  showNodeLabels: boolean;
  onToggleEdgeLabels: () => void;
  onToggleNodeLabels: () => void;
};

export default function LayoutControls({
  current,
  onChange,
  onFit,
  onZoomIn,
  onZoomOut,
  onExportPng,
  onExportJson,
  showEdgeLabels,
  showNodeLabels,
  onToggleEdgeLabels,
  onToggleNodeLabels,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-n-gray bg-n-bg p-3">
      {/* header — click to collapse */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center gap-1 text-sm font-medium text-n-black"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        <LayoutGrid size={18} />
        Layout Controls
      </button>

      {/* body — hidden when collapsed */}
      {!collapsed && (
        <>
          {/* layout buttons */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(layouts).map((l) => (
              <button
                key={l}
                className={primary(current === l)}
                onClick={() => onChange(l as keyof typeof layouts)}
              >
                {l}
              </button>
            ))}
          </div>

          {/* zoom / fit */}
          <div className="flex gap-2">
            <button onClick={onFit} className={baseBtn}>
              <RefreshCw size={14} /> Fit
            </button>
            <button onClick={onZoomIn} className={baseBtn}>
              <ZoomIn size={14} />
            </button>
            <button onClick={onZoomOut} className={baseBtn}>
              <ZoomOut size={14} />
            </button>
          </div>

          {/* export buttons */}
          <div className="flex gap-2">
            <button onClick={onExportPng} className={baseBtn}>
              <Download size={14} /> PNG
            </button>
            <button onClick={onExportJson} className={baseBtn}>
              <FileJson size={14} /> JSON
            </button>
          </div>

          {/* toggles */}
          <div className="flex flex-wrap gap-2">
            <button onClick={onToggleEdgeLabels} className={toggleBtn(showEdgeLabels)}>
              {showEdgeLabels ? <Eye size={14} /> : <EyeOff size={14} />} Edge Labels
            </button>
            <button onClick={onToggleNodeLabels} className={toggleBtn(showNodeLabels)}>
              {showNodeLabels ? <Eye size={14} /> : <EyeOff size={14} />} Node Labels
            </button>
          </div>
        </>
      )}
    </section>
  );
}
