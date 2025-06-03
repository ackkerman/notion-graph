import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { saveNotionToken, getNotionToken, requireNotionToken, clearNotionToken } from '@/lib/notion/notionToken'

// simple in-memory localStorage mock
function createStorage() {
  const store: Record<string, string> = {}
  return {
    setItem: (k: string, v: string) => { store[k] = v },
    getItem: (k: string) => store[k] ?? null,
    removeItem: (k: string) => { delete store[k] }
  }
}

describe('notionToken utilities', () => {
  beforeEach(() => {
    // @ts-ignore
    // localStorage accessed both via window and global
    const storage = createStorage()
    // @ts-ignore
    globalThis.window = { localStorage: storage }
    // @ts-ignore
    globalThis.localStorage = storage
  })

  afterEach(() => {
    // @ts-ignore
    delete globalThis.window
    // @ts-ignore
    delete globalThis.localStorage
  })

  it('saves and retrieves token', () => {
    saveNotionToken('abc')
    expect(getNotionToken()).toBe('abc')
  })

  it('requires token or throws', () => {
    saveNotionToken('def')
    expect(requireNotionToken()).toBe('def')
    clearNotionToken()
    expect(() => requireNotionToken()).toThrow()
  })
})
