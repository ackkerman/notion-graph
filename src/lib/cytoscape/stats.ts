import type { GraphData } from './types'

export interface CentralNode {
  id: string
  label: string
  degree: number
}

export interface GraphStats {
  nodeCount: number
  edgeCount: number
  avgDegree: number
  topCentralNodes: CentralNode[]
}

export function computeGraphStats(graph: GraphData): GraphStats {
  const { nodes, edges } = graph
  const degree = new Map<string, number>()
  edges.forEach((e) => {
    degree.set(e.data.source, (degree.get(e.data.source) || 0) + 1)
    degree.set(e.data.target, (degree.get(e.data.target) || 0) + 1)
  })

  const nodeCount = nodes.length
  const edgeCount = edges.length
  const avgDegree = nodeCount === 0 ? 0 : (2 * edgeCount) / nodeCount
  const labelMap = new Map(nodes.map((n) => [n.data.id, n.data.label]))
  const central = Array.from(degree.entries())
    .map(([id, d]) => ({ id, label: labelMap.get(id) ?? id, degree: d }))
    .sort((a, b) => b.degree - a.degree)
    .slice(0, 5)

  return { nodeCount, edgeCount, avgDegree, topCentralNodes: central }
}
