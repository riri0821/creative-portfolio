"use client";

import { useEffect, useRef, useState } from "react";
import { useOS, type WindowId } from "@/lib/store";
import { blip } from "@/lib/sound";
import PixelIcon, { type IconName } from "./PixelIcon";
import Taskbar from "./Taskbar";
import Window from "./Window";
import LiveStream from "./windows/LiveStream";
import LoadGame from "./windows/LoadGame";
import Tweeter from "./windows/Tweeter";
import Expertise from "./windows/Expertise";
import Guide from "./windows/Guide";
import SuperChat from "./windows/SuperChat";
import TaskManager from "./windows/TaskManager";

const ICONS: { id: WindowId; icon: IconName; label: string }[] = [
  { id: "stream", icon: "stream", label: "About Me" },
  { id: "projects", icon: "folder", label: "My Projects" },
  { id: "tweeter", icon: "tweeter", label: "Work Experience" },
  { id: "expertise", icon: "expertise", label: "Expertise" },
  { id: "contact", icon: "contact", label: "Contact Me" },
  { id: "taskmgr", icon: "taskmgr", label: "My Achievements" },
  { id: "guide", icon: "guide", label: "Guide" },
];

type Layout = Record<WindowId, { x: number; y: number; w: number; h: number }>;

function computeLayout(W: number, H: number): Layout {
  const tmW = 300;
  const guideW = 360;
  const side = W - tmW - 24;
  const mainW = Math.min(860, side - 110);
  const mainH = Math.min(680, H - 40);
  // Windows opened from buttons start in the middle of the screen, nudged a little
  // apart so two open windows don't sit exactly on top of each other.
  const center = (w: number, h: number, nudge: number) => ({
    x: Math.max(100, Math.round((W - w) / 2) + nudge),
    y: Math.max(10, Math.round((H - h) / 2) + nudge),
    w,
    h,
  });
  return {
    taskmgr: { x: side, y: 20, w: tmW, h: 0 },
    // A little wider and taller than My Achievements, right-aligned with it; stops short of
    // the bottom so the Normal View hint bubble never covers its reply choices
    guide: { x: W - guideW - 24, y: 340, w: guideW, h: Math.max(300, Math.min(500, H - 410)) },
    stream: { x: 110, y: 20, w: mainW, h: mainH },
    projects: center(Math.min(820, W - 140), Math.min(640, H - 40), 0),
    tweeter: center(480, Math.min(620, H - 40), 16),
    expertise: center(Math.min(760, W - 140), Math.min(460, H - 40), -16),
    // h: 0 fits the window to the form so it never scrolls
    contact: { ...center(440, 680, 0), h: 0 },
  };
}

export default function Desktop() {
  const bounds = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<Layout | null>(null);
  const [selected, setSelected] = useState<WindowId | null>(null);
  const openWindow = useOS((s) => s.openWindow);

  useEffect(() => {
    const el = bounds.current;
    if (el) setLayout(computeLayout(el.clientWidth, el.clientHeight));
  }, []);

  // Introduction opens first, then My Achievements pops in next to it
  useEffect(() => {
    if (!layout) return;
    const { windows, focus } = useOS.getState();
    if (windows.taskmgr.open) return;
    const t = setTimeout(() => {
      openWindow("taskmgr");
      focus("stream");
    }, 450);
    // Then the guide chat pops in under it
    const g = setTimeout(() => {
      openWindow("guide");
      focus("stream");
    }, 1000);
    return () => {
      clearTimeout(t);
      clearTimeout(g);
    };
  }, [layout, openWindow]);

  const open = (id: WindowId) => {
    blip();
    openWindow(id);
  };

  return (
    <div className="scanlines relative flex h-dvh flex-col overflow-hidden">
      <div ref={bounds} className="wallpaper relative flex-1 overflow-hidden" onPointerDown={() => setSelected(null)}>
        <nav aria-label="Desktop icons" className="absolute left-3 top-4 z-0 flex flex-col gap-4">
          {ICONS.map(({ id, icon, label }) => (
            <button
              key={id}
              className={`desk-icon flex w-20 flex-col items-center gap-1 p-1 text-center ${selected === id ? "bg-nso-ink/15" : ""}`}
              onPointerDown={(e) => {
                e.stopPropagation();
                setSelected(id);
              }}
              onDoubleClick={() => open(id)}
              onKeyDown={(e) => e.key === "Enter" && open(id)}
              onClick={(e) => {
                // Single tap opens on touch screens
                if ((e.nativeEvent as PointerEvent).pointerType === "touch") open(id);
              }}
            >
              <PixelIcon name={icon} size={44} />
              <span
                className={`px-1 text-xs leading-tight ${selected === id ? "bg-nso-ink text-white" : "text-nso-ink [text-shadow:1px_1px_0_#fff]"}`}
              >
                {label}
              </span>
            </button>
          ))}
        </nav>

        {layout && (
          <>
            <Window id="taskmgr" bounds={bounds} initial={layout.taskmgr}>
              <TaskManager />
            </Window>
            <Window id="guide" bounds={bounds} initial={layout.guide}>
              <Guide onCommand={open} />
            </Window>
            <Window id="stream" bounds={bounds} initial={layout.stream}>
              <LiveStream onCommand={open} />
            </Window>
            <Window id="projects" bounds={bounds} initial={layout.projects}>
              <LoadGame />
            </Window>
            <Window id="tweeter" bounds={bounds} initial={layout.tweeter}>
              <Tweeter />
            </Window>
            <Window id="expertise" bounds={bounds} initial={layout.expertise}>
              <Expertise />
            </Window>
            <Window id="contact" bounds={bounds} initial={layout.contact}>
              <SuperChat />
            </Window>
          </>
        )}
      </div>
      <Taskbar />
    </div>
  );
}
