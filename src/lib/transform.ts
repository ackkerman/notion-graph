export function toGraph(pages: any[]) {
  const nodes = pages.map((p) => ({ data: { id: p.id, label: p.title } }));
  const edges = pages.flatMap((p) =>
    p.relations.map((targetId: string) => ({
      data: { source: p.id, target: targetId },
    }))
  );
  return { nodes, edges };
}
