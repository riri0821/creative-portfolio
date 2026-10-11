"use client";

import { useEffect, useState } from "react";
import { useOS } from "@/lib/store";
import BootScreen from "./BootScreen";
import Desktop from "./Desktop";
import NormalView from "./NormalView";

const MOBILE = "(max-width: 767px)";

export default function App() {
  const view = useOS((s) => s.view);
  const setView = useOS((s) => s.setView);
  const [narrow, setNarrow] = useState(false);

  // Every visit starts on the boot screen while the site's images load.
  // Phones continue to Normal View by themselves; wider screens pick a view.
  useEffect(() => {
    setNarrow(window.matchMedia(MOBILE).matches);
    setView("boot");
  }, [setView]);

  // Resizing a desktop browser below 768px switches to Normal View live.
  useEffect(() => {
    const mq = window.matchMedia(MOBILE);
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (view === "loading") return <div className="h-dvh bg-[#fae1ef]" />;
  if (view === "boot") return <BootScreen auto={narrow ? "normal" : undefined} />;
  if (narrow) return <NormalView allowDesktop={false} />;
  if (view === "desktop") return <Desktop />;
  return <NormalView allowDesktop />;
}
