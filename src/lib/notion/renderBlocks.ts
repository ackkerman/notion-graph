import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';

function escape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function textOf(block: { rich_text?: { plain_text: string }[] }): string {
  return (block.rich_text || [])
    .map((t) => t.plain_text)
    .join('');
}

export function renderBlocks(blocks: BlockObjectResponse[]): string {
  const out: string[] = [];
  for (const b of blocks) {
    switch (b.type) {
      case 'heading_1':
        out.push(`<h1>${escape(textOf(b.heading_1))}</h1>`);
        break;
      case 'heading_2':
        out.push(`<h2>${escape(textOf(b.heading_2))}</h2>`);
        break;
      case 'heading_3':
        out.push(`<h3>${escape(textOf(b.heading_3))}</h3>`);
        break;
      case 'paragraph':
        out.push(`<p>${escape(textOf(b.paragraph))}</p>`);
        break;
      case 'bulleted_list_item':
        out.push(`<ul><li>${escape(textOf(b.bulleted_list_item))}</li></ul>`);
        break;
      case 'numbered_list_item':
        out.push(`<ol><li>${escape(textOf(b.numbered_list_item))}</li></ol>`);
        break;
      case 'to_do':
        out.push(`<ul><li><input type="checkbox" disabled ${b.to_do.checked ? 'checked' : ''}/> ${escape(textOf(b.to_do))}</li></ul>`);
        break;
      case 'code':
        out.push(`<pre><code>${escape(textOf(b.code))}</code></pre>`);
        break;
      default:
        out.push(`<div>Unsupported block ${escape(b.type)}</div>`);
    }
  }
  return out.join('\n');
}

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script,style').forEach((el) => el.remove());
  return doc.body.innerHTML;
}
