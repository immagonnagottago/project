// perception.js

function scoreNodes() {
  const counts = {};

  for (const node of NODES)
    for (const tag of node.tags)
      counts[tag] = (counts[tag] || 0) + 1;

  const total = NODES.length;

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

  const nodeScores = NODES.map(node => ({
    ...node,
    score: node.tags.reduce((sum, t) => sum + (tagScores[t] ?? 0), 0),
  }));

  return { tagScores, nodeScores };
}

function describe() {
  const { tagScores, nodeScores } = scoreNodes();
  const area = AREA.tags[0]; // e.g. 'room'

  // Top cosmetic tag overall — defines the dominant material.
  const topMaterial = Object.keys(tagScores)
    .filter(t => TAGS[t]?.division === 'cosmetic')
    .sort((a, b) => tagScores[b] - tagScores[a])[0] ?? '';

  // Floor node — provides the positional/material for the second slot.
  const floorNode = NODES.find(n => n.tags.includes('floor'));
  const floorMaterial = floorNode?.tags.find(t => TAGS[t]?.division === 'cosmetic') ?? '';
  const floorRelational = floorNode?.tags.find(t => TAGS[t]?.division === 'relational') ?? '';

  // Relational tag → preposition phrase.
  const PREP = { below: 'underfoot', above: 'overhead', lateral: 'around you', ahead: 'ahead' };
  const floorPrep = PREP[floorRelational] ?? '';

  // Ambient line.
  const ambient = `A ${topMaterial} ${area}, ${floorMaterial} ${floorPrep}.`;

  // Callout — highest scoring node that clears the threshold, excluding floor.
  const callout = nodeScores
    .filter(n => !n.tags.includes('floor') && n.score >= CALLOUT_THRESHOLD)
    .sort((a, b) => b.score - a.score)[0] ?? null;

  let calloutLine = '';
  if (callout) {
    const struct = callout.tags.find(t => TAGS[t]?.division === 'structural') ?? '';
    const mat    = callout.tags.find(t => TAGS[t]?.division === 'cosmetic') ?? '';
    const rel    = callout.tags.find(t => TAGS[t]?.division === 'relational') ?? '';
    const prep   = PREP[rel] ?? '';
    calloutLine  = `There is a ${mat} ${struct}${prep ? ' ' + prep : ''}.`;
  }

  return [ambient, calloutLine].filter(Boolean).join(' ');
}
