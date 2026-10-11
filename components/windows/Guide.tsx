"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { guide } from "@/lib/content";
import type { WindowId } from "@/lib/store";
import { blip } from "@/lib/sound";

type Line = { from: "guide" | "me"; text: string };

const AVATAR = "/boot/avatar.png";

// JINE-style colors: pink sky fading to lavender, blue guide bubbles, green replies
const GUIDE_BUBBLE = "rounded-lg border border-[#9fb8ee] bg-[#cfe3fb] text-[#3b2a8c]";
const ME_BUBBLE = "rounded-md border border-[#4cbf2a] bg-[#7fe65c] text-[#1f3d10]";

export default function Guide({ onCommand }: { onCommand: (id: WindowId) => void }) {
  const reduced = useReducedMotion();
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState(true);
  const feed = useRef<HTMLDivElement>(null);

  // Greeting arrives one bubble at a time, like a real chat
  useEffect(() => {
    const timers = guide.greeting.map((text, i) =>
      setTimeout(
        () => {
          setLines((l) => [...l, { from: "guide", text }]);
          if (i === guide.greeting.length - 1) setTyping(false);
        },
        reduced ? 0 : 600 + i * 900,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  useEffect(() => {
    const el = feed.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [lines, typing, reduced]);

  const ask = (i: number) => {
    const c = guide.choices[i];
    blip(900);
    setLines((l) => [...l, { from: "me", text: c.ask }]);
    setTyping(true);
    setTimeout(
      () => {
        setLines((l) => [...l, { from: "guide", text: c.answer }]);
        setTyping(false);
        if ("open" in c && c.open) onCommand(c.open);
      },
      reduced ? 0 : 700,
    );
  };

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#f7a6dc_0%,#e9a8ea_55%,#c9a7ef_100%)]">
      <div ref={feed} className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3" aria-live="polite">
        <AnimatePresence initial={false}>
          {lines.map((l, i) => (
            <motion.div
              key={i}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className={`flex items-start gap-2 ${l.from === "me" ? "justify-end" : ""}`}
            >
              {l.from === "guide" && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={AVATAR} alt="" className="h-8 w-8 shrink-0 rounded-md border border-[#9fb8ee] bg-white" />
              )}
              <p
                className={`max-w-[80%] px-2.5 py-1.5 text-sm leading-snug ${l.from === "guide" ? GUIDE_BUBBLE : ME_BUBBLE}`}
              >
                {l.text}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex items-start gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={AVATAR} alt="" className="h-8 w-8 shrink-0 rounded-md border border-[#9fb8ee] bg-white" />
            <p className={`${GUIDE_BUBBLE} px-3 py-1.5 text-sm`}>
              <span className="blink">•••</span>
            </p>
          </div>
        )}
      </div>

      {/* Reply choices */}
      <div className="flex flex-wrap justify-end gap-1.5 border-t border-white/60 bg-[#c9a7ef]/70 p-2">
        {guide.choices.map((c, i) => (
          <button
            key={c.ask}
            disabled={typing}
            onClick={() => ask(i)}
            className={`${ME_BUBBLE} px-2.5 py-1 text-xs hover:bg-[#9af07c] disabled:opacity-50`}
          >
            {c.ask}
          </button>
        ))}
      </div>
    </div>
  );
}
