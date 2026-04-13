// nodes.js
// Defines all nodes and their relational edges.
// Tags are purely cosmetic — what can be seen or visually perceived.

const NODES = [
  { id: 0, tags: ['wood', 'floor'] },
  { id: 1, tags: ['wood', 'floor', 'worn'] },
  { id: 2, tags: ['wood', 'floor', 'stained', 'dark'] },
  { id: 3, tags: ['wood', 'floor', 'cracked', 'splintered'] },
  { id: 4, tags: ['wood', 'floor', 'scorched'] },
  { id: 5, tags: ['stone', 'floor', 'mossy'] },
  { id: 6, tags: ['stone', 'floor', 'worn'] },
  { id: 7, tags: ['stone', 'floor', 'cracked'] },
  { id: 8, tags: ['dirt', 'floor', 'dark'] },
  { id: 9, tags: ['dirt', 'floor', 'mossy'] },
  { id: 10, tags: ['stone', 'wall', 'worn'] },
  { id: 11, tags: ['stone', 'wall', 'mossy', 'dark'] },
  { id: 12, tags: ['stone', 'wall', 'cracked'] },
  { id: 13, tags: ['wood', 'door', 'worn'] },
];

// Edges — relational proximity, not necessarily traversable.
const EDGES = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],
  [0,4],[1,4],[0,8],[8,9],[9,1],[4,7],[2,9],
  [0,10],[2,10],[4,11],[6,11],[8,12],[9,12],[3,13],[7,13],
];

// Player's current node (by id).
let PLAYER_NODE = 0;
