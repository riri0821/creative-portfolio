"use client";

import type { ReactNode } from "react";
import { profile } from "@/lib/content";
import { saveView, useOS, type WindowId } from "@/lib/store";
import PixelIcon, { type IconName } from "./PixelIcon";
import LiveStream from "./windows/LiveStream";
import LoadGame from "./windows/LoadGame";
import Tweeter from "./windows/Tweeter";
import Expertise from "./windows/Expertise";
import SuperChat from "./windows/SuperChat";
import TaskManager from "./windows/TaskManager";

const SECTIONS: { id: string; label: string; title: string; icon: IconName }[] = [
  { id: "stream", label: "Intro", title: "INTRODUCTION.exe", icon: "stream" },
  { id: "projects", label: "Projects", title: "LOAD_GAME_PROJECTS.exe", icon: "folder" },
  { id: "skills", label: "Experience", title: "WORK_EXPERIENCE.exe", icon: "tweeter" },
  { id: "expertise", label: "Expertise", title: "EXPERTISE.exe", icon: "expertise" },
  { id: "contact", label: "Contact", title: "CONTACT.exe", icon: "contact" },
];

const CMD_TO_SECTION: Partial<Record<WindowId, string>> = {
  projects: "projects",
  tweeter: "skills",
  expertise: "expertise",
  contact: "contact",
};

function Panel({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="nso-window scroll-mt-44 md:scroll-mt-36">
      <header className="nso-titlebar">
        <span className="h-3.5 w-3.5 bg-nso-ink" />
        <h2 className="font-pixel text-xs">{title}</h2>
      </header>
      <div className="nso-body overflow-visible">{children}</div>
      <footer className="nso-footer" aria-hidden="true">
        <span className="h-1.5 w-8 bg-nso-hot" />
      </footer>
    </section>
  );
}

function jump(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function NormalView({ allowDesktop }: { allowDesktop: boolean }) {
  const setView = useOS((s) => s.setView);

  return (
    <div className="wallpaper min-h-dvh pb-20 md:pb-10">
      {/* Sticky Task Manager header */}
      <header className="sticky top-0 z-50 border-b-2 border-nso-ink bg-nso-face/95 px-4 py-2 shadow-[0_2px_0_#93ecdf] backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 md:flex-row md:items-center md:gap-6">
          <div className="flex items-center justify-between gap-3 md:w-56 md:shrink-0">
            <div className="min-w-0">
              <p className="truncate font-pixel text-sm">{profile.name}</p>
              <p className="truncate text-[11px] text-nso-purple">{profile.role}</p>
            </div>
            {allowDesktop && (
              <button
                className="px-btn shrink-0 px-2 py-1 text-xs md:hidden"
                onClick={() => {
                  saveView("desktop");
                  setView("desktop");
                }}
              >
                Desktop
              </button>
            )}
          </div>
          <div className="flex-1">
            <TaskManager compact />
          </div>
          {allowDesktop && (
            <button
              className="px-btn hidden shrink-0 px-3 py-1 text-xs md:inline-flex"
              onClick={() => {
                saveView("desktop");
                setView("desktop");
              }}
            >
              Desktop View
            </button>
          )}
        </div>
        {/* Section links (phones use the bottom tab bar instead) */}
        <nav aria-label="Jump to section" className="mx-auto mt-2 hidden max-w-5xl gap-2 overflow-x-auto pb-0.5 md:flex">
          {SECTIONS.map((sec) => (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              onClick={(e) => {
                e.preventDefault();
                jump(sec.id);
              }}
              className="px-btn flex shrink-0 items-center gap-1.5 px-2.5 py-1 text-xs"
            >
              <PixelIcon name={sec.icon} size={16} />
              {sec.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8">
        <Panel id="stream" title="INTRODUCTION.exe">
          <LiveStream onCommand={(id) => jump(CMD_TO_SECTION[id] ?? "stream")} />
        </Panel>
        <Panel id="projects" title="LOAD_GAME_PROJECTS.exe">
          <LoadGame />
        </Panel>
        <Panel id="skills" title="WORK_EXPERIENCE.exe">
          <Tweeter />
        </Panel>
        <Panel id="expertise" title="EXPERTISE.exe">
          <Expertise />
        </Panel>
        <Panel id="contact" title="CONTACT.exe">
          <div className="mx-auto max-w-xl">
            <SuperChat />
          </div>
        </Panel>
        <footer className="flex flex-col items-center gap-1 text-center text-xs text-nso-purple">
          <p>
            <a href="/terms" className="underline-offset-2 hover:underline">
              Terms &amp; Conditions
            </a>
            <span className="mx-2">|</span>
            <a href="/privacy" className="underline-offset-2 hover:underline">
              Privacy Policy
            </a>
          </p>
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
        </footer>
      </main>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Sections"
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t-2 border-nso-ink bg-nso-face pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {SECTIONS.map((s) => (
          <button key={s.id} onClick={() => jump(s.id)} className="flex flex-col items-center gap-0.5 py-1.5 text-[11px] active:bg-nso-light">
            <PixelIcon name={s.icon} size={24} />
            {s.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
