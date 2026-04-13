// perception.js
// describe() is situated — perception is weighted by distance from PLAYER_NODE.
// Nodes closer to the player contribute more strongly to the description.

// Falloff multipliers by graph distance from PLAYER_NODE.
// Distance 0 = player's current node, full weight.
// Nodes beyond distance 2 are below perceptual threshold and ignored.
const FALLOFF = { 0: 1.0, 1: 0.6, 2: 0.3 };

// BFS outward from a node through adjacent edges.
// Returns a Map of { nodeId -> distance } for all reachable nodes
// within the falloff range.
function getDistanceMap(originId) {
  const distances = new Map();
  const queue = [{ id: originId, dist: 0 }];
  distances.set(originId, 0);
  const maxDist = Math.max(...Object.keys(FALLOFF).map(Number));

  while (queue.length) {
    const { id, dist } = queue.shift();
    if (dist >= maxDist) continue;

    for (const neighbor of getAdjacent(id)) {
      if (!distances.has(neighbor.id)) {
        distances.set(neighbor.id, dist + 1);
        queue.push({ id: neighbor.id, dist: dist + 1 });
      }
    }
  }

  return distances;
}

function scoreNodes(nodes, distanceMap) {
  const counts = {};

  // Weight tag counts by falloff so distant nodes contribute less.
  for (const node of nodes) {
    const dist    = distanceMap.get(node.id) ?? null;
    const falloff = dist !== null ? (FALLOFF[dist] ?? 0) : 1.0;
    if (falloff === 0) continue;

    for (const tag of node.tags)
      counts[tag] = (counts[tag] || 0) + falloff;
  }

  const total = nodes.length;
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

  const nodeScores = nodes.map(node => {
    const dist    = distanceMap.get(node.id) ?? null;
    const falloff = dist !== null ? (FALLOFF[dist] ?? 0) : 1.0;
    return {
      ...node,
      falloff,
      score: node.tags.reduce((sum, t) => sum + (tagScores[t] ?? 0), 0) * falloff,
    };
  });

  return { tagScores, nodeScores };
}

function describe() {
  // Find the player's current node.
  const playerNode = NODES.find(n => n.id === PLAYER_NODE);

  // Walk up to the immediate container (depth 1 — the room/area).
  const container = getContainer(PLAYER_NODE);

  // The scale tag on the container sets the descriptive register.
  const scaleTag = container?.tags.find(t => TAGS[t]?.division === 'scale') ?? 'room';

  // Gather the sibling interior nodes (same container, depth 2).
  const interiorNodes = container ? getChildren(container.id) : [playerNode];

  // Build distance map from player's position through adjacent edges.
  const distanceMap = getDistanceMap(PLAYER_NODE);

  const { tagScores, nodeScores } = scoreNodes(interiorNodes, distanceMap);

  // Top cosmetic tag overall — dominant material.
  const topMaterial = Object.keys(tagScores)
    .filter(t => TAGS[t]?.division === 'cosmetic')
    .sort((a, b) => tagScores[b] - tagScores[a])[0] ?? '';

  // Floor node — provides underfoot material and relational prep.
  const floorNode = interiorNodes.find(n => n.tags.includes('floor'));
  const floorMaterial   = floorNode?.tags.find(t => TAGS[t]?.division === 'cosmetic') ?? '';
  const floorRelational = floorNode?.tags.find(t => TAGS[t]?.division === 'relational') ?? '';

  const PREP = { below: 'underfoot', above: 'overhead', lateral: 'around you' };
  const floorPrep = PREP[floorRelational] ?? '';

  // Ambient line.
  const ambient = `A ${topMaterial} ${scaleTag}, ${floorMaterial} ${floorPrep}.`;

  // Callout — highest scoring non-floor node above threshold, weighted by distance.
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
