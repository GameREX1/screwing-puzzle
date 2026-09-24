export type ColorId = string;

export interface Nut {
  id: string;
  color: ColorId;
}

export interface Bolt {
  id: string;
  nuts: Nut[];
  capacity: number;
}

export interface Level {
  id: number;
  name: string;
  bolts: Bolt[];
  emptyBolts: number;
}

export interface GameState {
  level: number;
  bolts: Bolt[];
  selectedBolt: number | null;
  moves: number;
  history: Bolt[][];
  status: 'playing' | 'won';
  capacity: number;
}

export interface LevelProgress {
  completed: boolean;
  stars: number;
  bestMoves: number | null;
}
