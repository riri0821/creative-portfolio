"use client";

import { useOS } from "./store";

// Tiny synthesized square-wave blip, so no audio assets are needed yet.
// Swap for Howler.js + real sound files later.
let ctx: AudioContext | null = null;

export function blip(freq = 880) {
  if (!useOS.getState().sound || typeof window === "undefined") return;
  try {
    ctx ??= new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch {
    /* audio unavailable */
  }
}
