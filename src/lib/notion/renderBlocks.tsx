import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionRenderer } from "@notion-render/client";

export async function renderBlocks(blocks: BlockObjectResponse[]): Promise<string> {
  const renderer = new NotionRenderer({});
  const html = await renderer.render(...blocks);
  return html;
}

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script,style').forEach((el) => el.remove());
  return doc.body.innerHTML;
}
