import { describe, it, expect } from 'vitest'
import { buildGraph } from '@/lib/cytoscape/graph'
import { computeGraphStats } from '@/lib/cytoscape/stats'

const pages = [
  { id: '1', title: 'First', keywords: ['Alpha'], tags: ['Tag1'] },
  { id: '2', title: 'Second', keywords: ['Alpha', 'Beta'], tags: ['Tag2'] },
  { id: '3', title: 'Third', keywords: ['Beta'], tags: ['Tag1'] }
]

describe('computeGraphStats', () => {
  it('returns node and edge counts and central nodes', () => {
    const graph = buildGraph(pages, { selectedProps: ['__keywords', 'tags'] })
    const stats = computeGraphStats(graph)
    expect(stats.nodeCount).toBe(7)
    expect(stats.edgeCount).toBe(7)
    expect(stats.avgDegree).toBeCloseTo((2 * 7) / 7)
    expect(stats.topCentralNodes[0].label).toBe('Second')
  })
})
