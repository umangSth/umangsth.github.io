

export interface Pattern {
    width: number;
    height: number;
    data: number[];
}

export interface Patterns {
    [key: string]: Pattern;
}


export const patterns_data: Patterns = {
  glider: {
    width: 3,
    height: 3,
    data: [0, 1, 1, 2, 2, 0, 2, 1, 2, 2],
  },
  simpleStillLifeBlock: {
    width: 2,
    height: 2,
    data: [0, 0, 0, 1, 1, 0, 1, 1],
  },
  simpleOscillatorBlinker: {
    width: 1,
    height: 3,
    data: [0, 0, 1, 0, 2, 0], // Vertical
  },
  toad: {
    width: 4,
    height: 2,
    data: [1, 0, 2, 0, 0, 1, 1, 1, 2, 1],
  },
  beacon: {
    width: 4,
    height: 4,
    data: [0, 0, 0, 1, 1, 0, 1, 1, 2, 2, 2, 3, 3, 2, 3, 3],
  },
  pulsar: {
    width: 15,
    height: 15,
    data: [
      2, 0, 2, 1, 2, 2, 6, 2, 7, 2, 8, 2, 2, 4, 7, 4, 9, 4,
      0, 5, 2, 5, 3, 5, 6, 5, 7, 5, 9, 5, 12, 5, 14, 5,
      2, 6, 7, 6, 9, 6, 2, 7, 7, 7, 9, 7, 2, 8, 7, 8, 9, 8,
      2, 9, 7, 9, 9, 9, 6, 10, 7, 10, 8, 10, 2, 11, 7, 11, 9, 11,
      0, 12, 2, 12, 3, 12, 6, 12, 7, 12, 9, 12, 12, 12, 14, 12,
      2, 13, 2, 14, 6, 14, 7, 14, 8, 14,
    ],
  },
  lwss: { // Lightweight Spaceship
    width: 5,
    height: 4,
    data: [0, 1, 1, 0, 1, 1, 2, 0, 2, 2, 3, 1, 3, 2, 3, 3],
  },
  mwss: { // Middleweight Spaceship
    width: 6,
    height: 4,
    data: [1, 0, 2, 1, 0, 2, 2, 2, 3, 2, 4, 2, 4, 3, 5, 2],
  },
  hwss: { // Heavyweight Spaceship
    width: 7,
    height: 4,
    data: [1, 0, 2, 1, 0, 2, 2, 2, 3, 2, 4, 2, 5, 3, 6, 2],
  },
  acorn: {
    width: 7,
    height: 3,
    data: [1, 0, 3, 1, 0, 2, 1, 2, 5, 2, 6, 2],
  },
  rPentomino: {
    width: 3,
    height: 3,
    data: [0, 1, 1, 0, 1, 1, 2, 0, 2, 1],
  },
};