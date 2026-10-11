"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { links, profile } from "@/lib/content";
import { WINDOW_META, clearView, saveView, useOS, type WindowId } from "@/lib/store";
import { blip } from "@/lib/sound";
import PixelIcon, { type IconName } from "./PixelIcon";

const ORDER: WindowId[] = ["stream", "projects", "tweeter", "expertise", "contact", "taskmgr", "guide"];
const MENU_ICON: Partial<Record<WindowId, IconName>> = { stream: "stream", projects: "folder", tweeter: "tweeter", expertise: "expertise", contact: "contact" };

function dayNumber() {
  const start = new Date(profile.startedOn).getTime();
  return Math.max(1, Math.floor((Date.now() - start) / 86_400_000) + 1);
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(t);
  }, []);
  if (!now) return <span className="w-24" />;
  const night = now.getHours() >= 18 || now.getHours() < 6;
  return (
    <div className="flex items-center gap-2">
      <PixelIcon name={night ? "moon" : "sun"} size={20} />
      <span className="hidden text-xs sm:inline">
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
      <span className="font-pixel text-xs">DAY {dayNumber()}</span>
    </div>
  );
}

function StartMenu({ onClose }: { onClose: () => void }) {
  const { openWindow, setView } = useOS.getState();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node) && !(e.target as HTMLElement).closest("[data-start]")) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const item = "flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-nso-ink hover:text-white";

  return (
    <motion.div
      ref={ref}
      role="menu"
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 12, opacity: 0 }}
      transition={{ duration: 0.1 }}
      className="nso-window absolute bottom-11 left-1 z-[9000] w-64 flex-row"
    >
      <div className="flex w-7 items-end justify-center bg-nso-ink py-2">
        <span className="font-pixel text-xs text-white [writing-mode:vertical-rl] rotate-180">{profile.name}</span>
      </div>
      <div className="flex-1 bg-nso-paper py-1">
        {ORDER.filter((id) => id !== "taskmgr").map((id) => (
          <button
            key={id}
            role="menuitem"
            className={item}
            onClick={() => {
              blip();
              openWindow(id);
              onClose();
            }}
          >
            <PixelIcon name={MENU_ICON[id] ?? "contact"} size={20} />
            {WINDOW_META[id].label}
          </button>
        ))}
        <hr className="mx-2 my-1 border-nso-lav" />
        <a role="menuitem" className={item} href={links.resume} download>
          📄 Resume
        </a>
        <a role="menuitem" className={item} href={links.github} target="_blank" rel="noreferrer">
          🐙 GitHub
        </a>
        <a role="menuitem" className={item} href={links.linkedin} target="_blank" rel="noreferrer">
          💼 LinkedIn
        </a>
        <hr className="mx-2 my-1 border-nso-lav" />
        <button
          role="menuitem"
          className={item}
          onClick={() => {
            saveView("normal");
            setView("normal");
          }}
        >
          🔀 Switch View
        </button>
        <button
          role="menuitem"
          className={item}
          onClick={() => {
            clearView();
            setView("boot");
          }}
        >
          ⏻ Shut Down
        </button>
      </div>
    </motion.div>
  );
}

// The hint shows once per page load, a moment after the desktop appears.
let hintShown = false;

function NormalViewButton() {
  const setView = useOS((s) => s.setView);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    if (hintShown) return;
    // Mark it shown only once it actually appears, so a remount (React dev mode
    // mounts twice) can't cancel it before it ever shows.
    const show = setTimeout(() => {
      hintShown = true;
      setHint(true);
    }, 900);
    const hide = setTimeout(() => setHint(false), 12000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div className="relative">
      <AnimatePresence>
        {hint && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-3 flex w-52 items-start gap-2 border-2 border-nso-ink bg-white px-3 py-2 text-xs text-nso-ink shadow-[3px_3px_0_#7b59d2]"
          >
            <span className="flex-1">Click here for a quick scroll view</span>
            <button aria-label="Dismiss hint" className="leading-none text-nso-purple hover:text-nso-ink" onClick={() => setHint(false)}>
              ×
            </button>
            {/* Speech-bubble tail pointing at the button */}
            <span className="absolute -bottom-[7px] right-8 h-3 w-3 rotate-45 border-b-2 border-r-2 border-nso-ink bg-white" />
          </motion.div>
        )}
      </AnimatePresence>
      <button
        className="px-btn h-8 px-2 text-xs"
        onClick={() => {
          blip(1040);
          saveView("normal");
          setView("normal");
        }}
      >
        Normal View
      </button>
    </div>
  );
}

export default function Taskbar() {
  const windows = useOS((s) => s.windows);
  const focused = useOS((s) => s.focused);
  const sound = useOS((s) => s.sound);
  const { taskbarClick, toggleSound } = useOS.getState();
  const [menu, setMenu] = useState(false);

  return (
    <footer className="relative z-[8000] flex h-10 shrink-0 items-center gap-1 border-t-2 border-white bg-nso-face px-1 shadow-[0_-2px_0_#7b59d2]">
      <AnimatePresence>{menu && <StartMenu onClose={() => setMenu(false)} />}</AnimatePresence>
      <button
        data-start
        className={`px-btn h-8 px-2 font-pixel text-xs ${menu ? "translate-y-[1px] shadow-[inset_2px_2px_0_#7b59d2]" : ""}`}
        aria-haspopup="menu"
        aria-expanded={menu}
        onClick={() => {
          blip(520);
          setMenu((m) => !m);
        }}
      >
        <PixelIcon name="start" size={18} />
        START
      </button>
      <span className="mx-1 h-7 w-[2px] bg-nso-purple" aria-hidden="true" />
      <div className="flex min-w-0 flex-1 gap-1 overflow-hidden">
        {ORDER.filter((id) => windows[id].open).map((id) => (
          <button
            key={id}
            className={`tb-tab flex h-8 w-40 min-w-0 items-center gap-2 border-2 px-2 text-left text-xs ${
              focused === id && !windows[id].minimized
                ? "border-nso-ink bg-nso-light shadow-[inset_2px_2px_0_#cfa8f5]"
                : "border-nso-purple bg-[#f3e2f4]"
            }`}
            onClick={() => {
              blip();
              taskbarClick(id);
            }}
          >
            <span className="h-3 w-3 shrink-0 bg-nso-ink" />
            <span className="truncate">{WINDOW_META[id].label}</span>
          </button>
        ))}
      </div>
      <NormalViewButton />
      <div className="flex h-8 items-center gap-3 border-2 border-nso-purple bg-nso-light px-2">
        <button
          onClick={() => {
            toggleSound();
            setTimeout(() => blip(880), 0);
          }}
          aria-label={sound ? "Mute click sounds" : "Turn on click sounds"}
          aria-pressed={sound}
        >
          <PixelIcon name={sound ? "speaker" : "mute"} size={20} />
        </button>
        <Clock />
      </div>
    </footer>
  );
}
