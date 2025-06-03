import { requireNotionToken } from "@/lib/notion/notionToken";
import type { NotionPage, NotionRawPage } from "@/lib/notion/types";

export async function fetchPageDetail(pageId: string): Promise<NotionPage> {
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

  const page: NotionRawPage = await res.json();

  const obj: NotionPage = {
    id: page.id,
    title:
      Array.isArray(page.properties.Name?.title) &&
      page.properties.Name.title[0]?.plain_text
        ? page.properties.Name.title[0].plain_text
        : "Untitled",
    createdTime: page.created_time,
    lastEditedTime: page.last_edited_time,
    url: page.url,
    keywords: [],
  };

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

  return obj;
}
