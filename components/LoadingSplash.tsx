// CSS-only "Now Loading..." splash shown on phones before Normal View.
export default function LoadingSplash() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-[#fae1ef] px-8">
      <p className="font-pixel text-lg text-[#e05bc8]">
        Now Loading<span className="blink">...</span>
      </p>
      <div className="h-5 w-full max-w-xs border-2 border-nso-ink bg-white p-[2px]">
        <div className="splash-fill h-full bg-nso-blue" />
      </div>
    </div>
  );
}
