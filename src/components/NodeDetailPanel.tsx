"use client";
import { useEffect, useState } from "react";
import type { PageKW } from "@/lib/cytoscape/graph";
import { fetchPageDetail } from "@/lib/notion/notionPage";

interface Props {
  nodeId: string | null;
}

export default function NodeDetailPanel({ nodeId }: Props) {
  const [detail, setDetail] = useState<PageKW | null>(null);

  useEffect(() => {
    if (!nodeId || !nodeId.startsWith("p-")) {
      setDetail(null);
      return;
    }

    let cancelled = false;
    const id = nodeId.slice(2);
    fetchPageDetail(id)
      .then((p) => {
        if (!cancelled) setDetail(p as PageKW);
      })
      .catch(() => {
        if (!cancelled) setDetail(null);
      });

    return () => {
      cancelled = true;
    };
  }, [nodeId]);

  return (
    <section className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-n-gray bg-n-bg p-3 text-sm">
      {detail ? (
        <div className="space-y-1">
          <h2 className="font-semibold">{detail.title}</h2>
          <ul className="ml-4 list-disc space-y-1">
            {Object.entries(detail)
              .filter(([k]) => !["id", "title", "keywords"].includes(k))
              .map(([k, v]) => (
                <li key={k}>
                  <span className="font-medium">{k}:</span> {Array.isArray(v) ? v.join(", ") : v}
                </li>
              ))}
          </ul>
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
