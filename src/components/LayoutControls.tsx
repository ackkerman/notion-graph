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
  `${baseBtn} ${active ? "bg-n-blue text-white" : "bg-white text-n-black"}`;

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
  showColorLegend: boolean;
  onToggleEdgeLabels: () => void;
  onToggleNodeLabels: () => void;
  onToggleColorLegend: () => void;
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
  showColorLegend,
  onToggleEdgeLabels,
  onToggleNodeLabels,
  onToggleColorLegend,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-n-gray bg-n-bg p-3">
      {/* header — click to collapse */}
      <div className="flex w-full items-center gap-1 text-sm font-medium text-n-black">
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex w-full items-center gap-1 text-sm font-medium text-n-black"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
          <LayoutGrid size={18} />
          Layout Controls
        </button>
        {collapsed && (
        <div className="flex gap-2">
          <button onClick={() => onChange(current as keyof typeof layouts)} className={primary(true)}>{current}</button>
          {/* zoom / fit */}
          <button onClick={onFit} className={baseBtn + " bg-white"}>
            <RefreshCw size={14} /> Fit
          </button>
          <button onClick={onZoomIn} className={baseBtn + " bg-white"}>
            <ZoomIn size={14} />
          </button>
          <button onClick={onZoomOut} className={baseBtn + " bg-white"}>
            <ZoomOut size={14} />
          </button>

          {/* export buttons */}
          <button onClick={onExportPng} className={baseBtn + " bg-white"}>
            <Download size={14} /> PNG
          </button>
          <button onClick={onExportJson} className={baseBtn + " bg-white"}>
            <FileJson size={14} /> JSON
          </button>
        </div>
        )}
      </div>

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

          <div className="flex gap-2">

            {/* zoom / fit */}
            <button onClick={onFit} className={baseBtn + " bg-white"}>
              <RefreshCw size={14} /> Fit
            </button>
            <button onClick={onZoomIn} className={baseBtn + " bg-white"}>
              <ZoomIn size={14} />
            </button>
            <button onClick={onZoomOut} className={baseBtn + " bg-white"}>
              <ZoomOut size={14} />
            </button>

            {/* export buttons */}
            <button onClick={onExportPng} className={baseBtn + " bg-white"}>
              <Download size={14} /> PNG
            </button>
            <button onClick={onExportJson} className={baseBtn + " bg-white"}>
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
            <button onClick={onToggleColorLegend} className={toggleBtn(showColorLegend)}>
              {showColorLegend ? <Eye size={14} /> : <EyeOff size={14} />} Legend
            </button>
          </div>
        </>
      )}
    </section>
  );
}
