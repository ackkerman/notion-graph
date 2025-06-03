"use client";
import { useEffect, useState } from "react";
import type { NotionBlock } from "@/lib/notion/notionPage";
import { fetchPageDetail } from "@/lib/notion/notionPage";

interface Props {
  nodeId: string | null;
}

export default function NodeDetailPanel({ nodeId }: Props) {
  const [blocks, setBlocks] = useState<NotionBlock[] | null>(null);

  useEffect(() => {
    if (!nodeId || !nodeId.startsWith("p-")) {
      setBlocks(null);
      return;
    }

    let cancelled = false;
    const id = nodeId.slice(2);
    fetchPageDetail(id)
      .then((b) => {
        if (!cancelled) setBlocks(b);
      })
      .catch(() => {
        if (!cancelled) setBlocks(null);
      });

    return () => {
      cancelled = true;
    };
  }, [nodeId]);

  return (
    <section className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-n-gray bg-n-bg p-3 text-sm">
      {blocks ? (
        <div className="space-y-1">
          <h2 className="font-semibold">Blocks</h2>
          <ul className="ml-4 list-disc space-y-1">
            {blocks.map((b) => (
              <li key={b.id}>
                <span className="font-medium">{b.type}:</span> {b.text}
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
