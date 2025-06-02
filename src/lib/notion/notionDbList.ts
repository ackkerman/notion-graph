// lib/notionDbList.ts
import { requireNotionToken } from "@/lib/notion/notionToken";

export type DbInfo = { id: string; title: string };

/** Accessible DB を検索 (Notion /v1/search) */
export async function listDatabases(): Promise<DbInfo[]> {
  const token = requireNotionToken();

  const res = await fetch("/api/notion/dbs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) throw new Error("DB List fetch failed");
  const json = await res.json();

  return json.results.map((db: any) => ({
    id: db.id,
    title: db.title?.[0]?.plain_text ?? "",
  }));
}
