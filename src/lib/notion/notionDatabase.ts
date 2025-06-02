import { requireNotionToken } from "@/lib/notion/notionToken";

export interface NotionPage {
  id: string;
  title: string;
  createdTime: string;
  lastEditedTime: string;
}

interface NotionRawPage  {
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: {
    [key: string]: {
      type: string;
      title?: { plain_text: string }[];
    };
  };
};

export async function fetchDatabasePages(
  databaseId: string
) {
  const token = requireNotionToken();

  const res = await fetch("/api/notion/list", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ databaseId, token }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`API Route error: ${err.message || res.statusText}`);
  }

  const data = await res.json();


  return data.results.map((page: NotionRawPage) => {
    const titleProp = Object.values(page.properties).find(
      (p) => p.type === "title"
    );
    return {
      id: page.id,
      title: titleProp?.title?.[0]?.plain_text ?? "無題",
      createdTime: page.created_time,
      lastEditedTime: page.last_edited_time,
    };
  });
}
