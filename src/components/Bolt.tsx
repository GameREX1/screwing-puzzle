import { getColor } from '@/game/colors';
import type { Bolt as BoltType } from '@/game/types';

interface BoltProps {
  bolt: BoltType;
  index: number;
  isSelected: boolean;
  isComplete: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hover: boolean) => void;
}

export function Bolt({ bolt, index, isSelected, isComplete, isHovered, onClick, onHover }: BoltProps) {
  const capacity = bolt.capacity;
  const fillCount = bolt.nuts.length;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={`bolt-container relative flex flex-col items-center transition-transform duration-200 ${
        isSelected ? '-translate-y-3' : ''
      } ${isHovered ? '-translate-y-1' : ''}`}
      aria-label={`Bolt ${index + 1}`}
    >
      {/* Nuts stack area */}
      <div className="nuts-area relative flex flex-col-reverse items-center justify-start">
        {Array.from({ length: capacity }).map((_, i) => {
          const nut = bolt.nuts[i];
          const isTop = i === fillCount - 1;
          if (!nut) {
            return <div key={i} className="nut-slot" />;
          }
          const color = getColor(nut.color);
          return (
            <div
              key={nut.id}
              className="nut"
              style={{
                background: `linear-gradient(135deg, ${color.light}, ${color.hex} 40%, ${color.dark})`,
                boxShadow: `inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -3px 6px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.25)`,
                animation: isTop && isSelected ? 'nutPulse 0.8s ease-in-out infinite' : undefined,
              }}
            >
              {/* Hexagon nut face */}
              <div className="nut-hex" />
              {/* Center hole */}
              <div className="nut-hole" />
            </div>
          );
        })}
      </div>

      {/* The bolt rod */}
      <div className={`bolt-rod ${isComplete ? 'bolt-rod-complete' : ''}`}>
        <div className="bolt-rod-highlight" />
        {/* Bolt head */}
        <div className={`bolt-head ${isSelected ? 'bolt-head-selected' : ''}`}>
          <div className="bolt-head-inner" />
        </div>
      </div>

      {/* Completion glow */}
      {isComplete && (
        <div className="absolute -inset-2 rounded-2xl bg-green-400/20 blur-md -z-10" />
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse" />
      )}
    </button>
  );
}
