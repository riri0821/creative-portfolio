"use client";

import { useEffect, useRef, useState } from "react";
import { posts } from "@/lib/content";
import { blip } from "@/lib/sound";

// Nearest scrolling ancestor: the window body on desktop, the page in Normal View.
function scrollParent(el: HTMLElement): HTMLElement | Window {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const o = getComputedStyle(p).overflowY;
    if (o === "auto" || o === "scroll") return p;
  }
  return window;
}

// Timeline that fills from the first circle to the last as the list scrolls past
// the middle of the view. Returns where the line starts, its length, and how much is filled.
function useTimeline(count: number) {
  const list = useRef<HTMLUListElement>(null);
  const dots = useRef<(HTMLDivElement | null)[]>([]);
  const [line, setLine] = useState({
    top: 0,
    height: 0,
    fill: 0,
    stops: [] as number[],
  });

  useEffect(() => {
    const ul = list.current;
    if (!ul) return;
    const scroller = scrollParent(ul);
    const update = () => {
      const first = dots.current[0];
      const last = dots.current[count - 1];
      if (!first || !last) return;
      const box = ul.getBoundingClientRect();
      const a = first.getBoundingClientRect();
      const b = last.getBoundingClientRect();
      const top = a.top + a.height / 2 - box.top;
      const height = b.top + b.height / 2 - box.top - top;
      const view =
        scroller === window
          ? { top: 0, height: window.innerHeight }
          : (scroller as HTMLElement).getBoundingClientRect();
      const mark = view.top + view.height * 0.6 - box.top;
      // Once scrolled to the very end, finish the trail so the last dot lights up too
      const atEnd =
        scroller === window
          ? window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 2
          : (scroller as HTMLElement).scrollTop +
              (scroller as HTMLElement).clientHeight >=
            (scroller as HTMLElement).scrollHeight - 2;
      const fill = atEnd ? height : Math.max(0, Math.min(height, mark - top));
      const stops = dots.current.map((d) =>
        d
          ? d.getBoundingClientRect().top + d.offsetHeight / 2 - box.top - top
          : 0,
      );
      setLine({ top, height, fill, stops });
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(ul);
    return () => {
      scroller.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [count]);

  return { list, dots, line };
}

export default function Tweeter() {
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const { list, dots, line } = useTimeline(posts.length);

  return (
    <div className="min-h-full bg-white">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-nso-ink bg-[#e6f7fd] px-4 py-2">
        <span className="font-pixel text-sm text-nso-sea">Work Experience</span>
      </div>
      <ul ref={list} className="relative">
        {/* Timeline track and the trail that follows the scroll */}
        <div
          className="pointer-events-none absolute left-[29px] z-[1] w-0.5 bg-nso-face"
          style={{ top: line.top, height: line.height }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-[29px] z-[1] w-0.5 bg-nso-sky"
          style={{ top: line.top, height: line.fill }}
          aria-hidden="true"
        >
          {line.fill > 0 && line.fill < line.height && (
            <span className="absolute -left-[3px] bottom-0 h-2 w-2 rounded-full bg-nso-sky shadow-[0_0_6px_#5db3e0]" />
          )}
        </div>
        {posts.map((p, i) => (
          <li
            key={p.id}
            className="flex gap-3 border-b border-nso-face px-4 py-3 hover:bg-nso-paper"
          >
            {/* Timeline dot; lights up once the trail reaches it */}
            <div
              ref={(el) => {
                dots.current[i] = el;
              }}
              className={`relative z-[1] mt-0.5 h-7 w-7 shrink-0 rounded-full border-2 border-nso-ink transition-colors duration-300 ${
                line.height > 0 && line.fill >= (line.stops[i] ?? 0) - 1
                  ? "bg-nso-sky"
                  : "bg-nso-blush"
              }`}
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="break-words text-sm font-bold leading-snug text-nso-ink">
                {p.title}
              </p>
              <p className="text-xs text-nso-purple">{p.dates}</p>
              <p className="mt-1 whitespace-pre-line break-words font-body text-sm leading-relaxed text-nso-plum">
                {p.text}
              </p>
              {p.tags.length > 0 && (
                <p className="mt-1 flex flex-wrap gap-x-2 text-sm text-nso-sea">
                  {p.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </p>
              )}
              <div className="mt-2 flex gap-6 text-xs text-nso-purple">
                <span>💬 {Math.round(p.likes / 20)}</span>
                <span>🔁 {p.retweets}</span>
                <button
                  className={
                    liked[p.id] ? "text-[#e0245e]" : "hover:text-[#e0245e]"
                  }
                  aria-pressed={!!liked[p.id]}
                  onClick={() => {
                    blip(990);
                    setLiked((l) => ({ ...l, [p.id]: !l[p.id] }));
                  }}
                >
                  {liked[p.id] ? "♥" : "♡"} {p.likes + (liked[p.id] ? 1 : 0)}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
