import type { Bolt, ColorId, GameState, Level } from './types';

export function createBolt(id: string, colors: ColorId[], capacity: number): Bolt {
  return {
    id,
    capacity,
    nuts: colors.map((c, i) => ({ id: `${id}-${i}-${c}`, color: c })),
  };
}

export function isComplete(bolt: Bolt): boolean {
  if (bolt.nuts.length === 0) return false;
  if (bolt.nuts.length !== bolt.capacity) return false;
  const first = bolt.nuts[0].color;
  return bolt.nuts.every((n) => n.color === first);
}

export function isWon(bolts: Bolt[]): boolean {
  return bolts.every((b) => isComplete(b) || b.nuts.length === 0);
}

export function canMove(from: Bolt, to: Bolt): boolean {
  if (from.nuts.length === 0) return false;
  if (to.nuts.length >= to.capacity) return false;
  if (to.nuts.length === 0) return true;
  return to.nuts[to.nuts.length - 1].color === from.nuts[from.nuts.length - 1].color;
}

export function applyMove(bolts: Bolt[], fromIdx: number, toIdx: number): Bolt[] {
  const next = bolts.map((b) => ({ ...b, nuts: [...b.nuts] }));
  const nut = next[fromIdx].nuts.pop()!;
  next[toIdx].nuts.push(nut);
  return next;
}

export function countTopGroup(bolt: Bolt): number {
  if (bolt.nuts.length === 0) return 0;
  const top = bolt.nuts[bolt.nuts.length - 1].color;
  let count = 0;
  for (let i = bolt.nuts.length - 1; i >= 0; i--) {
    if (bolt.nuts[i].color !== top) break;
    count++;
  }
  return count;
}

export function applyMultiMove(bolts: Bolt[], fromIdx: number, toIdx: number): Bolt[] {
  const from = bolts[fromIdx];
  const to = bolts[toIdx];
  if (!canMove(from, to)) return bolts;
  const groupSize = countTopGroup(from);
  const space = to.capacity - to.nuts.length;
  const moveCount = Math.min(groupSize, space);
  const next = bolts.map((b) => ({ ...b, nuts: [...b.nuts] }));
  for (let i = 0; i < moveCount; i++) {
    const nut = next[fromIdx].nuts.pop()!;
    next[toIdx].nuts.push(nut);
  }
  return next;
}

export function cloneBolts(bolts: Bolt[]): Bolt[] {
  return bolts.map((b) => ({ ...b, nuts: [...b.nuts] }));
}

export function initGameState(level: Level): GameState {
  return {
    level: level.id,
    bolts: cloneBolts(level.bolts),
    selectedBolt: null,
    moves: 0,
    history: [],
    status: 'playing',
    capacity: level.bolts[0]?.capacity ?? 4,
  };
}

export function getStars(moves: number, par: number): number {
  if (moves <= par) return 3;
  if (moves <= Math.ceil(par * 1.5)) return 2;
  return 1;
}
