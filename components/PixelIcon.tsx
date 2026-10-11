import type { ReactElement } from "react";

// Original 16x16 pixel icons drawn from character grids.
// Each character maps to a palette color; "." is transparent.

const PALETTE: Record<string, string> = {
  k: "#2a1a5e", // outline
  i: "#4d21cb", // ink purple
  p: "#7b59d2", // purple
  l: "#cfa8f5", // lavender
  w: "#ffffff",
  f: "#fcf1fc",
  h: "#ff77a8", // hot pink
  r: "#e0245e", // red
  c: "#70e6ff", // cyan
  b: "#5db3e0", // blue
  m: "#93ecdf", // mint
  y: "#ffd166", // yellow
  g: "#7ad97a", // green
  s: "#c9c3d9", // silver
};

const ICONS: Record<string, string[]> = {
  expertise: [
    "................",
    "................",
    ".....kkkkkk.....",
    "....kk....kk....",
    "....k......k....",
    ".kkkkkkkkkkkkkk.",
    ".khhhhhhhhhhhhk.",
    ".khhhhhhhhhhhhk.",
    ".kkkkkkyykkkkkk.",
    ".kffffkyykffffk.",
    ".kffffkkkkffffk.",
    ".kfffffffffffpk.",
    ".kffffffffffppk.",
    ".kfffffffffpppk.",
    ".kkkkkkkkkkkkkk.",
    "................",
  ],
  stream: [
    "................",
    "..kkkkkkkkkkkk..",
    ".kwwwwwwwwwwwwk.",
    ".kwccccccccccwk.",
    ".kwccchhcccccwk.",
    ".kwcchhhhccccwk.",
    ".kwccchhcccccwk.",
    ".kwccccccmmccwk.",
    ".kwcccccmmmmcwk.",
    ".kwccccccccccwk.",
    ".kwwwwwwwwwrwwk.",
    "..kkkkkkkkkkkk..",
    "......kssk......",
    "....kkkkkkkk....",
    "....kllllllk....",
    "....kkkkkkkk....",
  ],
  folder: [
    "................",
    "................",
    ".kkkkk..........",
    ".kyyyyk.........",
    ".kyyyyykkkkkkkk.",
    ".kyyyyyyyyyyyyk.",
    ".kkkkkkkkkkkkkkk",
    ".kyfffffffffffyk",
    ".kyfffffffffffyk",
    ".kyfffhhfhhfffyk",
    ".kyfffhhhhhfffyk",
    ".kyffffhhhffffyk",
    ".kyfffffhfffffyk",
    ".kyyyyyyyyyyyyyk",
    ".kkkkkkkkkkkkkkk",
    "................",
  ],
  tweeter: [
    "................",
    "...kkkkkkkkkk...",
    "..kccccccccccck.",
    ".kccwwwwwwwwwcck",
    ".kcwwhhwwhhwwwck",
    ".kcwhhhhhhhhwwck",
    ".kcwhhhhhhhhwwck",
    ".kcwwhhhhhhwwwck",
    ".kcwwwhhhhwwwwck",
    ".kcwwwwhhwwwwwck",
    ".kccwwwwwwwwwcck",
    "..kcccccccccck..",
    "...kkkcckkkkk...",
    ".....kcck.......",
    "......kk........",
    "................",
  ],
  contact: [
    "................",
    "................",
    ".kkkkkkkkkkkkkk.",
    ".khwwwwwwwwwwhk.",
    ".kwhwwwwwwwwhwk.",
    ".kwwhwwwwwwhwwk.",
    ".kwwwhwwwwhwwwk.",
    ".kwwwwhrrhwwwwk.",
    ".kwwwwrrrrwwwwk.",
    ".kwwwwrrrrwwwwk.",
    ".kwwwwwrrwwwwwk.",
    ".kwwwwwwwwwwwwk.",
    ".kkkkkkkkkkkkkk.",
    "..........yy....",
    ".........yyyy...",
    "..........yy....",
  ],
  taskmgr: [
    "................",
    ".kkkkkkkkkkkkkk.",
    ".kiiiiiiiiiiiik.",
    ".kkkkkkkkkkkkkk.",
    ".kwwwwwwwwwwwwk.",
    ".kwwwwwwwwwhhwk.",
    ".kwwwwwwwwwhhwk.",
    ".kwwwwwccwwhhwk.",
    ".kwwwwwccwwhhwk.",
    ".kwwmmwccwwhhwk.",
    ".kwwmmwccwwhhwk.",
    ".kwwmmwccwwhhwk.",
    ".kwwwwwwwwwwwwk.",
    ".kkkkkkkkkkkkkk.",
    "................",
    "................",
  ],
  // JINE-style chat: a blue bubble from the guide and a green reply
  guide: [
    "................",
    ".kkkkkkkkkk.....",
    ".kccccccccck....",
    ".kcwwwwwwcck....",
    ".kccccccccck....",
    ".kcwwwwcccck....",
    ".kkkkccccckk....",
    "....kck.kkkkkkk.",
    ".....k.kgggggggk",
    ".......kgwwwwwgk",
    ".......kgggggggk",
    ".......kgwwwgggk",
    ".......kkggggkkk",
    "...........kgk..",
    "............k...",
    "................",
  ],
  file: [
    "................",
    "...kkkkkkkkk....",
    "...kwwwwwwwkk...",
    "...kwkkkkwwkwk..",
    "...kwwwwwwwkkkk.",
    "...kwkkkkkkwwwk.",
    "...kwwwwwwwwwwk.",
    "...kwkkkkkkkkwk.",
    "...kwwwwwwwwwwk.",
    "...kwkkkkkkkkwk.",
    "...kwwwwwwwwwwk.",
    "...kwkkkkkkwwwk.",
    "...kwwwwwwwwwwk.",
    "...kkkkkkkkkkkk.",
    "................",
    "................",
  ],
  heart: [
    "................",
    "................",
    "...kkk...kkk....",
    "..khhhk.khhhk...",
    ".khwhhhkhhhhhk..",
    ".khwhhhhhhhhhk..",
    ".khhhhhhhhhhhk..",
    ".khhhhhhhhhhhk..",
    "..khhhhhhhhhk...",
    "...khhhhhhhk....",
    "....khhhhhk.....",
    ".....khhhk......",
    "......khk.......",
    ".......k........",
    "................",
    "................",
  ],
  speaker: [
    "................",
    "................",
    "......kk........",
    ".....kik........",
    "....kiik...k....",
    ".kkkiiik....k...",
    ".kliiiik.k..k...",
    ".kliiiik..k..k..",
    ".kliiiik..k..k..",
    ".kliiiik.k..k...",
    ".kkkiiik....k...",
    "....kiik...k....",
    ".....kik........",
    "......kk........",
    "................",
    "................",
  ],
  mute: [
    "................",
    "................",
    "......kk........",
    ".....kik........",
    "....kiik........",
    ".kkkiiik........",
    ".kliiiik.r...r..",
    ".kliiiik..r.r...",
    ".kliiiik...r....",
    ".kliiiik..r.r...",
    ".kkkiiik.r...r..",
    "....kiik........",
    ".....kik........",
    "......kk........",
    "................",
    "................",
  ],
  moon: [
    "................",
    "................",
    "......kkkk......",
    "....kkyyyyk.....",
    "...kyyyyykk.....",
    "..kyyyyyk.......",
    "..kyyyyk........",
    ".kyyyyyk........",
    ".kyyyyyk........",
    ".kyyyyyyk.......",
    "..kyyyyyykk..k..",
    "..kyyyyyyyykky..",
    "...kkyyyyyyyk...",
    ".....kkkkkkk....",
    "................",
    "................",
  ],
  sun: [
    "................",
    ".......y........",
    "..y....y....y...",
    "...y.......y....",
    "......kkkk......",
    ".....kyyyyk.....",
    "....kyyyyyyk....",
    ".yy.kyyyyyyk.yy.",
    "....kyyyyyyk....",
    ".....kyyyyk.....",
    "......kkkk......",
    "...y.......y....",
    "..y....y....y...",
    ".......y........",
    "................",
    "................",
  ],
  start: [
    "................",
    ".kkkkkkkkkkkkkk.",
    ".khhhhhhkcccccck",
    ".khhhhhhkcccccck",
    ".khhhhhhkcccccck",
    ".khhhhhhkcccccck",
    ".khhhhhhkcccccck",
    ".kkkkkkkkkkkkkkk",
    ".kmmmmmmkyyyyyyk",
    ".kmmmmmmkyyyyyyk",
    ".kmmmmmmkyyyyyyk",
    ".kmmmmmmkyyyyyyk",
    ".kmmmmmmkyyyyyyk",
    ".kkkkkkkkkkkkkkk",
    "................",
    "................",
  ],
};

export type IconName = keyof typeof ICONS;

export default function PixelIcon({
  name,
  size = 32,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const rows = ICONS[name];
  const rects: ReactElement[] = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const color = PALETTE[row[x]];
      if (color) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />);
    }
  });
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className={`pixel shrink-0 ${className}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rects}
    </svg>
  );
}
