// nodes.js
// All nodes live in a single flat array.
// depth: 0 = region, 1 = area/room container, 2 = interior nodes.
// Edges declare a type: 'contains' (parent→child) or 'adjacent' (traversal).

const NODES = [
  // ── Depth 0 — Region ───────────────────────────────────────────────────────
  { id: 'valley',  depth: 0, tags: ['region'] },

  // ── Depth 1 — Area containers ─────────────────────────────────────────────
  { id: 'cottage', depth: 1, tags: ['room'] },

  // ── Depth 2 — Interior nodes ──────────────────────────────────────────────
  { id: 'floor',   depth: 2, tags: ['floor',   'below',   'stone'] },
  { id: 'wall_n',  depth: 2, tags: ['wall',    'lateral', 'wood']  },
  { id: 'wall_e',  depth: 2, tags: ['wall',    'lateral', 'wood']  },
  { id: 'wall_w',  depth: 2, tags: ['wall',    'lateral', 'wood']  },
  { id: 'door',    depth: 2, tags: ['door',    'wood']              },
  { id: 'ceiling', depth: 2, tags: ['ceiling', 'above',   'wood']  },
];

const EDGES = [
  // Containment — hierarchy links.
  { from: 'valley',  to: 'cottage', type: 'contains' },
  { from: 'cottage', to: 'floor',   type: 'contains' },
  { from: 'cottage', to: 'wall_n',  type: 'contains' },
  { from: 'cottage', to: 'wall_e',  type: 'contains' },
  { from: 'cottage', to: 'wall_w',  type: 'contains' },
  { from: 'cottage', to: 'door',    type: 'contains' },
  { from: 'cottage', to: 'ceiling', type: 'contains' },

  // Adjacency — traversal links within the interior.
  { from: 'floor',  to: 'wall_n', type: 'adjacent' },
  { from: 'floor',  to: 'wall_e', type: 'adjacent' },
  { from: 'floor',  to: 'wall_w', type: 'adjacent' },
  { from: 'floor',  to: 'door',   type: 'adjacent' },
  { from: 'wall_n', to: 'wall_e', type: 'adjacent' },
  { from: 'wall_e', to: 'wall_w', type: 'adjacent' },
  { from: 'wall_w', to: 'door',   type: 'adjacent' },
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

// Returns all nodes adjacent to a given node id (undirected).
function getAdjacent(nodeId) {
  return EDGES
    .filter(e => e.type === 'adjacent' && (e.from === nodeId || e.to === nodeId))
    .map(e => NODES.find(n => n.id === (e.from === nodeId ? e.to : e.from)));
}
