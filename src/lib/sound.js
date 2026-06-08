let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function tone(freq, type, duration, volume = 0.15, startOffset = 0) {
  try {
    const ac = getCtx();
    const t = ac.currentTime + startOffset;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t);
    osc.stop(t + duration + 0.01);
  } catch (_) {}
}

export function playDing(enabled) {
  if (!enabled) return;
  tone(880, 'sine', 0.3, 0.15);
}

export function playLevelUp(enabled) {
  if (!enabled) return;
  [523, 659, 784, 1047].forEach((f, i) => tone(f, 'sine', 0.4, 0.2, i * 0.15));
}

export function playCoin(enabled) {
  if (!enabled) return;
  tone(1200, 'square', 0.08, 0.08);
}

export function playSad(enabled) {
  if (!enabled) return;
  [400, 320, 250].forEach((f, i) => tone(f, 'sine', 0.4, 0.12, i * 0.2));
}
