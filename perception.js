// perception.js

function perceive() {
  const counts = {};

  for (const node of NODES)
    for (const tag of node.tags)
      counts[tag] = (counts[tag] || 0) + 1;

  const total = NODES.length;

  const tagScores = {};
  for (const tag of Object.keys(counts)) {
    const def     = TAGS[tag] ?? { division: 'cosmetic', prominence: 0.5 };
    const divBonus = DIVISION_BONUS[def.division] ?? 0;
    const intrinsic = def.division === 'structural' ? def.priority : def.prominence;
    const majority  = counts[tag] / total;
    tagScores[tag]  = divBonus + intrinsic + majority;
  }

  return { tagScores, counts };
}

function describe() {
  const { tagScores } = perceive();

  const structural = Object.keys(tagScores)
    .filter(t => TAGS[t]?.division === 'structural')
    .sort((a, b) => tagScores[b] - tagScores[a]);

  const cosmetic = Object.keys(tagScores)
    .filter(t => TAGS[t]?.division === 'cosmetic')
    .sort((a, b) => tagScores[b] - tagScores[a]);

  const primary   = structural[0] ?? null;   // e.g. door
  const secondary = cosmetic[0]   ?? null;   // e.g. wood
  const mention   = cosmetic[1]   ?? null;   // honorable mention e.g. stone

  const parts = [secondary, primary].filter(Boolean);
  const suffix = mention ? `, with ${mention}` : '';
  return `A ${parts.join(' ')}${suffix}.`;
}
