// perception.js
// describe() is now situated — it reads the player's current container
// via the edge graph rather than a hardcoded AREA singleton.

function scoreNodes(nodes) {
  const counts = {};
  for (const node of nodes)
    for (const tag of node.tags)
      counts[tag] = (counts[tag] || 0) + 1;

  const total = nodes.length;
  const tagScores = {};

  for (const tag of Object.keys(counts)) {
    const def      = TAGS[tag] ?? { division: 'cosmetic', prominence: 0.5 };
    const divBonus = DIVISION_BONUS[def.division] ?? 0;
    const intrinsic = def.division === 'structural' ? (def.priority ?? 0)
                    : def.division === 'cosmetic'   ? (def.prominence ?? 0.5)
                    : 0;
    const majority = counts[tag] / total;
    tagScores[tag] = divBonus + intrinsic + majority;
  }

  const nodeScores = nodes.map(node => ({
    ...node,
    score: node.tags.reduce((sum, t) => sum + (tagScores[t] ?? 0), 0),
  }));

  return { tagScores, nodeScores };
}

function describe() {
  // Find the player's current node.
  const playerNode = NODES.find(n => n.id === PLAYER_NODE);

  // Walk up to the immediate container (depth 1 — the room/area).
  const container = getContainer(PLAYER_NODE);

  // The scale tag on the container sets the descriptive register.
  const scalTag = container?.tags.find(t => TAGS[t]?.division === 'scale') ?? 'room';

  // Gather the sibling interior nodes (same container, depth 2).
  const interiorNodes = container ? getChildren(container.id) : [playerNode];

  const { tagScores, nodeScores } = scoreNodes(interiorNodes);

  // Top cosmetic tag overall — dominant material.
  const topMaterial = Object.keys(tagScores)
    .filter(t => TAGS[t]?.division === 'cosmetic')
    .sort((a, b) => tagScores[b] - tagScores[a])[0] ?? '';

  // Floor node — provides underfoot material and relational prep.
  const floorNode = interiorNodes.find(n => n.tags.includes('floor'));
  const floorMaterial  = floorNode?.tags.find(t => TAGS[t]?.division === 'cosmetic') ?? '';
  const floorRelational = floorNode?.tags.find(t => TAGS[t]?.division === 'relational') ?? '';

  const PREP = { below: 'underfoot', above: 'overhead', lateral: 'around you' };
  const floorPrep = PREP[floorRelational] ?? '';

  // Ambient line.
  const ambient = `A ${topMaterial} ${scalTag}, ${floorMaterial} ${floorPrep}.`;

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
