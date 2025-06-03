import { requireNotionToken } from "@/lib/notion/notionToken";

export interface NotionBlock {
  id: string;
  type: string;
  text: string;
}

interface NotionBlockRaw {
  id: string;
  type: string;
  [key: string]: unknown;
}

export async function fetchPageDetail(pageId: string): Promise<NotionBlock[]> {
  const token = requireNotionToken();

  const res = await fetch("/api/notion/page", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pageId, token }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Page fetch error: ${err.message || res.statusText}`);
  }

  const json = await res.json();

  return (json.results as NotionBlockRaw[]).map((b) => {
    const detail = b[b.type] as { rich_text?: { plain_text: string }[] };
    const rich = detail?.rich_text || [];
    const text = rich.map((t) => t.plain_text).join("");
    return { id: b.id as string, type: b.type as string, text };
  });
}
