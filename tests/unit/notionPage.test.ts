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

  it('parses block list', async () => {
    const raw = {
      results: [
        { id: 'b1', type: 'heading_2', heading_2: { rich_text: [{ plain_text: 'T1' }] } },
        { id: 'b2', type: 'paragraph', paragraph: { rich_text: [{ plain_text: 'Hello' }] } }
      ]
    }

    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => raw
    })))

    const blocks = await fetchPageDetail('1')
    expect(blocks).toEqual([
      { id: 'b1', type: 'heading_2', text: 'T1' },
      { id: 'b2', type: 'paragraph', text: 'Hello' }
    ])
  })
})
