import { useState } from 'react';
import { LevelSelect } from '@/components/LevelSelect';
import { GameScreen } from '@/components/GameScreen';
import { TOTAL_LEVELS } from '@/game/levels';

type Screen = 'menu' | 'game';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameKey, setGameKey] = useState(0);

  const startLevel = (id: number) => {
    setCurrentLevel(id);
    setGameKey((k) => k + 1);
    setScreen('game');
  };

  const handleNext = () => {
    const next = currentLevel + 1;
    if (next <= TOTAL_LEVELS) {
      startLevel(next);
    } else {
      setScreen('menu');
    }
  };

  const handleReplay = () => {
    startLevel(currentLevel);
  };

  if (screen === 'menu') {
    return <LevelSelect onSelect={startLevel} />;
  }

  return (
    <GameScreen
      key={gameKey}
      levelId={currentLevel}
      onExit={() => setScreen('menu')}
      onNext={handleNext}
      onReplay={handleReplay}
    />
  );
}
