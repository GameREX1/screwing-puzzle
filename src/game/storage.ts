import type { LevelProgress } from './types';
import { TOTAL_LEVELS } from './levels';

const KEY = 'nut-bolt-progress';

export function loadProgress(): Record<number, LevelProgress> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveProgress(levelId: number, stars: number, moves: number): void {
  const progress = loadProgress();
  const existing = progress[levelId];
  if (!existing || stars > existing.stars) {
    progress[levelId] = { completed: true, stars, bestMoves: moves };
  } else if (stars === existing.stars && moves < (existing.bestMoves ?? Infinity)) {
    progress[levelId].bestMoves = moves;
  }
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function isLevelUnlocked(levelId: number): boolean {
  if (levelId === 1) return true;
  const progress = loadProgress();
  return !!progress[levelId - 1]?.completed;
}

export function getUnlockedCount(): number {
  const progress = loadProgress();
  let count = 1;
  for (let i = 2; i <= TOTAL_LEVELS; i++) {
    if (progress[i - 1]?.completed) count++;
    else break;
  }
  return count;
}
