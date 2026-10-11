import type { ReactNode } from "react";
import { profile } from "@/lib/content";

export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="wallpaper min-h-dvh px-4 py-10">
      <section className="nso-window mx-auto max-w-2xl">
        <header className="nso-titlebar">
          <span className="h-3.5 w-3.5 bg-nso-ink" />
          <h1 className="font-pixel text-xs">{title}</h1>
        </header>
        <div className="nso-body flex flex-col gap-3 overflow-visible text-sm leading-relaxed">
          {children}
          <a href="/" className="px-btn mt-2 self-start px-3 py-1 text-xs">
            Back to portfolio
          </a>
        </div>
      </section>
      <p className="mt-6 text-center text-xs text-nso-purple">
        © {new Date().getFullYear()} {profile.name}. All rights reserved.
      </p>
    </div>
  );
}
