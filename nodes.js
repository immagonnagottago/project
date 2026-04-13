// nodes.js

const NODES = [
  { id: 0, tags: ['floor',   'stone'] },
  { id: 1, tags: ['wall',    'wood']  },
  { id: 2, tags: ['wall',    'wood']  },
  { id: 3, tags: ['wall',    'wood']  },
  { id: 4, tags: ['door',    'wood']  },
  { id: 5, tags: ['ceiling', 'wood']  },
];

// Edges — relational adjacency, not traversal.
// Floor connects to everything. Walls/door connect to floor and neighbours.
// Ceiling is unconnected for now.
const EDGES = [
  [0,1],[0,2],[0,3],[0,4],  // floor to all sides
  [1,2],[2,3],[3,4],[4,1],  // walls and door around the perimeter
];
