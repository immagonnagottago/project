// nodes.js

// Area node — container, sets descriptive register. Not connected by edges.
const AREA = { id: 'area', tags: ['room'] };

// Interior nodes.
const NODES = [
  { id: 0, tags: ['floor',   'below',   'stone'] },
  { id: 1, tags: ['wall',    'lateral', 'wood']  },
  { id: 2, tags: ['wall',    'lateral', 'wood']  },
  { id: 3, tags: ['wall',    'lateral', 'wood']  },
  { id: 4, tags: ['door',    'ahead',   'wood']  },
  { id: 5, tags: ['ceiling', 'above',   'wood']  },
];

// Edges — relational adjacency. Floor is the hub.
// Ceiling is unconnected for now.
const EDGES = [
  [0,1],[0,2],[0,3],[0,4],
  [1,2],[2,3],[3,4],[4,1],
];

// Player's current node id.
let PLAYER_NODE = 0;
