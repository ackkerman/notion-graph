"use client";
import { useEffect, useState } from "react";
import { fetchPageDetail } from "@/lib/notion/notionPage";
import NotionRenderer from "@/components/NotionRenderer";
import { renderBlocks, sanitizeHtml } from "@/lib/notion/renderBlocks";

interface Props {
  nodeId: string | null;
}

export default function NodeDetailPanel({ nodeId }: Props) {
  const [html, setHtml] = useState<string | null>(null);

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

  return (
    <section className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-n-gray bg-n-bg p-3 text-sm">
      {html ? (
        <div className="space-y-1">
          <h2 className="font-semibold">Blocks</h2>
          <NotionRenderer html={html} />
        </div>
      ) : (
        <div className="space-y-1">
          {/* TODO:Page以外のNodeKindの処理(引数受け取り処理から変更する必要あり) */}
          <h2 className="font-semibold">Node Detail</h2>
          <p className="text-n-gray-600">Unsupported node.</p>
        </div>
      )}
    </section>
  );
}
