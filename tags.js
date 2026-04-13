// tags.js
// Divisions: 'structural', 'cosmetic', 'relational' — more may be added later.

const TAGS = {

  // ── Structural ─────────────────────────────────────────────────────────────
  door:    { division: 'structural', priority: 4 },
  wall:    { division: 'structural', priority: 3 },
  floor:   { division: 'structural', priority: 2 },
  ceiling: { division: 'structural', priority: 1 },

  // ── Relational ─────────────────────────────────────────────────────────────
  // Describes the node's position from the player's perspective when at that node.
  lateral: { division: 'relational' },
  below:   { division: 'relational' },
  above:   { division: 'relational' },
  ahead:   { division: 'relational' },

  // ── Cosmetic ───────────────────────────────────────────────────────────────
  wood:  { division: 'cosmetic', prominence: 0.2 },
  stone: { division: 'cosmetic', prominence: 0.3 },

  // ── Area ───────────────────────────────────────────────────────────────────
  // Container node tags. Set the descriptive register.
  room: { division: 'area' },

};

const DIVISION_BONUS = {
  structural: 1.0,
  relational: 0.0,
  cosmetic:   0.0,
  area:       0.0,
};

// Score threshold above which a node earns a callout in the description.
const CALLOUT_THRESHOLD = 4.5;
