// engine.js: a tiny synthesised UI sound kit on the Web Audio API.
// No audio files: every sound is built from oscillators, noise, filters and
// gain envelopes. The AudioContext is only created by unlock(), which must be
// called from a user gesture (click / key press).
//
// Levels below are the loudness you hear; they're divided by the master gain
// so the mix stays soft however the master is set.

const MASTER = 0.18;
const REVERB_SEND = 0.12;
const THROTTLE = { hover: 70, type: 35, swing: 120 };

let ctx = null;
let master = null;
let reverb = null;
let noise = null;
const lastPlayed = {};

const level = (g) => g / MASTER;
const vary = () => 1 + (Math.random() * 2 - 1) * 0.04; // ±4% detune per play

function impulse(seconds) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2.5;
  }
  return buffer;
}

function create() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  ctx = new AudioCtx();

  const compressor = ctx.createDynamicsCompressor();
  compressor.connect(ctx.destination);
  master = ctx.createGain();
  master.gain.value = MASTER;
  master.connect(compressor);

  const convolver = ctx.createConvolver();
  convolver.buffer = impulse(1.2);
  convolver.connect(master);
  reverb = ctx.createGain();
  reverb.gain.value = REVERB_SEND;
  reverb.connect(convolver);

  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) ctx.suspend();
    else ctx.resume();
  });
}

// Call from a click/keydown handler: creates or resumes the audio context.
export function unlock() {
  if (typeof window === "undefined") return;
  if (!ctx) create();
  if (ctx?.state === "suspended") ctx.resume();
}

export const isUnlocked = () => Boolean(ctx);

// ---------- building blocks ----------

function envelope(peak, start, attack, decay) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), start + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, start + attack + decay);
  return g;
}

function out(node, withReverb) {
  node.connect(master);
  if (withReverb) node.connect(reverb);
}

function tone({ type = "sine", from, to = from, glide = 0.05, peak, attack = 0.003, decay, at = 0, send = false }) {
  const t = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, t + glide);
  const g = envelope(level(peak), t, attack, decay);
  osc.connect(g);
  out(g, send);
  osc.start(t);
  osc.stop(t + attack + decay + 0.03);
}

function burst({ filter = "highpass", freq, to, q = 1, peak, attack = 0.001, decay, at = 0, send = false }) {
  const t = ctx.currentTime + at;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const f = ctx.createBiquadFilter();
  f.type = filter;
  f.frequency.setValueAtTime(freq, t);
  if (to) f.frequency.exponentialRampToValueAtTime(to, t + attack + decay);
  f.Q.value = q;
  const g = envelope(level(peak), t, attack, decay);
  src.connect(f).connect(g);
  out(g, send);
  src.start(t, Math.random() * 0.5);
  src.stop(t + attack + decay + 0.03);
}

// ---------- recipes ----------

const recipes = {
  hover: () => tone({ type: "triangle", from: 2600 * vary(), to: 1900, glide: 0.016, peak: 0.035, attack: 0.002, decay: 0.016 }),

  click: () => {
    tone({ from: 880 * vary(), to: 420, glide: 0.06, peak: 0.08, attack: 0.002, decay: 0.06 });
    burst({ filter: "highpass", freq: 3200, peak: 0.05, decay: 0.006 });
  },

  pop: () => tone({ from: 480 * vary(), to: 900, glide: 0.045, peak: 0.07, attack: 0.003, decay: 0.045, send: true }),

  toggle: ({ to = "light" } = {}) => {
    const [a, b] = to === "light" || to === "on" ? [660, 990] : [990, 660];
    const v = vary();
    tone({ from: a * v, peak: 0.06, decay: 0.07 });
    tone({ from: b * v, peak: 0.06, decay: 0.09, at: 0.08, send: true });
  },

  whoosh: () => burst({ filter: "bandpass", freq: 300, to: 2600 * vary(), q: 0.8, peak: 0.07, attack: 0.14, decay: 0.24, send: true }),

  drop: ({ at = 0 } = {}) => {
    tone({ from: 180 * vary(), to: 70, glide: 0.14, peak: 0.09, attack: 0.002, decay: 0.14, at });
    burst({ filter: "lowpass", freq: 1200, peak: 0.05, decay: 0.02, at });
  },

  swing: ({ speed = 0.5 } = {}) => {
    const s = Math.min(1, Math.max(0.1, speed));
    burst({ filter: "lowpass", freq: 300 + s * 600, peak: 0.015 * s + 0.004, attack: 0.08, decay: 0.2 });
  },

  type: () => burst({ filter: "bandpass", freq: 2000 + Math.random() * 2000, q: 2, peak: 0.02, decay: 0.005 }),

  copy: () => {
    recipes.pop();
    setTimeout(() => recipes.hover(), 40);
  },

  success: () => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      tone({ from: f, peak: 0.045, decay: 0.32, at: i * 0.07, send: true });
      tone({ type: "triangle", from: f, peak: 0.012, decay: 0.28, at: i * 0.07 });
    });
  },

  error: () => {
    [0, 0.09].forEach((at) => {
      const t = ctx.currentTime + at;
      const osc = ctx.createOscillator();
      osc.type = "square";
      osc.frequency.value = 196;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1200;
      const g = envelope(level(0.035), t, 0.003, 0.06);
      osc.connect(lp).connect(g);
      out(g);
      osc.start(t);
      osc.stop(t + 0.09);
    });
  },

  tick: () => tone({ from: 1200, peak: 0.02, attack: 0.002, decay: 0.03 }),

  shuffle: () => {
    for (let i = 0; i < 5; i++) recipes.drop({ at: i * 0.06 + Math.random() * 0.02 });
  },
};

export const SOUNDS = Object.keys(recipes);

export function play(name, opts) {
  // A context that is still resuming queues the sound until it starts.
  if (!ctx || ctx.state === "closed" || !recipes[name]) return;
  const now = performance.now();
  if (THROTTLE[name] && now - (lastPlayed[name] ?? 0) < THROTTLE[name]) return;
  lastPlayed[name] = now;
  recipes[name](opts);
}
