// nodes.js
// Geometry model:
//   - Nodes at the same depth MAY have { x, y, z } coordinates.
//   - Horizontal adjacency (same z) is IMPLICIT — no edge needed.
//     Two nodes are horizontally adjacent if they share a container,
//     have coordinates, and their x/y distance is exactly 1 step.
//   - Vertical adjacency (z change) is EXPLICIT — requires an edge.
//     You need a stair, ladder, trapdoor, etc. to move between z levels.
//   - Non-euclidean connections are also explicit edges, ignoring geometry.
//
// Edge types:
//   'contains'  — hierarchy: parent → child (depth n → depth n+1)
//   'vertical'  — traversal: connects nodes across z levels (requires stair etc.)
//   'special'   — traversal: non-euclidean, ignores lattice geometry entirely

const NODES = [
  // ── Depth 0 — Region ───────────────────────────────────────────────────────
  { id: 'valley',  depth: 0, tags: ['region'] },

  // ── Depth 1 — Area containers ─────────────────────────────────────────────
  { id: 'cottage', depth: 1, tags: ['room'] },

  // ── Depth 2 — Interior nodes ──────────────────────────────────────────────
  // Positioned on a small 3x1 lattice.
  // z0 = floor level, z1 = standing/wall level, z2 = ceiling level.
  //
  //   z2:  [ ceiling         ]
  //   z1:  [ wall_w ][ wall_e ][ door ]
  //   z0:  [ floor           ]
  //
  // x,y place nodes on the horizontal plane.
  // Walls and door share z1; floor is z0; ceiling is z2.

  { id: 'floor',   depth: 2, tags: ['floor',   'below',   'stone'], x: 1, y: 1, z: 0 },
  { id: 'wall_w',  depth: 2, tags: ['wall',    'lateral', 'wood'],  x: 0, y: 1, z: 1 },
  { id: 'wall_e',  depth: 2, tags: ['wall',    'lateral', 'wood'],  x: 2, y: 1, z: 1 },
  { id: 'door',    depth: 2, tags: ['door',               'wood'],  x: 1, y: 2, z: 1 },
  { id: 'ceiling', depth: 2, tags: ['ceiling', 'above',   'wood'],  x: 1, y: 1, z: 2 },
];

const EDGES = [
  // ── Containment ────────────────────────────────────────────────────────────
  { from: 'valley',  to: 'cottage', type: 'contains' },
  { from: 'cottage', to: 'floor',   type: 'contains' },
  { from: 'cottage', to: 'wall_w',  type: 'contains' },
  { from: 'cottage', to: 'wall_e',  type: 'contains' },
  { from: 'cottage', to: 'door',    type: 'contains' },
  { from: 'cottage', to: 'ceiling', type: 'contains' },

  // ── Vertical traversal ─────────────────────────────────────────────────────
  // None yet — no stairs in this space.
  // Example of how one would look:
  // { from: 'floor', to: 'loft_floor', type: 'vertical' },
];

// Player's current node id.
let PLAYER_NODE = 'floor';

// ── Helpers ────────────────────────────────────────────────────────────────

// Returns the immediate container (depth - 1) of a given node id.
function getContainer(nodeId) {
  const edge = EDGES.find(e => e.to === nodeId && e.type === 'contains');
  return edge ? NODES.find(n => n.id === edge.from) : null;
}

// Returns all nodes directly contained by a given node id.
function getChildren(nodeId) {
  return EDGES
    .filter(e => e.from === nodeId && e.type === 'contains')
    .map(e => NODES.find(n => n.id === e.to));
}

// Returns the horizontal step distance between two nodes (ignoring z).
// Returns Infinity if either node lacks coordinates.
function xyDistance(a, b) {
  if (a.x == null || b.x == null) return Infinity;
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Returns the vertical distance between two nodes.
// Returns Infinity if either node lacks coordinates.
function zDistance(a, b) {
  if (a.z == null || b.z == null) return Infinity;
  return Math.abs(a.z - b.z);
}

// Returns all nodes adjacent to a given node id.
// Adjacency is:
//   - IMPLICIT for same-z nodes in the same container within 1 xy step.
//   - EXPLICIT for vertical and special edges regardless of geometry.
function getAdjacent(nodeId) {
  const node      = NODES.find(n => n.id === nodeId);
  const container = getContainer(nodeId);
  const siblings  = container ? getChildren(container.id) : [];
  const results   = new Map();

  // Implicit horizontal neighbors — same z, xy distance exactly 1.
  for (const sibling of siblings) {
    if (sibling.id === nodeId) continue;
    if (sibling.z === node.z && xyDistance(node, sibling) === 1) {
      results.set(sibling.id, sibling);
    }
  }

  // Explicit vertical and special edges (undirected).
  for (const edge of EDGES) {
    if (edge.type === 'contains') continue;
    if (edge.from === nodeId) {
      const target = NODES.find(n => n.id === edge.to);
      if (target) results.set(target.id, target);
    }
    if (edge.to === nodeId) {
      const target = NODES.find(n => n.id === edge.from);
      if (target) results.set(target.id, target);
    }
  }

  return [...results.values()];
}

// Returns the z distance between a node and the player's current node.
// Used by perception to apply vertical falloff separately from horizontal.
function zDistanceFromPlayer(nodeId) {
  const player = NODES.find(n => n.id === PLAYER_NODE);
  const target = NODES.find(n => n.id === nodeId);
  return zDistance(player, target);
}
