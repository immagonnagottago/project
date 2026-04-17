// perception.js
// Perception is weighted by two independent distance axes:
//   FALLOFF_H — horizontal distance through the xy lattice.
//   FALLOFF_V — vertical distance through z levels.
// Final weight = H_falloff * V_falloff.

const FALLOFF_H = { 0: 1.0, 1: 0.6, 2: 0.3 };
const FALLOFF_V = { 0: 1.0, 1: 0.8, 2: 0.6 };

const MAX_H = Math.max(...Object.keys(FALLOFF_H).map(Number));

// BFS outward from originId through horizontal adjacency only (same z).
function getHDistanceMap(originId) {
  const origin    = NODES.find(n => n.id === originId);
  const distances = new Map();
  const queue     = [{ id: originId, dist: 0 }];
  distances.set(originId, 0);

  while (queue.length) {
    const { id, dist } = queue.shift();
    if (dist >= MAX_H) continue;

    for (const neighbor of getAdjacent(id)) {
      const nb = NODES.find(n => n.id === neighbor.id);
      if (nb?.z !== origin?.z) continue; // horizontal pass only
      if (!distances.has(neighbor.id)) {
        distances.set(neighbor.id, dist + 1);
        queue.push({ id: neighbor.id, dist: dist + 1 });
      }
    }
  }

  return distances;
}

function scoreNodes(nodes, hDistMap) {
  const playerNode = NODES.find(n => n.id === PLAYER_NODE);
  const counts     = {};

  for (const node of nodes) {
    const hDist   = hDistMap.get(node.id) ?? MAX_H;
    const vDist   = (node.z != null && playerNode.z != null)
                  ? Math.abs(node.z - playerNode.z)
                  : 0;
    const hFall   = FALLOFF_H[hDist] ?? 0;
    const vFall   = FALLOFF_V[vDist] ?? 0;
    const falloff = hFall * vFall;

    if (falloff === 0) continue;
    node._falloff = falloff;

    for (const tag of node.tags)
      counts[tag] = (counts[tag] || 0) + falloff;
  }

  const total     = nodes.length;
  const tagScores = {};

  for (const tag of Object.keys(counts)) {
    const def       = TAGS[tag] ?? { division: 'cosmetic', prominence: 0.5 };
    const divBonus  = DIVISION_BONUS[def.division] ?? 0;
    const intrinsic = def.division === 'structural' ? (def.priority ?? 0)
                    : def.division === 'cosmetic'   ? (def.prominence ?? 0.5)
                    : 0;
    const majority  = counts[tag] / total;
    tagScores[tag]  = divBonus + intrinsic + majority;
  }

  const nodeScores = nodes.map(node => ({
    ...node,
    score: (node._falloff ?? 0) *
           node.tags.reduce((sum, t) => sum + (tagScores[t] ?? 0), 0),
  }));

  return { tagScores, nodeScores };
}

function describe() {
  const playerNode    = NODES.find(n => n.id === PLAYER_NODE);
  const container     = getContainer(PLAYER_NODE);
  const scaleTag      = container?.tags.find(t => TAGS[t]?.division === 'scale') ?? 'room';
  const interiorNodes = container ? getChildren(container.id) : [playerNode];
  const hDistMap      = getHDistanceMap(PLAYER_NODE);

  // Nodes not reachable horizontally — assign hDist 0 if same column, else MAX_H.
  for (const node of interiorNodes) {
    if (!hDistMap.has(node.id)) {
      const sameColumn = node.x === playerNode.x && node.y === playerNode.y;
      hDistMap.set(node.id, sameColumn ? 0 : MAX_H);
    }
  }

  const { tagScores, nodeScores } = scoreNodes(interiorNodes, hDistMap);

  // Dominant cosmetic tag.
  const topMaterial = Object.keys(tagScores)
    .filter(t => TAGS[t]?.division === 'cosmetic')
    .sort((a, b) => tagScores[b] - tagScores[a])[0] ?? '';

  // Floor — underfoot material and relational prep.
  const floorNode       = interiorNodes.find(n => n.tags.includes('floor'));
  const floorMaterial   = floorNode?.tags.find(t => TAGS[t]?.division === 'cosmetic') ?? '';
  const floorRelational = floorNode?.tags.find(t => TAGS[t]?.division === 'relational') ?? '';

  const PREP      = { below: 'underfoot', above: 'overhead', lateral: 'around you' };
  const floorPrep = PREP[floorRelational] ?? '';

  const ambient = `A ${topMaterial} ${scaleTag}, ${floorMaterial} ${floorPrep}.`;

  // Callout — highest scoring non-floor node above threshold.
  const callout = nodeScores
    .filter(n => !n.tags.includes('floor') && n.score >= CALLOUT_THRESHOLD)
    .sort((a, b) => b.score - a.score)[0] ?? null;

  let calloutLine = '';
  if (callout) {
    const struct = callout.tags.find(t => TAGS[t]?.division === 'structural') ?? '';
    const mat    = callout.tags.find(t => TAGS[t]?.division === 'cosmetic') ?? '';
    calloutLine  = `There is a ${mat} ${struct}.`;
  }

  return [ambient, calloutLine].filter(Boolean).join(' ');
}
