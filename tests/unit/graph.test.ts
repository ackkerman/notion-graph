import { describe, it, expect } from 'vitest'
import { slug, buildGraph, getConnectedNodes, computeColorMap } from '@/lib/cytoscape/graph'

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
    expect(g.nodes.every(n => typeof n.data.color === 'string')).toBe(true)
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

  it('assigns colors by property value', () => {
    const pages = [
      { id: '1', title: 'First', keywords: [], status: ['Todo'] },
      { id: '2', title: 'Second', keywords: [], status: ['Done'] },
      { id: '3', title: 'Third', keywords: [], status: ['Todo'] },
    ]
    const g = buildGraph(pages, { colorProp: 'status' })
    const colors = g.nodes.map(n => n.data.color)
    expect(colors[0]).toBe(colors[2])
    expect(colors[0]).not.toBe(colors[1])
  })
})

describe('getConnectedNodes', () => {
  it('returns nodes connected to the given node id', () => {
    const g = buildGraph(samplePages, { selectedProps: ['__keywords', 'tags'] })
    const con = getConnectedNodes(g, 'p-1')
    const labels = con.map((n) => n.label).sort()
    expect(labels).toEqual(['Alpha', 'Beta', 'Tag1'])
  })
})

describe('computeColorMap', () => {
  it('returns consistent colors for property values', () => {
    const pages = [
      { id: '1', title: 'First', keywords: [], status: ['Todo'] },
      { id: '2', title: 'Second', keywords: [], status: ['Done'] },
      { id: '3', title: 'Third', keywords: [], status: ['Todo'] },
    ]
    const map = computeColorMap(pages, 'status')
    const graph = buildGraph(pages, { colorProp: 'status' })
    const todoColor = map.get('Todo')
    const nodeColor = graph.nodes.find(n => n.data.label === 'First')?.data.color
    expect(todoColor).toBe(nodeColor)
    expect(map.size).toBe(2)
  })
})
