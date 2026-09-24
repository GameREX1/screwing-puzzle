let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return ctx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.15): void {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + duration);
  } catch {
    // ignore
  }
}

export function playSelect(): void {
  playTone(440, 0.08, 'sine', 0.12);
}

export function playMove(): void {
  playTone(660, 0.06, 'triangle', 0.15);
  setTimeout(() => playTone(880, 0.04, 'triangle', 0.1), 30);
}

export function playInvalid(): void {
  playTone(200, 0.12, 'sawtooth', 0.08);
}

export function playWin(): void {
  const notes = [523, 659, 784, 1047];
  notes.forEach((f, i) => {
    setTimeout(() => playTone(f, 0.2, 'sine', 0.2), i * 120);
  });
}

export function playStar(): void {
  playTone(880, 0.1, 'sine', 0.15);
  setTimeout(() => playTone(1100, 0.15, 'sine', 0.15), 80);
}
