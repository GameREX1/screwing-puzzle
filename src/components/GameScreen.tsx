import { useCallback, useEffect, useMemo, useState } from 'react';
import { RotateCcw, ArrowLeft, Lightbulb, X } from 'lucide-react';
import { Bolt } from './Bolt';
import { getColor } from '@/game/colors';
import {
  applyMultiMove, canMove, cloneBolts, getStars, initGameState, isComplete, isWon,
} from '@/game/logic';
import { getLevel, getPar } from '@/game/levels';
import { saveProgress } from '@/game/storage';
import { playInvalid, playMove, playSelect, playWin } from '@/game/sound';
import type { GameState } from '@/game/types';

interface GameScreenProps {
  levelId: number;
  onExit: () => void;
  onNext: () => void;
  onReplay: () => void;
}

export function GameScreen({ levelId, onExit, onNext, onReplay }: GameScreenProps) {
  const level = useMemo(() => getLevel(levelId)!, [levelId]);
  const [state, setState] = useState<GameState>(() => initGameState(level));
  const [hoveredBolt, setHoveredBolt] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [won, setWon] = useState(false);

  const par = getPar(levelId);

  useEffect(() => {
    setState(initGameState(level));
    setWon(false);
    setShowHint(false);
  }, [level]);

  const handleBoltClick = useCallback((idx: number) => {
    if (won) return;
    setState((prev) => {
      if (prev.selectedBolt === null) {
        if (prev.bolts[idx].nuts.length === 0) return prev;
        playSelect();
        return { ...prev, selectedBolt: idx };
      }
      if (prev.selectedBolt === idx) {
        return { ...prev, selectedBolt: null };
      }
      const from = prev.bolts[prev.selectedBolt];
      const to = prev.bolts[idx];
      if (!canMove(from, to)) {
        playInvalid();
        return { ...prev, selectedBolt: idx };
      }
      const newBolts = applyMultiMove(prev.bolts, prev.selectedBolt, idx);
      playMove();
      const won = isWon(newBolts);
      if (won) {
        const stars = getStars(prev.moves + 1, par);
        saveProgress(levelId, stars, prev.moves + 1);
        playWin();
        setTimeout(() => setWon(true), 400);
      }
      return {
        ...prev,
        bolts: newBolts,
        selectedBolt: null,
        moves: prev.moves + 1,
        history: [...prev.history, cloneBolts(prev.bolts)],
        status: won ? 'won' : 'playing',
      };
    });
  }, [won, levelId, par]);

  const handleUndo = useCallback(() => {
    setState((prev) => {
      if (prev.history.length === 0) return prev;
      const last = prev.history[prev.history.length - 1];
      return {
        ...prev,
        bolts: last,
        history: prev.history.slice(0, -1),
        moves: Math.max(0, prev.moves - 1),
        selectedBolt: null,
        status: 'playing',
      };
    });
    setWon(false);
  }, []);

  const handleReset = useCallback(() => {
    setState(initGameState(level));
    setWon(false);
    setShowHint(false);
  }, [level]);

  const findHint = useCallback((): [number, number] | null => {
    for (let i = 0; i < state.bolts.length; i++) {
      for (let j = 0; j < state.bolts.length; j++) {
        if (i === j) continue;
        if (canMove(state.bolts[i], state.bolts[j])) {
          const from = state.bolts[i];
          const to = state.bolts[j];
          if (to.nuts.length === 0 && !isComplete(from)) continue;
          return [i, j];
        }
      }
    }
    return null;
  }, [state.bolts]);

  const hint = showHint ? findHint() : null;

  const colorsInLevel = useMemo(() => {
    const set = new Set<string>();
    state.bolts.forEach((b) => b.nuts.forEach((n) => set.add(n.color)));
    return Array.from(set);
  }, [state.bolts]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 bg-slate-950/50 backdrop-blur-sm border-b border-white/10">
        <button
          onClick={onExit}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Levels</span>
        </button>
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-bold text-white">{level.name}</h2>
          <p className="text-xs text-slate-400">Level {levelId}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5">
            <span className="text-sm text-slate-400">Moves</span>
            <span className="text-sm font-bold text-white tabular-nums">{state.moves}</span>
          </div>
        </div>
      </header>

      {/* Color legend */}
      <div className="flex justify-center gap-2 py-3 px-4 flex-wrap">
        {colorsInLevel.map((c) => {
          const color = getColor(c);
          const total = state.bolts.reduce((acc, b) => acc + b.nuts.filter((n) => n.color === c).length, 0);
          const sorted = state.bolts.some((b) => isComplete(b) && b.nuts[0]?.color === c);
          return (
            <div
              key={c}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-opacity ${
                sorted ? 'opacity-100' : 'opacity-60'
              }`}
              style={{ background: `${color.hex}20` }}
            >
              <div className="w-3 h-3 rounded-full" style={{ background: color.hex }} />
              <span className="text-slate-300">{total}</span>
            </div>
          );
        })}
      </div>

      {/* Game board */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 overflow-hidden">
        <div
          className="flex flex-wrap items-end justify-center gap-4 sm:gap-6 max-w-4xl"
          style={{ maxHeight: '70vh' }}
        >
          {state.bolts.map((bolt, i) => (
            <Bolt
              key={i}
              bolt={bolt}
              index={i}
              isSelected={state.selectedBolt === i}
              isComplete={isComplete(bolt)}
              isHovered={hoveredBolt === i && state.selectedBolt !== null && state.selectedBolt !== i}
              onClick={() => handleBoltClick(i)}
              onHover={(h) => setHoveredBolt(h ? i : null)}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <footer className="flex items-center justify-center gap-3 px-4 py-4 bg-slate-950/50 backdrop-blur-sm border-t border-white/10">
        <button
          onClick={handleUndo}
          disabled={state.history.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Undo</span>
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Reset</span>
        </button>
        <button
          onClick={() => setShowHint((s) => !s)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 transition-colors"
        >
          <Lightbulb className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Hint</span>
        </button>
      </footer>

      {/* Hint overlay */}
      {hint && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-yellow-500/90 text-slate-900 text-sm font-medium shadow-lg z-30 animate-pulse">
          Try moving from bolt {hint[0] + 1} to bolt {hint[1] + 1}
        </div>
      )}

      {/* Win modal */}
      {won && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Confetti />
          <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-8 mx-4 max-w-sm w-full border border-white/10 shadow-2xl animate-scale-in">
            <button
              onClick={onExit}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Level Complete!</h2>
              <p className="text-slate-400 mb-6">{state.moves} moves · Par {par}</p>
              <div className="flex justify-center gap-2 mb-8">
                {[0, 1, 2].map((i) => {
                  const stars = getStars(state.moves, par);
                  return (
                    <div
                      key={i}
                      className={`text-5xl transition-all ${
                        i < stars ? 'text-yellow-400 scale-110' : 'text-slate-700'
                      }`}
                      style={{ animationDelay: `${i * 150}ms` }}
                    >
                      {i < stars ? '★' : '☆'}
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={onReplay}
                  className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-medium transition-colors"
                >
                  Replay
                </button>
                <button
                  onClick={onNext}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold transition-colors"
                >
                  Next Level
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () => Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 1.5,
      color: ['#EF4444', '#3B82F6', '#22C55E', '#EAB308', '#A855F7', '#F97316', '#EC4899'][i % 7],
    })),
    [],
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 w-2 h-3 rounded-sm"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
