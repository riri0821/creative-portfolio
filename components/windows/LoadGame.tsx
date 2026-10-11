"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { projects, type Project } from "@/lib/content";
import PixelIcon from "../PixelIcon";
import { blip } from "@/lib/sound";

const CELLS = 20;

// Fills cell by cell like a game loading screen. Runs when the window opens and
// again whenever runKey changes (a project gets loaded).
function SaveBar({ runKey }: { runKey: number }) {
  const reduced = useReducedMotion();
  const [filled, setFilled] = useState(reduced ? CELLS : 0);

  useEffect(() => {
    if (reduced) return;
    setFilled(0);
    const t = setInterval(() => {
      setFilled((f) => {
        if (f >= CELLS) {
          clearInterval(t);
          return f;
        }
        return f + 1;
      });
    }, 45);
    return () => clearInterval(t);
  }, [runKey, reduced]);

  return (
    <div className="flex justify-center bg-nso-sky px-4 py-4">
      <div className="flex border-2 border-white" role="progressbar" aria-valuemin={0} aria-valuemax={CELLS} aria-valuenow={filled}>
        {Array.from({ length: CELLS }).map((_, i) => (
          <span
            key={i}
            className={`h-6 w-4 border-r border-white last:border-r-0 sm:w-6 ${i < filled ? "bg-nso-blue" : "bg-white/25"}`}
          />
        ))}
      </div>
    </div>
  );
}

function Preview({ p }: { p: Project }) {
  // Shows the project's screenshot when one is set, otherwise a tiny fake one in its accent color.
  return (
    <div className="w-72 border-2 border-nso-ink bg-white p-1 shadow-[4px_4px_0_#7b59d2]">
      {p.hoverPreview || p.preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.hoverPreview ?? p.preview} alt={`${p.title} preview`} className="aspect-video w-full border border-nso-ink object-cover object-top" />
      ) : (
        <div className="aspect-video">
          <div className="h-3 border-b border-nso-ink" style={{ background: p.accent }} />
          <div className="space-y-1 p-1.5">
            <div className="h-2 w-3/4 bg-nso-face" />
            <div className="h-2 w-1/2 bg-nso-face" />
            <div className="h-16 w-full" style={{ background: `${p.accent}55` }} />
          </div>
        </div>
      )}
      <p className="truncate px-1 pt-1 text-[11px]">{p.title}</p>
    </div>
  );
}

function Details({ p }: { p: Project }) {
  return (
    <article className="nso-panel h-fit p-4 md:sticky md:top-4">
      <p className="text-xs text-nso-rose">Name</p>
      <h3 className="mb-2 text-xl">{p.title}</h3>
      {p.preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.preview} alt={`${p.title} screenshot`} className="mb-3 aspect-video w-full border-2 border-nso-ink object-cover object-top" />
      ) : (
        <div className="mb-3 aspect-video w-full border-2 border-dashed border-nso-lav" style={{ background: `${p.accent}22` }} />
      )}
      <p className="text-xs text-nso-rose">Description</p>
      <p className="mb-3 font-body text-sm leading-relaxed text-nso-plum">{p.description}</p>
      <p className="text-xs text-nso-rose">Tech</p>
      <div className="mb-4 mt-1 flex flex-wrap gap-1.5">
        {p.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {p.demo && (
          <a className="px-btn text-sm" href={p.demo} target="_blank" rel="noreferrer">
            Live Demo
          </a>
        )}
        <a className="px-btn text-sm" href={p.source} target="_blank" rel="noreferrer">
          Source Code
        </a>
      </div>
    </article>
  );
}

export default function LoadGame() {
  // Nothing is loaded until a file or its Load button is clicked
  const [selected, setSelected] = useState<number | null>(null);
  const [loads, setLoads] = useState(0);
  const load = (i: number) => {
    blip();
    setSelected(i);
    setLoads((n) => n + 1);
  };
  const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
  const p = selected === null ? null : projects[selected];

  return (
    <div className="flex min-h-full flex-col">
      <SaveBar runKey={loads} />
      <div className="grid flex-1 gap-4 p-4 md:grid-cols-[1fr_1fr]">
        <ol className="space-y-4">
          {projects.map((proj, i) => (
            <li key={proj.slot}>
              <div className="flex items-end justify-between border-b-2 border-nso-ink pb-1">
                <h3 className="font-pixel text-lg md:text-xl">{proj.slot}</h3>
                <button
                  className="px-btn px-3 py-0.5 text-xs"
                  onClick={() => load(i)}
                >
                  {selected === i ? "Loaded" : "Load"}
                </button>
              </div>
              <button
                className={`mt-2 flex w-full items-center gap-3 p-2 text-left ${
                  selected === i ? "bg-nso-face outline outline-2 outline-nso-purple" : "hover:bg-nso-blush"
                }`}
                aria-pressed={selected === i}
                onClick={() => load(i)}
                onMouseMove={(e) => setHover({ i, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setHover(null)}
              >
                <PixelIcon name="file" size={40} />
                <span className="min-w-0 flex-1 break-all text-base leading-tight text-nso-ink md:text-lg">{proj.file}</span>
                <span className="shrink-0 text-xs text-nso-purple">View more ›</span>
              </button>
              {selected === i && (
                <div className="mt-3 md:hidden">
                  <Details p={proj} />
                </div>
              )}
            </li>
          ))}
        </ol>

        <div className="hidden md:block">
          {p ? (
            <Details p={p} />
          ) : (
            <div className="nso-panel flex h-full min-h-64 flex-col items-center justify-center gap-3 p-6 text-center md:sticky md:top-4">
              <PixelIcon name="folder" size={48} />
              <p className="text-sm text-nso-purple">Pick a save file on the left to load its details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Portaled so the window's drag transform doesn't offset the fixed preview */}
      {typeof document !== "undefined" &&
        createPortal(
      <AnimatePresence>
        {hover && (
          <motion.div
            key="preview"
            className="pointer-events-none fixed z-[10000] hidden md:block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08 }}
            style={{ left: hover.x + 16, top: hover.y + 16 }}
          >
            <Preview p={projects[hover.i]} />
          </motion.div>
        )}
      </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
