// tags.js
// Divisions: 'structural', 'cosmetic', 'relational', 'scale'
const TAGS = {
  // ── Structural ─────────────────────────────────────────────────────────────
  door:    { division: 'structural', priority: 4 },
  wall:    { division: 'structural', priority: 3 },
  floor:   { division: 'structural', priority: 2 },
  ceiling: { division: 'structural', priority: 1 },
  stair:   { division: 'structural', priority: 3 },
  // ── Relational ─────────────────────────────────────────────────────────────
  lateral: { division: 'relational' },
  below:   { division: 'relational' },
  above:   { division: 'relational' },
  // ── Cosmetic ───────────────────────────────────────────────────────────────
  wood:  { division: 'cosmetic', prominence: 0.2 },
  stone: { division: 'cosmetic', prominence: 0.3 },
  // ── Scale ──────────────────────────────────────────────────────────────────
  room:   { division: 'scale' },
  area:   { division: 'scale' },
  region: { division: 'scale' },
};

const DIVISION_BONUS = {
  structural: 1.0,
  relational: 0.0,
  cosmetic:   0.0,
  scale:      0.0,
};

const CALLOUT_THRESHOLD = 2.0;
