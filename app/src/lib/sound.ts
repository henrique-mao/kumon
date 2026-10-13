// Efeitos sonoros curtos gerados com Web Audio (sem arquivos).
let ctx: AudioContext | null = null;

function tone(freqs: number[], dur = 0.12, type: OscillatorType = 'sine', gain = 0.12) {
  try {
    ctx ??= new AudioContext();
    let t = ctx.currentTime;
    for (const f of freqs) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = f;
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + dur);
      t += dur * 0.9;
    }
  } catch {
    /* sem áudio */
  }
}

export const sfx = {
  correct: (calm = false) => tone(calm ? [660] : [523, 659, 784], 0.11, 'triangle', calm ? 0.06 : 0.12),
  tryAgain: (calm = false) => tone([330, 294], 0.14, 'sine', calm ? 0.04 : 0.08),
  tap: () => tone([880], 0.04, 'sine', 0.05),
  levelUp: (calm = false) => tone(calm ? [523, 784] : [523, 659, 784, 1046, 1318], 0.13, 'triangle', calm ? 0.06 : 0.12),
};
