"use client";

import { useEffect, useRef, useState } from "react";
import { bioHighlights, profile } from "@/lib/content";
import type { WindowId } from "@/lib/store";

const USER_COLORS = ["#ff77a8", "#5db3e0", "#7b59d2", "#3bbfa8", "#e0245e", "#c48a00"];

function useTypewriter(lines: string[], speed = 45) {
  const [line, setLine] = useState(0);
  const [chars, setChars] = useState(0);
  useEffect(() => {
    const current = lines[line];
    if (chars < current.length) {
      const t = setTimeout(() => setChars((c) => c + 1), speed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLine((l) => (l + 1) % lines.length);
      setChars(0);
    }, 2200);
    return () => clearTimeout(t);
  }, [chars, line, lines, speed]);
  return lines[line].slice(0, chars);
}

// How many highlights have been shown. Module-level so the sequence runs once per
// page load and continues (instead of restarting) if the window remounts.
let shownCount = 0;
const BIO_DELAY = 1800;

function useBioChat() {
  const [count, setCount] = useState(shownCount);
  useEffect(() => {
    if (shownCount >= bioHighlights.length) return;
    const tick = () => {
      shownCount = Math.min(shownCount + 1, bioHighlights.length);
      setCount(shownCount);
      if (shownCount >= bioHighlights.length) clearInterval(t);
    };
    const t = setInterval(tick, BIO_DELAY);
    if (shownCount === 0) tick();
    return () => clearInterval(t);
  }, []);
  return bioHighlights.slice(0, count);
}

export default function LiveStream({ onCommand }: { onCommand: (id: WindowId) => void }) {
  const caption = useTypewriter(profile.intro);
  const msgs = useBioChat();
  const [viewers, setViewers] = useState(192);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setViewers((v) => Math.max(100, v + Math.round(Math.random() * 14 - 5))), 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  return (
    <div className="flex h-full flex-col">
      {/* Fake browser bar */}
      <div className="flex items-center gap-2 border-b border-nso-face bg-white px-3 py-2">
        <span className="font-pixel text-xs text-[#e0245e]">▶ live</span>
        <div className="h-5 flex-1 border border-nso-face bg-nso-paper px-2 font-body text-xs leading-5 text-nso-purple">
          about.me
        </div>
        <span className="hidden gap-1 sm:flex" aria-hidden="true">
          <i className="h-3 w-3 rounded-full bg-nso-face" />
          <i className="h-3 w-3 rounded-full bg-nso-face" />
          <i className="h-3 w-3 rounded-full bg-nso-face" />
        </span>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 p-3 md:grid-cols-[1fr_220px]">
        <div className="flex min-h-0 flex-col">
          {/* Stream video area: pixel room background with the cut-out portrait in front */}
          <div className="relative aspect-video w-full overflow-hidden border-2 border-nso-ink bg-gradient-to-b from-[#fbe3f7] to-[#f1d6f6]">
            {profile.streamBg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.streamBg} alt="" className="pixel absolute inset-0 h-full w-full object-cover" />
            )}
            {profile.portrait && (
              // Taller than the frame so the photo's cropped top edge stays hidden
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.portrait}
                alt={profile.name}
                className="absolute bottom-0 left-1/2 h-[104%] max-w-none -translate-x-1/2 drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]"
              />
            )}

            <span className="live-pulse absolute left-2 top-2 flex items-center gap-1 bg-[#e0245e] px-2 py-0.5 font-pixel text-[11px] text-white">
              <span className="blink h-1.5 w-1.5 bg-white" /> LIVE
            </span>
            <span className="absolute right-2 top-2 bg-nso-ink/80 px-2 py-0.5 font-pixel text-[11px] text-white">
              👁 {viewers}
            </span>
            <div className="absolute inset-x-0 bottom-2 flex justify-center px-4">
              <p className="min-h-[1.75rem] bg-nso-ink/85 px-3 py-1 text-center text-sm text-white md:text-base">
                {caption}
                <span className="blink">▌</span>
              </p>
            </div>
          </div>

          <h3 className="mt-3 text-lg text-nso-ink md:text-xl">{profile.streamTitle}</h3>
          <p className="text-xs text-nso-purple md:text-sm">
            {viewers} watching now · Started streaming on DAY 1
          </p>
          <hr className="my-2 border-nso-purple/50" />
          <p className="font-body text-sm leading-relaxed text-nso-plum">{profile.about}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["PROJECTS", "projects"],
                ["WORK EXPERIENCE", "tweeter"],
                ["EXPERTISE", "expertise"],
                ["CONTACT", "contact"],
              ] as const
            ).map(([cmd, id]) => (
              <button key={cmd} className="px-btn text-xs" onClick={() => onCommand(id)}>
                {cmd}
              </button>
            ))}
          </div>
        </div>

        {/* Live chat */}
        <aside className="flex min-h-[220px] flex-col border-2 border-nso-face bg-[#fcf3fc]">
          <div className="border-b-2 border-nso-ink bg-nso-face px-2 py-1 text-center text-xs">
            My Bio
          </div>
          <div ref={chatRef} className="min-h-0 flex-1 space-y-2 overflow-y-auto p-2 text-xs" aria-live="polite">
            {msgs.map((m, i) => (
              <p key={m.label} className="break-words leading-snug">
                <span className="font-bold" style={{ color: USER_COLORS[i % USER_COLORS.length] }}>
                  {m.label}:
                </span>
                <span className="text-nso-plum"> {m.text}</span>
              </p>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-nso-face p-2">
            <span className="h-3 w-3 bg-nso-sky" />
            <span className="h-2 flex-1 bg-nso-face" />
            <span className="text-nso-lav">▶</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
