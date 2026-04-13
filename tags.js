// tags.js
// Each tag declares its division, and division-specific properties.
// Divisions: 'structural', 'cosmetic' — more may be added later.

const TAGS = {

  // ── Structural ─────────────────────────────────────────────────────────────
  // priority: baseline score contribution. Anchors description before other factors.

  door:    { division: 'structural', priority: 4 },
  wall:    { division: 'structural', priority: 3 },
  floor:   { division: 'structural', priority: 2 },
  ceiling: { division: 'structural', priority: 1 },

  // ── Cosmetic ───────────────────────────────────────────────────────────────
  // prominence: how much the eye is drawn to it.

  wood:  { division: 'cosmetic', prominence: 0.2 },
  stone: { division: 'cosmetic', prominence: 0.3 },

};

// Class-level bonus applied to all tags of a division.
// Structural always nudges above cosmetic.
const DIVISION_BONUS = {
  structural: 1.0,
  cosmetic:   0.0,
};
