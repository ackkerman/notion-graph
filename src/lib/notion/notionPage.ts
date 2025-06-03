import { requireNotionToken } from "@/lib/notion/notionToken";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type NotionBlock = BlockObjectResponse;

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

  return json.results as NotionBlock[];
}
