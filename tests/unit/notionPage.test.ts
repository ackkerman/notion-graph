import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { fetchPageDetail } from '@/lib/notion/notionPage'

function createStorage() {
  const store: Record<string, string> = {}
  return {
    setItem: (k: string, v: string) => { store[k] = v },
    getItem: (k: string) => store[k] ?? null,
    removeItem: (k: string) => { delete store[k] }
  }
}

describe('fetchPageDetail', () => {
  beforeEach(() => {
    const storage = createStorage()
    // @ts-ignore
    globalThis.window = { localStorage: storage }
    // @ts-ignore
    globalThis.localStorage = storage
    localStorage.setItem('notion_token', 't')
  })

  afterEach(() => {
    // @ts-ignore
    delete globalThis.window
    // @ts-ignore
    delete globalThis.localStorage
    vi.restoreAllMocks()
  })

  it('parses various property types', async () => {
    const raw = {
      id: '1',
      created_time: '2025-06-01T00:00:00.000Z',
      last_edited_time: '2025-06-01T00:00:00.000Z',
      url: 'https://notion.so/page1',
      properties: {
        Name: { type: 'title', title: [{ plain_text: 'Sample' }] },
        Tags: { type: 'multi_select', multi_select: [{ name: 'A' }, { name: 'B' }] },
        Status: { type: 'status', status: { name: 'Todo' } },
        URL: { type: 'url', url: 'https://example.com' },
        Note: { type: 'rich_text', rich_text: [{ plain_text: 'hello' }] },
        Created: { type: 'created_time', created_time: '2025-06-01T00:00:00.000Z' }
      }
    }

    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => raw
    })))

    const page = await fetchPageDetail('1')
    expect(page).toEqual({
      id: '1',
      title: 'Sample',
      keywords: [],
      createdTime: raw.created_time,
      lastEditedTime: raw.last_edited_time,
      url: raw.url,
      Tags: ['A', 'B'],
      Status: ['Todo'],
      URL: 'https://example.com',
      Note: 'hello',
      Created: raw.created_time
    })
  })
})
