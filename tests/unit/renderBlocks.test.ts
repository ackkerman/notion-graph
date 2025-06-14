import { describe, it, expect, vi } from 'vitest'
vi.mock('@notion-render/client', () => ({
  NotionRenderer: class {
    async render() {
      return '<h1>Title</h1>\n<p>Hello</p>'
    }
  }
}))
import { renderBlocks } from '@/lib/notion/renderBlocks'
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'

describe('renderBlocks', () => {
  it('renders simple blocks to html', async () => {
    const blocks: BlockObjectResponse[] = [
      {
        id: '1',
        type: 'heading_1',
        heading_1: { rich_text: [{ plain_text: 'Title' }], color: 'default' }
      } as unknown as BlockObjectResponse,
      {
        id: '2',
        type: 'paragraph',
        paragraph: { rich_text: [{ plain_text: 'Hello' }], color: 'default' }
      } as unknown as BlockObjectResponse
    ]

    const html = await renderBlocks(blocks)
    expect(html).toContain('Title')
    expect(html).toContain('Hello')
  })
})
