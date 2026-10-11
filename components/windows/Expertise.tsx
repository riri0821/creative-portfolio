"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { skillGroups } from "@/lib/content";
import PixelIcon from "../PixelIcon";
import { blip } from "@/lib/sound";

export default function Expertise() {
  const [active, setActive] = useState(skillGroups[0].id);
  const reduced = useReducedMotion();
  const group = skillGroups.find((g) => g.id === active) ?? skillGroups[0];

  return (
    <div className="flex min-h-full flex-col gap-4 p-4 md:flex-row">
      {/* Category folders */}
      <nav aria-label="Skill categories" className="md:w-52 md:shrink-0">
        <p className="text-xs text-nso-rose">Tech Stack &amp; Tools</p>
        <h3 className="mb-3 font-pixel text-lg">My Expertise</h3>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-1">
          {skillGroups.map((g) => {
            const on = g.id === active;
            return (
              <li key={g.id}>
                <button
                  aria-pressed={on}
                  onClick={() => {
                    blip();
                    setActive(g.id);
                  }}
                  className={`flex w-full items-center gap-2 border-2 border-nso-ink px-2 py-1.5 text-left text-xs ${
                    on ? "bg-nso-ink text-white shadow-none" : "bg-white text-nso-ink shadow-[3px_3px_0_#7b59d2] hover:bg-nso-blush"
                  }`}
                >
                  <PixelIcon name="folder" size={18} />
                  <span className="flex-1 leading-tight">{g.label}</span>
                  <span
                    className={`min-w-5 px-1 text-center font-pixel text-[11px] ${on ? "bg-white text-nso-ink" : "bg-nso-ink text-white"}`}
                  >
                    {g.skills.length}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Skill tiles */}
      <section aria-label={group.label} className="min-w-0 flex-1 border-2 border-dashed border-nso-purple bg-white/60 p-3">
        <AnimatePresence mode="wait">
          <motion.ul
            key={group.id}
            className="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-3"
            initial="hide"
            animate="show"
            exit="hide"
            variants={{ show: { transition: { staggerChildren: reduced ? 0 : 0.04 } } }}
          >
            {group.skills.map((sk) => (
              <motion.li
                key={sk.name}
                variants={{ hide: { opacity: 0, y: reduced ? 0 : 6 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center justify-center gap-2 border-2 border-nso-ink bg-white px-2 py-3 text-center shadow-[3px_3px_0_#7b59d2] transition-transform hover:-translate-y-0.5"
              >
                {sk.icon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={sk.icon} alt="" className="h-8 w-8 object-contain" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center bg-nso-night font-pixel text-[11px] text-white">
                    {sk.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <span className="text-xs leading-tight text-nso-plum">{sk.name}</span>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </section>
    </div>
  );
}
