import { describe, it, expect } from 'vitest'
import { slug, buildGraph } from '@/lib/cytoscape/graph'

const samplePages = [
  { id: '1', title: 'Page One', keywords: ['Alpha', 'Beta'], tags: ['Tag1'] },
  { id: '2', title: 'Page Two', keywords: ['Beta'], tags: ['Tag2', 'Tag3'] },
]

describe('slug', () => {
  it('creates kebab-case ids', () => {
    expect(slug('Hello World!')).toBe('hello-world')
    expect(slug(' Foo_Bar ')).toBe('foo_bar')
  })

  it('normalizes accented characters', () => {
    expect(slug('ÀÉÎÖÜ')).toBe('a-e-i-o-u')
    expect(slug('café — bar')).toBe('cafe-bar')
  })
})

describe('buildGraph', () => {
  it('builds page-only graph by default', () => {
    const g = buildGraph(samplePages)
    expect(g.nodes).toHaveLength(2)
    expect(g.edges).toHaveLength(0)
  })

  it('includes keywords when selected', () => {
    const g = buildGraph(samplePages, { selectedProps: ['__keywords'] })
    // 2 pages + 2 keywords (Alpha,Beta) unique
    expect(g.nodes.length).toBe(4)
    // edges: page->keyword
    expect(g.edges.length).toBe(3)
  })

  it('includes property values when selected', () => {
    const g = buildGraph(samplePages, { selectedProps: ['tags'] })
    // pages + tags (3 unique)
    expect(g.nodes.length).toBe(5)
    expect(g.edges.length).toBe(3)
  })

  it('deduplicates keywords and property values across pages', () => {
    const pages = [
      { id: '1', title: 'First', keywords: ['Alpha', 'Beta'], tags: ['Tag1', 'Tag2'] },
      { id: '2', title: 'Second', keywords: ['Beta', 'Gamma'], tags: ['Tag1'] },
    ]
    const g = buildGraph(pages, { selectedProps: ['__keywords', 'tags'] })
    expect(g.nodes.length).toBe(7) // 2 pages + 3 keywords + 2 tags
    expect(g.edges.length).toBe(7) // 4 keyword edges + 3 tag edges
  })

  it('applies page color via colorProp', () => {
    const pages = [
      { id: '1', title: 'First', keywords: [], __propColors: { Status: 'red' } },
      { id: '2', title: 'Second', keywords: [], __propColors: { Status: 'blue' } },
    ] as any
    const g = buildGraph(pages, { colorProp: 'Status' })
    expect(g.nodes.find(n => n.data.id === 'p-1')?.data.color).toBe('var(--color-n-red-bg)')
    expect(g.nodes.find(n => n.data.id === 'p-2')?.data.color).toBe('var(--color-n-blue-bg)')
  })
})
