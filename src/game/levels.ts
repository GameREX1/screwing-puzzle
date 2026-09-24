import type { Level } from './types';
import { createBolt } from './logic';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeLevel(
  id: number,
  name: string,
  colorSets: ColorId[][],
  capacity: number,
  emptyBolts: number,
): Level {
  const bolts = colorSets.map((colors, i) => createBolt(`b${i}`, colors, capacity));
  for (let i = 0; i < emptyBolts; i++) {
    bolts.push(createBolt(`e${i}`, [], capacity));
  }
  return { id, name, bolts, emptyBolts };
}

type ColorId = string;

const C = {
  R: 'red', B: 'blue', G: 'green', Y: 'yellow', P: 'purple', O: 'orange',
  K: 'pink', N: 'cyan', L: 'lime', T: 'teal',
};

// Each sub-array is one bolt's nuts (bottom-first). capacity = 4.
export const LEVELS: Level[] = [
  // 1
  makeLevel(1, 'First Steps', [
    [C.R, C.B], [C.B, C.R],
  ], 4, 1),
  // 2
  makeLevel(2, 'Triple Threat', [
    [C.R, C.B, C.G], [C.G, C.R, C.B],
  ], 4, 1),
  // 3
  makeLevel(3, 'Four Colors', [
    [C.R, C.B, C.G, C.Y], [C.Y, C.G, C.R, C.B],
  ], 4, 2),
  // 4
  makeLevel(4, 'Full House', [
    [C.R, C.B, C.G, C.Y], [C.B, C.Y, C.R, C.G],
  ], 4, 2),
  // 5
  makeLevel(5, 'Six Pack', [
    [C.R, C.B, C.G, C.Y], [C.G, C.Y, C.R, C.B], [C.B, C.R, C.Y, C.G],
  ], 4, 2),
  // 6
  makeLevel(6, 'Seven Up', [
    [C.R, C.B, C.G, C.Y], [C.G, C.Y, C.R, C.B], [C.B, C.R, C.Y, C.G],
  ], 4, 2),
  // 7
  makeLevel(7, 'Octopus', [
    [C.R, C.B, C.G, C.Y], [C.G, C.Y, C.R, C.B], [C.B, C.R, C.Y, C.G], [C.Y, C.G, C.B, C.R],
  ], 4, 2),
  // 8
  makeLevel(8, 'Rainbow', [
    [C.R, C.B, C.G, C.Y], [C.G, C.Y, C.R, C.B], [C.B, C.R, C.Y, C.G], [C.Y, C.G, C.B, C.R],
  ], 4, 2),
  // 9
  makeLevel(9, 'Ten Color', [
    [C.R, C.B, C.G, C.Y], [C.G, C.Y, C.R, C.B], [C.B, C.R, C.Y, C.G], [C.Y, C.G, C.B, C.R],
    [C.P, C.O, C.P, C.O],
  ], 4, 2),
  // 10
  makeLevel(10, 'Master', [
    [C.R, C.B, C.G, C.Y], [C.G, C.Y, C.R, C.B], [C.B, C.R, C.Y, C.G], [C.Y, C.G, C.B, C.R],
    [C.P, C.O, C.K, C.N], [C.K, C.N, C.P, C.O],
  ], 4, 2),
];

export function getLevel(id: number): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}

export const TOTAL_LEVELS = LEVELS.length;

// Par scores (target moves for 3 stars)
export const PAR: Record<number, number> = {
  1: 2, 2: 4, 3: 8, 4: 10, 5: 18, 6: 20, 7: 24, 8: 28, 9: 34, 10: 40,
};

export function getPar(levelId: number): number {
  return PAR[levelId] ?? levelId * 3;
}
