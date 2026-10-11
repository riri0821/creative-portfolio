"use client";

import { create } from "zustand";

export type WindowId = "stream" | "projects" | "tweeter" | "expertise" | "contact" | "taskmgr" | "guide";
export type ViewMode = "loading" | "boot" | "desktop" | "normal";

export const WINDOW_META: Record<WindowId, { title: string; label: string }> = {
  stream: { title: "INTRODUCTION.exe", label: "Introduction" },
  projects: { title: "LOAD_GAME_PROJECTS.exe", label: "Projects" },
  tweeter: { title: "WORK_EXPERIENCE.exe", label: "Work Experience" },
  expertise: { title: "EXPERTISE.exe", label: "Expertise" },
  contact: { title: "CONTACT.exe", label: "Contact" },
  taskmgr: { title: "My Achievements", label: "My Achievements" },
  guide: { title: "GUIDE.exe", label: "Guide" },
};

type WinState = { open: boolean; minimized: boolean; maximized: boolean; z: number };

type Store = {
  view: ViewMode;
  sound: boolean;
  windows: Record<WindowId, WinState>;
  focused: WindowId | null;
  topZ: number;
  setView: (v: ViewMode) => void;
  toggleSound: () => void;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  minimize: (id: WindowId) => void;
  toggleMax: (id: WindowId) => void;
  focus: (id: WindowId) => void;
  taskbarClick: (id: WindowId) => void;
};

const closed = (): WinState => ({ open: false, minimized: false, maximized: false, z: 1 });

export const useOS = create<Store>((set, get) => ({
  view: "loading",
  // Click sounds start on; the speaker icon in the taskbar mutes them
  sound: true,
  windows: {
    stream: { open: true, minimized: false, maximized: false, z: 3 },
    // Opened by the desktop a moment after the Introduction window
    taskmgr: closed(),
    projects: closed(),
    tweeter: closed(),
    expertise: closed(),
    // Opened by the desktop right after My Achievements
    guide: closed(),
    contact: closed(),
  },
  focused: "stream",
  topZ: 3,
  setView: (view) => set({ view }),
  toggleSound: () => set((s) => ({ sound: !s.sound })),
  focus: (id) =>
    set((s) => {
      if (s.focused === id && s.windows[id].z === s.topZ) return s;
      const z = s.topZ + 1;
      return { topZ: z, focused: id, windows: { ...s.windows, [id]: { ...s.windows[id], z } } };
    }),
  openWindow: (id) => {
    set((s) => ({ windows: { ...s.windows, [id]: { ...s.windows[id], open: true, minimized: false } } }));
    get().focus(id);
  },
  closeWindow: (id) =>
    set((s) => ({
      windows: { ...s.windows, [id]: closed() },
      focused: s.focused === id ? null : s.focused,
    })),
  minimize: (id) =>
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], minimized: true } },
      focused: s.focused === id ? null : s.focused,
    })),
  toggleMax: (id) =>
    set((s) => ({ windows: { ...s.windows, [id]: { ...s.windows[id], maximized: !s.windows[id].maximized } } })),
  taskbarClick: (id) => {
    const w = get().windows[id];
    if (w.minimized || get().focused !== id) get().openWindow(id);
    else get().minimize(id);
  },
}));

const VIEW_KEY = "nso-view";

export function savedView(): "desktop" | "normal" | null {
  try {
    const v = localStorage.getItem(VIEW_KEY);
    return v === "desktop" || v === "normal" ? v : null;
  } catch {
    return null;
  }
}

export function saveView(v: "desktop" | "normal") {
  try {
    localStorage.setItem(VIEW_KEY, v);
  } catch {
    /* storage unavailable */
  }
}

export function clearView() {
  try {
    localStorage.removeItem(VIEW_KEY);
  } catch {
    /* storage unavailable */
  }
}
