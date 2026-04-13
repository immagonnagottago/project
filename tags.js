// tags.js
// Divisions: 'structural', 'cosmetic', 'relational', 'scale'
const TAGS = {
  // ── Structural ─────────────────────────────────────────────────────────────
  door:    { division: 'structural', priority: 4 },
  wall:    { division: 'structural', priority: 3 },
  floor:   { division: 'structural', priority: 2 },
  ceiling: { division: 'structural', priority: 1 },
  stair:   { division: 'structural', priority: 3 },  // vertical traversal node
  // ── Relational ─────────────────────────────────────────────────────────────
  // Intrinsic to the node — describes position relative to an occupant.
  lateral: { division: 'relational' },
  below:   { division: 'relational' },
  above:   { division: 'relational' },
  // ── Cosmetic ───────────────────────────────────────────────────────────────
  wood:  { division: 'cosmetic', prominence: 0.2 },
  stone: { division: 'cosmetic', prominence: 0.3 },
  // ── Scale ──────────────────────────────────────────────────────────────────
  // Container node tags — set the descriptive register at each depth level.
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

// Score threshold above which a node earns a callout in the description.
const CALLOUT_THRESHOLD = 4.5;
