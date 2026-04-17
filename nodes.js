// nodes.js
// Geometry model:
//   - Horizontal adjacency (same z) is IMPLICIT — two nodes are adjacent
//     if they share a container and their xy distance is exactly 1 step.
//   - Vertical adjacency (z change) is EXPLICIT — requires a 'vertical' edge.
//   - Non-euclidean connections use 'special' edges, ignoring geometry.
//
// Edge types:
//   'contains'  — hierarchy: parent → child
//   'vertical'  — traversal across z levels (stairs, ladders, etc.)
//   'special'   — non-euclidean traversal

const NODES = [
  // ── Depth 0 — Region ───────────────────────────────────────────────────────
  { id: 'valley',  depth: 0, tags: ['region'] },

  // ── Depth 1 — Area containers ─────────────────────────────────────────────
  { id: 'cottage', depth: 1, tags: ['room'] },

  // ── Depth 2 — Interior nodes ──────────────────────────────────────────────
  // z0 = floor level, z1 = standing/wall level, z2 = ceiling level.
  //
  //   z2:  [ ceiling             ]
  //   z1:  [ wall_w ][ wall_e ][ door ]
  //   z0:  [ floor              ]

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
  // None yet. Example:
  // { from: 'floor', to: 'loft_floor', type: 'vertical' },
];

// Player's current node id.
let PLAYER_NODE = 'floor';

// ── Helpers ────────────────────────────────────────────────────────────────

function getContainer(nodeId) {
  const edge = EDGES.find(e => e.to === nodeId && e.type === 'contains');
  return edge ? NODES.find(n => n.id === edge.from) : null;
}

function getChildren(nodeId) {
  return EDGES
    .filter(e => e.from === nodeId && e.type === 'contains')
    .map(e => NODES.find(n => n.id === e.to));
}

function xyDistance(a, b) {
  if (a.x == null || b.x == null) return Infinity;
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function zDistance(a, b) {
  if (a.z == null || b.z == null) return Infinity;
  return Math.abs(a.z - b.z);
}

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
