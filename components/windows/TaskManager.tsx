"use client";

import { motion, useReducedMotion } from "framer-motion";
import { stats } from "@/lib/content";

export default function TaskManager({ compact = false }: { compact?: boolean }) {
  const reduced = useReducedMotion();

  if (compact) {
    return (
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-3">
        {stats.map((s) => (
          <li key={s.id} className="min-w-0">
            <p className="text-[11px] leading-tight text-nso-sea">{s.label}</p>
            <p className="flex flex-wrap items-baseline gap-x-1 leading-none">
              <span className="font-pixel text-sm">{s.value}</span>
              <span className="text-[11px] text-nso-purple">
                {s.max ? `/ ${s.max} ` : ""}
                {s.suffix ? `${s.suffix} ` : ""}
                {s.unit}
              </span>
            </p>
            <div className="mt-0.5 h-1.5 bg-nso-face">
              <div className="h-full bg-nso-sky" style={{ width: `${s.percent}%` }} />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-5 p-4">
      {stats.map((s, i) => (
        <li key={s.id} className="grid grid-cols-[48px_1fr_64px] items-center gap-2">
          {s.icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.icon} alt="" className="h-12 w-12 object-contain" />
          ) : (
            <div className="h-10 w-10 border-2 border-nso-ink bg-nso-blush" aria-hidden="true" />
          )}
          <div className="min-w-0">
            <p className="text-xs leading-tight text-nso-sea">{s.label}</p>
            <p className="flex items-baseline gap-1">
              <span className="font-pixel text-xl leading-none">{s.value}</span>
              {s.max && <span className="text-xs text-nso-purple">/ {s.max}</span>}
              {s.suffix && <span className="text-xs text-nso-purple">{s.suffix}</span>}
            </p>
            <p className="text-[11px] text-nso-purple">{s.unit}</p>
          </div>
          <div className="relative h-12 bg-[#dcc6ee]">
            <motion.div
              className="absolute bottom-0 right-0 w-2 bg-nso-sky"
              initial={reduced ? false : { height: 0 }}
              animate={{ height: `${s.percent}%` }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
