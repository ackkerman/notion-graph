/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */

import { requireNotionToken } from "@/lib/notion/notionToken";
import { PageKW } from "@/lib/cytoscape/graph";
import type { NotionPage, NotionRawPage } from "@/lib/notion/types";

/**
 * 指定 DB の全ページを取得し、keywords と すべての multi/select を動的に展開
 */
export async function fetchDatabasePages(dbId: string): Promise<PageKW[]> {
  const token = requireNotionToken();
  const res = await fetch("/api/notion/list", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ databaseId: dbId, token }),
  });

  const json = await res.json();

  return json.results.map((page: NotionRawPage) => {
    const obj: NotionPage = {
      id: page.id,
      title: page.properties.Name?.title?.[0]?.plain_text ?? "Untitled",
      keywords: [], // 後で addPageKeywords が埋める
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
    };
    const colorMap: Record<string, string> = {};

    /* すべての multi_select / select / status を走査して配列化 */
    Object.entries(page.properties).forEach(([key, prop]: [string, any]) => {
      if (prop.type === "multi_select") {
        obj[key] = prop.multi_select.map((v: any) => v.name);
        // multi_select は色をページ側には持たない
      }
      if (prop.type === "select" && prop.select) {
        obj[key] = [prop.select.name];
        colorMap[key] = prop.select.color;
      }
      if (prop.type === "status" && prop.status) {
        obj[key] = [prop.status.name];
        colorMap[key] = prop.status.color;
      }
    });

    return { ...(obj as PageKW), __propColors: colorMap };
  });
}
