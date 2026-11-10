function vibrate(pattern: number | number[]) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

export function vibrateStart() {
  vibrate(50);
}

export function vibrateSetEnd() {
  vibrate([50, 30, 50, 30, 100]);
}

export function vibrateSessionEnd() {
  vibrate([100, 50, 100, 50, 200]);
}

export function vibrateRestEnd() {
  vibrate(100);
}

export function vibrateBadge() {
  vibrate([100, 50, 100, 50, 100, 50, 200]);
}

export function vibrateLight() {
  vibrate(30);
}
