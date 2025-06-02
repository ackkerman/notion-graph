// lib/notion.ts
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function getNotionPages(databaseId: string) {
  const res = await notion.databases.query({ database_id: databaseId });
  return res.results.map((page) => ({
    id: page.id,
    title: page.properties.Name?.title?.[0]?.plain_text || "Untitled",
    relations: page.properties.Related?.relation?.map((r) => r.id) || [],
  }));
}
