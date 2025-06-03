// lib/notionMeta.ts
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import { requireNotionToken } from "@/lib/notion/notionToken";
import type { DbProperty } from "@/lib/notion/types";

/** データベースのプロパティ一覧を取得 */
export async function fetchDatabaseProperties(
  databaseId: string
): Promise<DbProperty[]> {
  const token = requireNotionToken();

  const res = await fetch("/api/notion/meta", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ databaseId, token }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Meta fetch error: ${err.message || res.statusText}`);
  }

  const json = await res.json();
  return Object.entries(json.properties).map(([name, prop]: any) => ({
    id: prop.id,
    name,
    type: prop.type,
  }));
}
