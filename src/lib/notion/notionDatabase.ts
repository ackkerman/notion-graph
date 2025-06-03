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

  console.log("Fetched pages:", json)

  return json.results.map((page: NotionRawPage) => {
    const obj: NotionPage = {
      id: page.id,
      title: Array.isArray(page.properties.Name?.title) && page.properties.Name.title[0]?.plain_text
        ? page.properties.Name.title[0].plain_text
        : "Untitled",
      keywords: [], // 後で addPageKeywords が埋める
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
      url: page.url,
    };

    /* すべてのプロパティを走査して抽出 */
    Object.entries(page.properties).forEach(([key, prop]) => {
      if (prop.type === "multi_select") {
        obj[key] = (prop.multi_select as { name: string }[]).map((v) => v.name);
      } else if (prop.type === "select" && prop.select) {
        obj[key] = [(prop.select as { name: string }).name];
      } else if (prop.type === "status" && prop.status) {
        obj[key] = [(prop.status as { name: string }).name];
      } else if (prop.type === "url" && typeof prop.url === "string") {
        obj[key] = prop.url;
      } else if (prop.type === "rich_text") {
        obj[key] = (prop.rich_text as { plain_text: string }[])
          .map((t) => t.plain_text)
          .join("");
      } else if (prop.type === "created_time" && prop.created_time) {
        obj[key] = String(prop.created_time);
      }
    });

    return obj as PageKW;
  });
}
