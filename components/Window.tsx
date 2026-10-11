"use client";

import { motion, useDragControls, useReducedMotion } from "framer-motion";
import type { ReactNode, RefObject } from "react";
import { WINDOW_META, useOS, type WindowId } from "@/lib/store";
import { blip } from "@/lib/sound";

type Props = {
  id: WindowId;
  bounds: RefObject<HTMLDivElement | null>;
  initial: { x: number; y: number; w: number; h: number };
  children: ReactNode;
};

export default function Window({ id, bounds, initial, children }: Props) {
  const win = useOS((s) => s.windows[id]);
  const focused = useOS((s) => s.focused === id);
  const { focus, closeWindow, minimize, toggleMax } = useOS.getState();
  const controls = useDragControls();
  const reduced = useReducedMotion();

  if (!win.open) return null;

  const max = win.maximized;

  return (
    <motion.section
      role="dialog"
      aria-label={WINDOW_META[id].title}
      drag={!max}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={bounds}
      onPointerDown={() => focus(id)}
      initial={reduced ? false : { scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.12, ease: "linear" }}
      className="nso-window absolute"
      style={{
        zIndex: win.z,
        display: win.minimized ? "none" : undefined,
        ...(max
          ? { left: 4, top: 4, right: 4, bottom: 4, width: "auto", height: "auto", x: 0, y: 0 }
          : // h: 0 means fit the content, so the window never needs a scrollbar
            { left: initial.x, top: initial.y, width: initial.w, height: initial.h || "auto", maxWidth: "calc(100% - 16px)" }),
      }}
    >
      <header
        className={`nso-titlebar ${focused ? "" : "inactive"} ${max ? "" : "cursor-grab active:cursor-grabbing"}`}
        onPointerDown={(e) => !max && controls.start(e)}
        onDoubleClick={() => toggleMax(id)}
        style={{ touchAction: "none" }}
      >
        <span className="h-3.5 w-3.5 shrink-0 bg-nso-ink" />
        <h2 className="flex-1 truncate font-pixel text-xs tracking-wide">{WINDOW_META[id].title}</h2>
        <div className="flex gap-1" onPointerDown={(e) => e.stopPropagation()}>
          <button
            className="nso-titlebtn"
            aria-label="Minimize"
            onClick={() => {
              blip(660);
              minimize(id);
            }}
          >
            <span className="mt-2 block h-[2px] w-2 bg-nso-ink" />
          </button>
          <button
            className="nso-titlebtn"
            aria-label={max ? "Restore" : "Maximize"}
            onClick={() => {
              blip(770);
              toggleMax(id);
            }}
          >
            <span className="block h-2 w-2 border-2 border-nso-ink" />
          </button>
          <button
            className="nso-titlebtn"
            aria-label="Close"
            onClick={() => {
              blip(440);
              closeWindow(id);
            }}
          >
            <svg viewBox="0 0 8 8" width="8" height="8" className="pixel">
              <path d="M0 0h2v2H0zM2 2h2v2H2zM4 4h2v2H4zM6 6h2v2H6zM6 0h2v2H6zM4 2h2v2H4zM2 4h2v2H2zM0 6h2v2H0z" fill="#4d21cb" />
            </svg>
          </button>
        </div>
      </header>
      <div className="nso-body">{children}</div>
      <footer className="nso-footer" aria-hidden="true">
        <span className="h-1.5 w-8 bg-nso-hot" />
        <span className="h-1.5 w-1.5 border border-nso-ink" />
        <span className="h-1.5 w-1.5 border border-nso-ink" />
        <span className="h-1.5 w-1.5 border border-nso-ink" />
      </footer>
    </motion.section>
  );
}
