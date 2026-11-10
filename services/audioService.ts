let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.3) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio not available:', e);
  }
}

export function playStart() {
  playTone(880, 0.15, 'sine', 0.25);
}

export function playEnd() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  [523, 659, 784].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.value = 0.2;
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + i * 0.15);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now + i * 0.15);
    osc.stop(now + 0.4 + i * 0.15);
  });
}

export function playRest() {
  playTone(440, 0.3, 'triangle', 0.2);
}

export function playCountdown() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  [660, 660, 880].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    g.gain.value = 0.15;
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2 + i * 0.5);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now + i * 0.5);
    osc.stop(now + 0.3 + i * 0.5);
  });
}

export function playSessionComplete() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  [523, 659, 784, 1047].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.value = 0.25;
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + i * 0.2);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now + i * 0.2);
    osc.stop(now + 0.6 + i * 0.2);
  });
}

export function playBadgeUnlock() {
  const ctx = getCtx();
  const now = ctx.currentTime;
  [392, 523, 659, 784, 1047].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    g.gain.value = 0.2;
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.4 + i * 0.12);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now + i * 0.12);
    osc.stop(now + 0.5 + i * 0.12);
  });
}
