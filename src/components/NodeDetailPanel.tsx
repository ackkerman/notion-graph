"use client";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { PageKW } from "@/lib/cytoscape/graph";
import type { GraphViewHandle } from "./GraphView";
import type { NodeData } from "@/lib/cytoscape/types";
import { slug, getConnectedNodes } from "@/lib/cytoscape/graph";
import { fetchPageDetail } from "@/lib/notion/notionPage";
import NotionRenderer from "@/components/NotionRenderer";
import { renderBlocks, sanitizeHtml } from "@/lib/notion/renderBlocks";

interface Props {
  nodeId: string | null;
  pages: PageKW[];
  viewRef: React.RefObject<GraphViewHandle | null>;
}

type PageDetail = { type: "page"; page: PageKW; connected: NodeData[] };
type KeywordDetail = { type: "keyword"; keyword: string; pages: PageKW[] };
type PropDetail = { type: "prop"; prop: string; value: string; pages: PageKW[] };
type Detail = PageDetail | KeywordDetail | PropDetail | null;
  
export default function NodeDetailPanel({ nodeId, pages, viewRef }: Props) {
  const [html, setHtml] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!nodeId || !nodeId.startsWith("p-")) {
      setHtml(null);
      return;
    }

    let cancelled = false;
    const id = nodeId.slice(2);
    fetchPageDetail(id)
      .then(async(b) => {
        if (cancelled) return;
        const raw = await renderBlocks(b);
        setHtml(sanitizeHtml(raw));
      })
      .catch(() => {
        if (!cancelled) setHtml(null);
      });

    return () => {
      cancelled = true;
    };
  }, [nodeId]);

  useEffect(() => {
    if (!nodeId) {
      setDetail(null);
      return;
    }

    const graph = viewRef.current?.getGraphData();
    const node = graph?.nodes.find((n) => n.data.id === nodeId)?.data as
      | NodeData
      | undefined;

    if (!node) {
      setDetail(null);
      return;
    }

    if (node.type === "page") {
      const page = pages.find((p) => `p-${p.id}` === nodeId);
      if (page) {
        const connected = graph ? getConnectedNodes(graph, nodeId) : [];
        setDetail({ type: "page", page, connected });
      } else setDetail(null);
      return;
    }

    if (node.type === "keyword") {
      const keySlug = nodeId.slice(2);
      const kwPages = pages.filter((p) =>
        p.keywords.some((kw) => slug(kw) === keySlug)
      );
      const kw = kwPages.length
        ? kwPages[0].keywords.find((kw) => slug(kw) === keySlug) || node.label
        : node.label;
      setDetail({ type: "keyword", keyword: kw, pages: kwPages });
      return;
    }

    if (node.type === "prop") {
      const prop = node.propName || "";
      const valSlug = slug(node.label);
      const propPages = pages.filter((p) => {
        const vals: string[] = p[prop] ?? [];
        return Array.isArray(vals) && vals.some((v) => slug(v) === valSlug);
      });
      setDetail({ type: "prop", prop, value: node.label, pages: propPages });
      return;
    }

    setDetail(null);
  }, [nodeId, pages, viewRef]);

  useEffect(() => {
    setCollapsed(false);
  }, [detail]);

  return (
    <section className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-n-gray bg-n-bg p-3 text-sm">
      {detail?.type === "page" && (
        <div className="space-y-1">
          <h2 className="font-semibold">{detail.page.title}</h2>
          <ul className="ml-4 list-disc space-y-1">
            {Object.entries(detail.page)
              .filter(([k]) => !["id", "title", "keywords"].includes(k))
              .map(([k, v]) => (
                <li key={k}>
                  <span className="font-medium">{k}:</span> {Array.isArray(v) ? v.join(", ") : v}
                </li>
              ))}
          </ul>
          {detail.connected.length > 0 && (
            <>
              <h3 className="mt-2 font-medium">Connected Nodes</h3>
              <ul className="ml-4 list-disc space-y-1">
                {detail.connected.map((n) => (
                  <li key={n.id}>{n.label}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
      {detail?.type === "keyword" && (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <h2 className="font-semibold flex-1">{detail.keyword}</h2>
            {detail.pages.length > 0 && (
              <button onClick={() => setCollapsed((c) => !c)}>
                {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>
          {!collapsed && (
            <ul className="ml-4 list-disc space-y-1">
              {detail.pages.map((p) => (
                <li key={p.id}>{p.title}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {detail?.type === "prop" && (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <h2 className="font-semibold flex-1">
              {detail.prop}: {detail.value}
            </h2>
            {detail.pages.length > 0 && (
              <button onClick={() => setCollapsed((c) => !c)}>
                {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>
          {!collapsed && (
            <ul className="ml-4 list-disc space-y-1">
              {detail.pages.map((p) => (
                <li key={p.id}>{p.title}</li>
              ))}
            </ul>
          )}
        </div>
      )}
      {!detail && (
        <div className="space-y-1">
          <h2 className="font-semibold">Node Detail</h2>
          <p className="text-n-gray-600">Unsupported node.</p>
        </div>
      )}
      <NotionRenderer html={html ?? ""} />
    </section>
  );
}
