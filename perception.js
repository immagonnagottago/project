// perception.js
// Scores tags by prominence, majority, and distance from player.
// Assembles a description from the highest-scoring tags.

function perceive() {
  const counts = {};

  for (const node of NODES)
    for (const tag of node.tags)
      counts[tag] = (counts[tag] || 0) + 1;

  const total = NODES.length;

  // Tag score = prominence + majority.
  const tagScores = {};
  for (const tag of Object.keys(counts))
    tagScores[tag] = (PROMINENCE[tag] ?? 0.5) + counts[tag] / total;

  return { tagScores, counts };
}

function topTag(tagScores, category) {
  return CATEGORIES[category]
    .filter(t => tagScores[t] !== undefined)
    .sort((a, b) => tagScores[b] - tagScores[a])[0] ?? null;
}

function describe() {
  const { tagScores } = perceive();
  const material  = topTag(tagScores, 'material');
  const surface   = topTag(tagScores, 'surface');
  const condition = topTag(tagScores, 'condition');
  const quality   = topTag(tagScores, 'quality');

  const parts  = [material, condition, surface].filter(Boolean);
  const suffix = quality ? `, ${quality}` : '';
  return `The ${parts.join(' ')}${suffix}.`;
}
