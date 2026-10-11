"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { projects, skillGroups, stats, profile } from "@/lib/content";
import { savedView, useOS } from "@/lib/store";

const SEGMENTS = 20;
// Even on a fast connection the bar takes at least this long, so it reads as a loading screen.
const MIN_MS = 1400;

// Everything the first screens show, fetched up front so windows open without pop-in.
function assetList(): string[] {
  const list = new Set<string>(["/boot/avatar.png"]);
  if (profile.portrait) list.add(profile.portrait);
  if (profile.streamBg) list.add(profile.streamBg);
  stats.forEach((s) => s.icon && list.add(s.icon));
  projects.forEach((p) => {
    if (p.preview) list.add(p.preview);
    if (p.hoverPreview) list.add(p.hoverPreview);
  });
  skillGroups.forEach((g) => g.skills.forEach((s) => s.icon && list.add(s.icon)));
  return [...list];
}

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}

// Real progress: the share of assets (plus fonts) that finished loading.
function useBootProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const assets = assetList();
    const total = assets.length + 1;
    let done = 0;
    const tick = () => {
      done += 1;
      if (!cancelled) setProgress(done / total);
    };
    assets.forEach((a) => preload(a).then(tick));
    document.fonts.ready.then(tick);
    return () => {
      cancelled = true;
    };
  }, []);
  return progress;
}

export default function BootScreen({ auto }: { auto?: "normal" }) {
  const reduced = useReducedMotion();
  const progress = useBootProgress();
  const setView = useOS((s) => s.setView);
  const [shown, setShown] = useState(0);
  const [start] = useState(() => Date.now());
  const ready = shown >= SEGMENTS;

  // The bar steps toward the real progress one cell at a time, and never finishes faster than MIN_MS.
  const progressRef = useRef(progress);
  progressRef.current = progress;
  useEffect(() => {
    if (ready) return;
    const t = setInterval(
      () => {
        const target = Math.floor(progressRef.current * SEGMENTS);
        const paced = reduced ? SEGMENTS : Math.floor(((Date.now() - start) / MIN_MS) * SEGMENTS) + 1;
        setShown((s) => (s < Math.min(target, paced) ? s + 1 : s));
      },
      reduced ? 16 : MIN_MS / SEGMENTS,
    );
    return () => clearInterval(t);
  }, [ready, reduced, start]);

  // Once loaded, continue on our own: phones go to Normal View, wider screens to the
  // desktop (or Normal View if that's what this visitor switched to last time).
  useEffect(() => {
    if (!ready) return;
    const next = auto ?? (savedView() === "normal" ? "normal" : "desktop");
    const t = setTimeout(() => setView(next), 300);
    return () => clearTimeout(t);
  }, [ready, auto, setView]);

  return (
    <div className="scanlines relative flex h-dvh flex-col bg-[#fae1ef]">
      <div className="h-[11%] min-h-12 border-b-8 border-[#fdf0fb] bg-nso-hot" />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6">
        <div className="pointer-events-none absolute -left-16 -top-16 h-80 w-80 rounded-full bg-white/70 blur-3xl" />

        <div className="relative flex w-full max-w-3xl flex-col-reverse items-center gap-8 md:flex-row md:gap-0">
          {/* Welcome + view choice */}
          <div className="flex flex-1 flex-col items-center gap-5 md:items-end md:pr-12">
            <h1 className="font-dot text-4xl italic text-[#e05bc8] md:text-5xl">Welcome</h1>
            <p className="h-6 text-sm text-nso-rose">
              {ready ? "Ready!" : <>Now loading<span className="blink">...</span></>}
            </p>
          </div>

          {/* Divider */}
          <div className="hidden h-64 w-0.5 bg-white md:block" aria-hidden="true" />

          {/* Avatar */}
          <div className="flex flex-1 justify-center md:justify-start md:pl-12">
            <motion.img
              src="/boot/avatar.png"
              alt={`${profile.name} pixel avatar`}
              className="h-32 w-32 border-4 border-[#f096dc] shadow-[4px_4px_0_#fdf0fb] md:h-36 md:w-36"
              initial={reduced ? false : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </main>

      <div className="flex h-[13%] min-h-16 items-center gap-4 border-t-8 border-[#bcd6f5] bg-nso-hot px-6">
        <span className="hidden text-2xl text-white/80 sm:inline" aria-hidden="true">
          ⏻
        </span>
        <div
          className="mx-auto flex gap-[3px]"
          role="progressbar"
          aria-label="Loading"
          aria-valuemin={0}
          aria-valuemax={SEGMENTS}
          aria-valuenow={shown}
        >
          {Array.from({ length: SEGMENTS }).map((_, i) => (
            <span
              key={i}
              className={`h-7 w-3 border border-white sm:h-9 sm:w-6 lg:w-8 ${i < shown ? "bg-nso-blue" : "bg-transparent"}`}
            />
          ))}
        </div>
        <span className="hidden text-2xl text-white/80 sm:inline" aria-hidden="true">
          ⚙
        </span>
      </div>
    </div>
  );
}
