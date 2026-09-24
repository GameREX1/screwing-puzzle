import { useMemo } from 'react';
import { Lock, Star, Wrench } from 'lucide-react';
import { LEVELS, TOTAL_LEVELS } from '@/game/levels';
import { loadProgress, isLevelUnlocked } from '@/game/storage';

interface LevelSelectProps {
  onSelect: (levelId: number) => void;
}

export function LevelSelect({ onSelect }: LevelSelectProps) {
  const progress = useMemo(() => loadProgress(), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Wrench className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Nuts & Bolts</h1>
          </div>
          <p className="text-slate-400">Sort the nuts by color. Tap a bolt to select, tap another to move.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1).map((id) => {
            const unlocked = isLevelUnlocked(id);
            const p = progress[id];
            const level = LEVELS.find((l) => l.id === id);

            return (
              <button
                key={id}
                onClick={() => unlocked && onSelect(id)}
                disabled={!unlocked}
                className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                  unlocked
                    ? 'bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 hover:scale-105 border border-white/10 cursor-pointer'
                    : 'bg-slate-800/50 border border-white/5 cursor-not-allowed'
                }`}
              >
                {unlocked ? (
                  <>
                    <span className="text-2xl font-bold text-white">{id}</span>
                    {level && (
                      <span className="text-[10px] text-slate-400 px-2 text-center leading-tight">
                        {level.name}
                      </span>
                    )}
                    {p && (
                      <div className="flex gap-0.5 absolute top-2 right-2">
                        {[0, 1, 2].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s < p.stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Lock className="w-6 h-6 text-slate-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
