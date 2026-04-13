// tags.js
// Defines all known tags, their visual prominence, and descriptor categories.

const PROMINENCE = {
  door:       1.0,  // always draws the eye
  scorched:   0.95,
  cracked:    0.9,
  splintered: 0.85,
  mossy:      0.8,
  stained:    0.75,
  dark:       0.6,
  worn:       0.4,
  dirt:       0.35,
  stone:      0.3,
  wood:       0.2,
  wall:       0.15,
  floor:      0.1,
};

const CATEGORIES = {
  material:  ['wood', 'stone', 'dirt'],
  surface:   ['floor', 'wall', 'door', 'ceiling'],
  condition: ['cracked', 'splintered', 'worn', 'stained', 'scorched', 'mossy'],
  quality:   ['dark'],
};
